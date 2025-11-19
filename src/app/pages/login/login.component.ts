import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { Login } from '../../core/models/Login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
            .subscribe(
                () => {
                    alert('SUCCESS!! :-)');
                    // TODO : router l'utilisateur vers la page de login
                },
            );
    }

    onReset(): void {
        this.submitted = false;
        this.loginForm.reset();
    }
}
