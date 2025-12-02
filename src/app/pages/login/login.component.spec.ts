import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../core/service/user.service';
import { AuthStateService } from '../../core/service/auth-state.service';
import { Login } from '../../core/models/Login';
import { DestroyRef } from '@angular/core';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let mockUserService: any;
    let mockAuthStateService: any;
    let mockRouter: any;
    let mockDestroyRef: any;
    let alertSpy: jest.Mock;
    let localStorageSpy: jest.Mock;
    let consoleDebugSpy: jest.SpyInstance;

    // Store original global functions
    let originalAlert: (message?: any) => void;
    let originalRemoveItem: (key: string) => void;

    beforeEach(async () => {
        mockUserService = {
            login: jest.fn().mockReturnValue(of({ status: 200 })),
            logout: jest.fn().mockReturnValue(of({}))
        };

        mockAuthStateService = {
            setUser: jest.fn()
        };

        mockRouter = {
            navigate: jest.fn()
        };

        mockDestroyRef = {
            onDestroy: jest.fn()
        };

        // Store original functions and replace with jest.fn() via direct assignment
        originalAlert = window.alert;
        window.alert = jest.fn();
        alertSpy = window.alert as jest.Mock;

        originalRemoveItem = localStorage.removeItem;
        localStorage.removeItem = jest.fn();
        localStorageSpy = localStorage.removeItem as jest.Mock;

        consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => { });

        await TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                FormBuilder,
                { provide: UserService, useValue: mockUserService },
                { provide: AuthStateService, useValue: mockAuthStateService },
                { provide: Router, useValue: mockRouter },
                { provide: DestroyRef, useValue: mockDestroyRef }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        // Restore original global functions
        window.alert = originalAlert;
        localStorage.removeItem = originalRemoveItem;

        consoleDebugSpy.mockRestore();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with empty values', () => {
        expect(component.loginForm).toBeDefined();
        expect(component.loginForm.get('login')?.value).toBe('');
        expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should have required validators for login and password', () => {
        const loginControl = component.loginForm.get('login');
        loginControl?.setValue('');
        expect(loginControl?.valid).toBeFalsy();
        expect(loginControl?.errors?.['required']).toBeTruthy();

        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('');
        expect(passwordControl?.valid).toBeFalsy();
        expect(passwordControl?.errors?.['required']).toBeTruthy();
    });

    it('should return form controls via the form getter', () => {
        expect(component.form).toEqual(component.loginForm.controls);
    });

    describe('onSubmit', () => {
        it('should not submit if the form is invalid', () => {
            component.loginForm.get('login')?.setValue(''); // Make form invalid
            component.submitted = false;
            component.onSubmit();
            expect(component.submitted).toBe(true);
            expect(mockUserService.login).not.toHaveBeenCalled();
        });

        it('should call userService.login, set user state, and navigate on success', () => {
            component.loginForm.setValue({
                login: 'testuser',
                password: 'password123'
            });
            component.submitted = false;

            component.onSubmit();

            expect(mockUserService.login).toHaveBeenCalledWith({
                login: 'testuser',
                password: 'password123'
            } as Login);
            expect(consoleDebugSpy).toHaveBeenCalledWith('Login réussi, statut : 200');
            expect(mockAuthStateService.setUser).toHaveBeenCalledWith({
                login: 'testuser',
                firstName: 'testuser',
                lastName: ''
            });
            expect(mockRouter.navigate).toHaveBeenCalledWith(['students']);
        });

        it('should handle 400 error during login', () => {
            component.loginForm.setValue({
                login: 'baduser',
                password: 'badpassword'
            });
            mockUserService.login.mockReturnValueOnce(throwError(() => ({ status: 400 })));

            component.onSubmit();

            expect(alertSpy).toHaveBeenCalledWith('Identifiants invalides — vérifiez votre login/mot de passe.');
            expect(localStorageSpy).toHaveBeenCalledWith('authToken');
            expect(mockUserService.logout).toHaveBeenCalled();
            expect(component.submitted).toBe(false);
        });

        it('should handle 401 error during login', () => {
            component.loginForm.setValue({
                login: 'baduser',
                password: 'badpassword'
            });
            mockUserService.login.mockReturnValueOnce(throwError(() => ({ status: 401 })));

            component.onSubmit();

            expect(alertSpy).toHaveBeenCalledWith('Identifiants invalides — vérifiez votre login/mot de passe.');
            expect(localStorageSpy).toHaveBeenCalledWith('authToken');
            expect(mockUserService.logout).toHaveBeenCalled();
            expect(component.submitted).toBe(false);
        });

        it('should handle 500 error during login', () => {
            component.loginForm.setValue({
                login: 'erroruser',
                password: 'errorpassword'
            });
            mockUserService.login.mockReturnValueOnce(throwError(() => ({ status: 500 })));

            component.onSubmit();

            expect(alertSpy).toHaveBeenCalledWith('Erreur serveur — réessayez plus tard.');
            expect(localStorageSpy).toHaveBeenCalledWith('authToken');
            expect(mockUserService.logout).toHaveBeenCalled();
            expect(component.submitted).toBe(false);
        });

        it('should handle generic error during login', () => {
            component.loginForm.setValue({
                login: 'genericuser',
                password: 'genericpassword'
            });
            const error = new Error('Network error');
            mockUserService.login.mockReturnValueOnce(throwError(() => error));

            component.onSubmit();

            expect(alertSpy).toHaveBeenCalledWith('Erreur de connexion : Network error');
            expect(localStorageSpy).toHaveBeenCalledWith('authToken');
            expect(mockUserService.logout).toHaveBeenCalled();
            expect(component.submitted).toBe(false);
        });

        it('should handle generic error without message during login', () => {
            component.loginForm.setValue({
                login: 'genericuser',
                password: 'genericpassword'
            });
            const error = { someProperty: 'someValue' }; // Error object without 'message'
            mockUserService.login.mockReturnValueOnce(throwError(() => error));

            component.onSubmit();

            expect(alertSpy).toHaveBeenCalledWith('Erreur de connexion : {"someProperty":"someValue"}');
            expect(localStorageSpy).toHaveBeenCalledWith('authToken');
            expect(mockUserService.logout).toHaveBeenCalled();
            expect(component.submitted).toBe(false);
        });

        it('should handle error during logout cleanup', () => {
            component.loginForm.setValue({
                login: 'erroruser',
                password: 'errorpassword'
            });
            mockUserService.login.mockReturnValueOnce(throwError(() => ({ status: 400 })));
            const logoutError = new Error('Logout failed');
            mockUserService.logout.mockReturnValueOnce(throwError(() => logoutError));

            component.onSubmit();

            expect(consoleDebugSpy).toHaveBeenCalledWith('Erreur lors du logout de nettoyage', logoutError);
            expect(localStorageSpy).toHaveBeenCalledWith('authToken');
            expect(mockUserService.logout).toHaveBeenCalled();
            expect(component.submitted).toBe(false);
        });
    });

    describe('onReset', () => {
        it('should reset the form and submitted flag', () => {
            component.submitted = true;
            component.loginForm.setValue({
                login: 'testuser',
                password: 'password123'
            });

            component.onReset();

            expect(component.submitted).toBe(false);
            expect(component.loginForm.get('login')?.value).toBeNull(); // Form reset sets to null
            expect(component.loginForm.get('password')?.value).toBeNull();
        });
    });
});
