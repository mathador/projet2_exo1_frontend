import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { provideHttpClient } from '@angular/common/http';
import { Student } from '../models/Student';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getStudents', () => {
    it('should return a list of students', () => {
      const mockStudents: Student[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', level: 'Beginner', matter: 'English' },
        { id: 2, firstName: 'Jane', lastName: 'Doe', level: 'Intermediate', matter: 'French' }
      ];

      service.getStudents().subscribe(students => {
        expect(students.length).toBe(2);
        expect(students).toEqual(mockStudents);
      });

      const req = httpMock.expectOne('/api/students');
      expect(req.request.method).toBe('GET');
      req.flush(mockStudents);
    });
  });

  describe('getStudent', () => {
    it('should return a single student', () => {
      const mockStudent: Student = { id: 1, firstName: 'John', lastName: 'Doe', level: 'Beginner', matter: 'English' };

      service.getStudent(1).subscribe(student => {
        expect(student).toEqual(mockStudent);
      });

      const req = httpMock.expectOne('/api/students/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockStudent);
    });

    it('should handle error if student not found', () => {
      service.getStudent(99).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('/api/students/99');
      expect(req.request.method).toBe('GET');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createStudent', () => {
    it('should create a student', () => {
      const newStudent: Student = { firstName: 'John', lastName: 'Doe', level: 'Beginner', matter: 'English' };

      service.createStudent(newStudent).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('/api/students');
      expect(req.request.method).toBe('POST');
      req.flush({ success: true });
    });
  });

  describe('updateStudent', () => {
    it('should update a student', () => {
      const updatedStudent: Student = { id: 1, firstName: 'John', lastName: 'Doe', level: 'Advanced', matter: 'English' };

      service.updateStudent(updatedStudent).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('/api/students/1');
      expect(req.request.method).toBe('PUT');
      req.flush({ success: true });
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student', () => {
      service.deleteStudent(1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('/api/students/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });
  });
});
