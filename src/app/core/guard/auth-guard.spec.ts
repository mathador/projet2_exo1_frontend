import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of, Observable, throwError } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { StudentService } from '../service/student.service';

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let studentService: jest.Mocked<StudentService>;
    let router: jest.Mocked<Router>;

    beforeEach(() => {
        const studentServiceMock = {
            getStudent: jest.fn(),
        };

        const routerMock = {
            createUrlTree: jest.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                { provide: StudentService, useValue: studentServiceMock },
                { provide: Router, useValue: routerMock },
            ],
        });

        guard = TestBed.inject(AuthGuard);
        studentService = TestBed.inject(StudentService) as jest.Mocked<StudentService>;
        router = TestBed.inject(Router) as jest.Mocked<Router>;
    });

    afterEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });

    describe('canActivate', () => {
        it('should return true if authToken is in localStorage', () => {
            localStorage.setItem('authToken', 'test-token');
            const result = guard.canActivate();
            expect(result).toBe(true);
            expect(studentService.getStudent).not.toHaveBeenCalled();
        });

        it('should call getStudent if authToken is not in localStorage', () => {
            studentService.getStudent.mockReturnValue(of({} as any));
            (guard.canActivate() as Observable<boolean | UrlTree>).subscribe();
            expect(studentService.getStudent).toHaveBeenCalledWith(1);
        });

        it('should return true if getStudent succeeds', (done) => {
            studentService.getStudent.mockReturnValue(of({} as any));
            (guard.canActivate() as Observable<boolean | UrlTree>).subscribe((result) => {
                expect(result).toBe(true);
                done();
            });
        });

        it('should return a UrlTree to /login if getStudent fails', (done) => {
            const urlTree = new UrlTree();
            studentService.getStudent.mockReturnValue(throwError(() => new Error('error')));
            router.createUrlTree.mockReturnValue(urlTree);
            (guard.canActivate() as Observable<boolean | UrlTree>).subscribe((result) => {
                expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
                expect(result).toBe(urlTree);
                done();
            });
        });
    });
});
