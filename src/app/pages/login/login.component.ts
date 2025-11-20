import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { StudentService } from '../../core/service/studentservice';
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
    private readonly formBuilder = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);

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
                    // Handle different authentication mechanisms:
                    // 1. Token in body (e.g., { "token": "eyJ..." })
                    // 2. Token in Authorization header (e.g., "Bearer eyJ...")
                    // 3. Session cookie via Set-Cookie header (automatic, but we can log it)

                    let token: string | null = null;
                    let cookieReceived: boolean = false;

                    // Try to extract token from body
                    token = (response as any)?.body?.token ?? null;

                    // If no body token, try Authorization header
                    if (!token && (response as any)?.headers) {
                        const authHeader = (response as any).headers.get('Authorization') ?? (response as any).headers.get('authorization');
                        if (authHeader) {
                            token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
                        }
                    }

                    // Determine authentication success
                    if (token) {
                        localStorage.setItem('authToken', token);
                        alert('Connexion réussie. Token JWT stocké.');
                    } else {
                        
                    }
                    this.router.navigate(['students']);
                },
                error: (err) => {
                    // err may be HttpErrorResponse
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
                    this.submitted = false;
                }
            });
    }

    onReset(): void {
        this.submitted = false;
        this.loginForm.reset();
    }
}
