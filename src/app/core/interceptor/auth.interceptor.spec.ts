import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                },
            ],
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
    });

    afterEach(() => {
        localStorage.clear();
        httpMock.verify();
    });

    it('should add an Authorization header when a token is present', () => {
        const token = 'test-token';
        localStorage.setItem('authToken', token);

        httpClient.get('/test').subscribe();

        const httpRequest = httpMock.expectOne('/test');

        expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
        expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
        expect(httpRequest.request.withCredentials).toBe(true);
    });

    it('should not add an Authorization header when a token is not present', () => {
        httpClient.get('/test').subscribe();

        const httpRequest = httpMock.expectOne('/test');

        expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
        expect(httpRequest.request.withCredentials).toBe(true);
    });

    it('should set withCredentials to true even if no token is present', () => {
        httpClient.get('/test').subscribe();

        const httpRequest = httpMock.expectOne('/test');

        expect(httpRequest.request.withCredentials).toBe(true);
    });
});
