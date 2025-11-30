import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentComponent } from './student.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';
import { DestroyRef } from '@angular/core';

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;
  let mockStudentService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockDestroyRef: any;
  //let formBuilder: FormBuilder;

  const mockStudent: Student = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    level: 'Beginner',
    matter: 'Math'
  };

  beforeEach(async () => {
    mockStudentService = {
      getStudent: jest.fn().mockReturnValue(of(mockStudent)),
      createStudent: jest.fn().mockReturnValue(of(mockStudent)),
      updateStudent: jest.fn().mockReturnValue(of(mockStudent))
    };

    mockRouter = {
      navigate: jest.fn()
    };

    mockActivatedRoute = {
      queryParams: of({})
    };

    mockDestroyRef = {
      onDestroy: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [StudentComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        { provide: StudentService, useValue: mockStudentService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DestroyRef, useValue: mockDestroyRef }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
    //formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values and disabled id', () => {
    expect(component.studentForm).toBeDefined();
    expect(component.studentForm.get('id')?.disabled).toBe(true);
    expect(component.studentForm.get('firstname')?.value).toBe('');
    expect(component.studentForm.get('lastname')?.value).toBe('');
    expect(component.studentForm.get('level')?.value).toBe('');
    expect(component.studentForm.get('matter')?.value).toBe('');
  });

  it('should have required validators for firstname, lastname, level, and matter', () => {
    const firstnameControl = component.studentForm.get('firstname');
    firstnameControl?.setValue('');
    expect(firstnameControl?.valid).toBeFalsy();
    expect(firstnameControl?.errors?.['required']).toBeTruthy();

    const lastnameControl = component.studentForm.get('lastname');
    lastnameControl?.setValue('');
    expect(lastnameControl?.valid).toBeFalsy();
    expect(lastnameControl?.errors?.['required']).toBeTruthy();

    const levelControl = component.studentForm.get('level');
    levelControl?.setValue('');
    expect(levelControl?.valid).toBeFalsy();
    expect(levelControl?.errors?.['required']).toBeTruthy();

    const matterControl = component.studentForm.get('matter');
    matterControl?.setValue('');
    expect(matterControl?.valid).toBeFalsy();
    expect(matterControl?.errors?.['required']).toBeTruthy();
  });

  it('should not call loadStudent if no id in query params', () => {
    jest.spyOn(component, 'loadStudent');
    mockActivatedRoute.queryParams = of({});
    component.ngOnInit();
    expect(component.loadStudent).not.toHaveBeenCalled();
    expect(component.isEditMode).toBe(false);
  });

  describe('ngOnInit - Edit Mode', () => {
    beforeEach(() => {
      jest.spyOn(component, 'loadStudent');
      mockActivatedRoute.queryParams = of({ id: '1' });
      component.ngOnInit();
    });

    it('should call loadStudent if id is in query params', () => {
      expect(component.loadStudent).toHaveBeenCalledWith(1);
    });
  });

  it('should return form controls via the form getter', () => {
    expect(component.form).toEqual(component.studentForm.controls);
  });

  describe('onSubmit', () => {
    let alertSpy: jest.SpyInstance;

    beforeEach(() => {
      alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
      alertSpy.mockRestore();
    });

    it('should not submit if the form is invalid', () => {
      component.studentForm.get('firstname')?.setValue(''); // Make form invalid
      component.submitted = false;
      component.onSubmit();
      expect(component.submitted).toBe(true);
      expect(mockStudentService.createStudent).not.toHaveBeenCalled();
      expect(mockStudentService.updateStudent).not.toHaveBeenCalled();
    });

    it('should call createStudent and navigate on success', () => {
      component.studentForm.setValue({
        id: '',
        firstname: 'Test',
        lastname: 'User',
        level: 'Advanced',
        matter: 'Science'
      });
      component.submitted = false;
      jest.spyOn(component, 'onReset');

      component.onSubmit();

      expect(component.submitted).toBe(true);
      expect(mockStudentService.createStudent).toHaveBeenCalledWith({
        id: undefined,
        firstName: 'Test',
        lastName: 'User',
        level: 'Advanced',
        matter: 'Science'
      });
      expect(alertSpy).toHaveBeenCalledWith('Étudiant créé avec succès.');
      expect(component.onReset).toHaveBeenCalled();
      expect(component.isEditMode).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/students']);
    });

    it('should call updateStudent and navigate on success in edit mode', () => {
      component.isEditMode = true;
      component.studentForm.setValue({
        id: 1,
        firstname: 'Updated',
        lastname: 'User',
        level: 'Expert',
        matter: 'Art'
      });
      component.submitted = false;
      jest.spyOn(component, 'onReset');

      component.onSubmit();

      expect(component.submitted).toBe(true);
      expect(mockStudentService.updateStudent).toHaveBeenCalledWith({
        id: 1,
        firstName: 'Updated',
        lastName: 'User',
        level: 'Expert',
        matter: 'Art'
      });
      expect(alertSpy).toHaveBeenCalledWith('Étudiant modifié avec succès.');
      expect(component.onReset).toHaveBeenCalled();
      expect(component.isEditMode).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/students']);
    });

    it('should handle 400 error during submission', () => {
      component.studentForm.setValue({
        id: '',
        firstname: 'Test',
        lastname: 'User',
        level: 'Advanced',
        matter: 'Science'
      });
      mockStudentService.createStudent.mockReturnValueOnce(throwError(() => ({ status: 400 })));

      component.onSubmit();

      expect(alertSpy).toHaveBeenCalledWith('Données invalides — vérifiez les champs.');
      expect(component.submitted).toBe(false);
    });

    it('should handle 404 error during submission', () => {
      component.isEditMode = true;
      component.studentForm.setValue({
        id: 1,
        firstname: 'Test',
        lastname: 'User',
        level: 'Advanced',
        matter: 'Science'
      });
      mockStudentService.updateStudent.mockReturnValueOnce(throwError(() => ({ status: 404 })));

      component.onSubmit();

      expect(alertSpy).toHaveBeenCalledWith('Étudiant non trouvé.');
      expect(component.submitted).toBe(false);
    });

    it('should handle 500 error during submission', () => {
      component.studentForm.setValue({
        id: '',
        firstname: 'Test',
        lastname: 'User',
        level: 'Advanced',
        matter: 'Science'
      });
      mockStudentService.createStudent.mockReturnValueOnce(throwError(() => ({ status: 500 })));

      component.onSubmit();

      expect(alertSpy).toHaveBeenCalledWith('Erreur serveur — réessayez plus tard.');
      expect(component.submitted).toBe(false);
    });

    it('should handle generic error during submission', () => {
      component.studentForm.setValue({
        id: '',
        firstname: 'Test',
        lastname: 'User',
        level: 'Advanced',
        matter: 'Science'
      });
      const error = new Error('Generic error message');
      mockStudentService.createStudent.mockReturnValueOnce(throwError(() => error));

      component.onSubmit();

      expect(alertSpy).toHaveBeenCalledWith('Erreur : Generic error message');
      expect(component.submitted).toBe(false);
    });
  });

  describe('onReset', () => {
    it('should reset the form and disable id in create mode', () => {
      component.isEditMode = false;
      component.studentForm.setValue({
        id: '1', // Set some value
        firstname: 'Test',
        lastname: 'User',
        level: 'Advanced',
        matter: 'Science'
      });
      component.studentForm.get('id')?.enable(); // Enable to test disabling

      component.onReset();

      expect(component.studentForm.get('firstname')?.value).toBeNull();
      expect(component.studentForm.get('lastname')?.value).toBeNull();
      expect(component.studentForm.get('id')?.disabled).toBe(true);
      expect(component.submitted).toBe(false);
      expect(component.isEditMode).toBe(false);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to /students in edit mode', () => {
      component.isEditMode = true;
      component.onReset();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/students']);
      expect(component.submitted).toBe(false);
      expect(component.isEditMode).toBe(false);
    });
  });

  describe('loadStudent', () => {
    let consoleErrorSpy: jest.SpyInstance;
    let alertSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      alertSpy.mockRestore();
    });

    it('should load student data and patch form on success', () => {
      component.loadStudent(1);
      expect(mockStudentService.getStudent).toHaveBeenCalledWith(1);
      expect(component.isEditMode).toBe(true);
      expect(component.studentForm.get('id')?.value).toBe(mockStudent.id);
      expect(component.studentForm.get('firstname')?.value).toBe(mockStudent.firstName);
    });

    it('should handle error when loading student', () => {
      const error = new Error('Load error');
      mockStudentService.getStudent.mockReturnValueOnce(throwError(() => error));

      component.loadStudent(1);

      expect(mockStudentService.getStudent).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur lors du chargement de l\'étudiant', error);
      expect(alertSpy).toHaveBeenCalledWith('Impossible de charger l\'étudiant. Vérifiez l\'ID fourni.');
      expect(component.isEditMode).toBe(false);
    });
  });
});
