import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { AuthStateService } from '../../core/service/auth-state.service';
import { StudentService } from '../../core/service/student.service';
import { Login } from '../../core/models/Login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [CommonModule, MaterialModule],
    templateUrl: './login.component.html',
    standalone: true,
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly authStateService = inject(AuthStateService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);
    private readonly studentService = inject(StudentService);

    loginForm: FormGroup = new FormGroup({});
    submitted: boolean = false;

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            login: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    get form() {
        return this.loginForm.controls;
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        const loginUser: Login = {
            login: this.loginForm.get('login')?.value,
            password: this.loginForm.get('password')?.value
        };
        this.userService.login(loginUser)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.debug('Login réussi, statut : ' + response.status);
                    // Store user info for header display
                    const loginValue = this.loginForm.get('login')?.value;
                    this.authStateService.setUser({
                      login: loginValue,
                      // Note: firstName and lastName could be fetched from server if available
                      firstName: loginValue?.split('@')[0] || loginValue || 'User',
                      lastName: ''
                    });
                    this.router.navigate(['students']);
                },
                error: (err) => {
                    // err may be HttpErrorResponse
                    // On login error we attempt to clear any server-side session cookie
                    // by calling the logout endpoint (server should expire the cookie).
                    if (err && (err.status === 400 || err.status === 401)) {
                        alert('Identifiants invalides — vérifiez votre login/mot de passe.');
                    } else if (err && err.status >= 500) {
                        alert('Erreur serveur — réessayez plus tard.');
                    } else {
                        // network or unknown error
                        console.debug(err);
                        const msg = err?.message ?? JSON.stringify(err);
                        alert('Erreur de connexion : ' + msg);
                    }

                    // clear any client-side stored token
                    localStorage.removeItem('authToken');

                    // call logout endpoint to clear HttpOnly cookie if present
                    this.userService.logout().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                        next: () => {
                            console.debug('Session cleared on server (logout).');
                        },
                        error: (logoutErr) => {
                            console.debug('Erreur lors du logout de nettoyage', logoutErr);
                        }
                    });

                    this.submitted = false;
                }
            });
    }

    onReset(): void {
        this.submitted = false;
        this.loginForm.reset();
    }
}
