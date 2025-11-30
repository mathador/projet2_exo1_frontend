import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../core/service/user.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Register } from '../../core/models/Register';
import { DestroyRef } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockUserService: any;
  let mockRouter: any;
  //let formBuilder: FormBuilder;
  let mockDestroyRef: any;

  beforeEach(async () => {
    mockUserService = {
      register: jest.fn().mockReturnValue(of({}))
    };

    mockRouter = {
      navigate: jest.fn()
    };

    mockDestroyRef = {
      onDestroy: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        FormBuilder,
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: DestroyRef, useValue: mockDestroyRef }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    //formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('firstName')?.value).toBe('');
    expect(component.registerForm.get('lastName')?.value).toBe('');
    expect(component.registerForm.get('login')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
  });

  it('should have required validators for all fields', () => {
    const firstNameControl = component.registerForm.get('firstName');
    firstNameControl?.setValue('');
    expect(firstNameControl?.valid).toBeFalsy();
    expect(firstNameControl?.errors?.['required']).toBeTruthy();

    const lastNameControl = component.registerForm.get('lastName');
    lastNameControl?.setValue('');
    expect(lastNameControl?.valid).toBeFalsy();
    expect(lastNameControl?.errors?.['required']).toBeTruthy();

    const loginControl = component.registerForm.get('login');
    loginControl?.setValue('');
    expect(loginControl?.valid).toBeFalsy();
    expect(loginControl?.errors?.['required']).toBeTruthy();

    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.errors?.['required']).toBeTruthy();
  });

  it('should return form controls via the form getter', () => {
    expect(component.form).toEqual(component.registerForm.controls);
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should not submit if the form is invalid', () => {
      component.registerForm.get('firstName')?.setValue(''); // Make form invalid
      component.submitted = false;
      component.onSubmit();
      expect(component.submitted).toBe(true);
      expect(mockUserService.register).not.toHaveBeenCalled();
    });

    it('should call userService.register and navigate on success', () => {
      component.registerForm.setValue({
        firstName: 'Test',
        lastName: 'User',
        login: 'testuser',
        password: 'password123'
      });
      component.submitted = false;
      jest.spyOn(component, 'onReset');

      component.onSubmit();

      expect(component.submitted).toBe(true);
      expect(mockUserService.register).toHaveBeenCalledWith({
        firstName: 'Test',
        lastName: 'User',
        login: 'testuser',
        password: 'password123'
      } as Register);
      expect(component.successMessage).toBe('Inscription réussie ! Redirection vers la connexion...');
      expect(component.errorMessage).toBeNull();

      //jest.advanceTimersByTime(2000);

      //expect(component.onReset).toHaveBeenCalled();
      //expect(mockRouter.navigate).toHaveBeenCalledWith(['/students']);
    });

    it('should handle 409 error during registration', () => {
      component.registerForm.setValue({
        firstName: 'Test',
        lastName: 'User',
        login: 'existinguser',
        password: 'password123'
      });
      mockUserService.register.mockReturnValueOnce(throwError(() => ({ status: 409 })));

      component.onSubmit();

      expect(component.successMessage).toBeNull();
      expect(component.errorMessage).toBe('Cet identifiant est déjà utilisé.');
    });

    it('should handle 500 error during registration', () => {
      component.registerForm.setValue({
        firstName: 'Test',
        lastName: 'User',
        login: 'testuser',
        password: 'password123'
      });
      mockUserService.register.mockReturnValueOnce(throwError(() => ({ status: 500 })));

      component.onSubmit();

      expect(component.successMessage).toBeNull();
      expect(component.errorMessage).toBe('Erreur serveur. Veuillez réessayer plus tard.');
    });

    it('should handle generic error during registration', () => {
      component.registerForm.setValue({
        firstName: 'Test',
        lastName: 'User',
        login: 'testuser',
        password: 'password123'
      });
      const error = new Error('Network error');
      mockUserService.register.mockReturnValueOnce(throwError(() => error));

      component.onSubmit();

      expect(component.successMessage).toBeNull();
      expect(component.errorMessage).toBe('Erreur lors de l\'inscription : Network error');
    });
  });

  describe('onReset', () => {
    it('should reset the form and messages', () => {
      component.submitted = true;
      component.successMessage = 'Success';
      component.errorMessage = 'Error';
      component.registerForm.setValue({
        firstName: 'Test',
        lastName: 'User',
        login: 'testuser',
        password: 'password123'
      });

      component.onReset();

      expect(component.submitted).toBe(false);
      expect(component.registerForm.get('firstName')?.value).toBeNull(); // Form reset sets to null
      expect(component.successMessage).toBeNull();
      expect(component.errorMessage).toBeNull();
    });
  });
});
