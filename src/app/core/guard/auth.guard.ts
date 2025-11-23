import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { StudentService } from '../service/student.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private readonly studentService: StudentService, private readonly router: Router) { }

    canActivate(): Observable<boolean | UrlTree> | boolean | UrlTree {
        // Quick client-side check: if a token is stored, allow.
        const token = localStorage.getItem('authToken');
        if (token) {
            return true;
        }

        // Otherwise perform a lightweight authenticated request to verify cookie-based session.
        return this.studentService.getStudent(1).pipe(
            map(() => true),
            catchError(() => {
                // Not authenticated: redirect to login
                return of(this.router.createUrlTree(['/login']));
            })
        );
    }
}
