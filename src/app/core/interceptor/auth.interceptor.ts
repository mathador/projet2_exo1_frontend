import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // Récupérer le token JWT depuis localStorage
        const token = localStorage.getItem('authToken');

        // Si un token existe, l'ajouter à l'en-tête Authorization
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        // Les cookies seront envoyés automatiquement si withCredentials est true
        // Note: pour que les cookies HttpOnly soient envoyés, il faut aussi configurer
        // HttpClient avec withCredentials. Voir app.config.ts
        req = req.clone({
            withCredentials: true
        });

        return next.handle(req);
    }
}
