import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { Login } from '../models/Login';
import { Register } from '../models/Register';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return a user on successful login', () => {
      const mockUser: Login = { login: 'test@example.com', password: 'password' };
      const mockResponse = new HttpResponse({ body: { id: 1, email: 'test@example.com' }, status: 200 });

      service.login(mockUser).subscribe(response => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: 1, email: 'test@example.com' });
      });

      const req = httpMock.expectOne('/api/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse.body, { status: mockResponse.status, statusText: 'OK' });
    });

    it('should handle login error', () => {
      const mockUser: Login = { login: 'test@example.com', password: 'password' };

      service.login(mockUser).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('/api/login');
      expect(req.request.method).toBe('POST');
      req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should successfully register a user', () => {
      const newUser: Register = { password: 'newpassword', login: 'newuser', firstName: 'New', lastName: 'User' };

      service.register(newUser).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('/api/register');
      expect(req.request.method).toBe('POST');
      req.flush({ success: true });
    });

    it('should handle registration error', () => {
      const newUser: Register = { password: 'newpassword', login: 'newuser', firstName: 'New', lastName: 'User' };

      service.register(newUser).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('/api/register');
      expect(req.request.method).toBe('POST');
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('logout', () => {
    it('should successfully logout', () => {
      service.logout().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('/api/logout');
      expect(req.request.method).toBe('POST');
      req.flush({ success: true });
    });
  });

  describe('authentication flag', () => {
    it('should be false by default', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should be able to set the authentication flag', () => {
      service.authenticate(true);
      expect(service.isAuthenticated()).toBe(true);
      service.authenticate(false);
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});