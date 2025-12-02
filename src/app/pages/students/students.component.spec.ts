import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentsComponent } from './students.component';
import { StudentService } from '../../core/service/student.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Student } from '../../core/models/Student';
import { DestroyRef } from '@angular/core';

describe('StudentsComponent', () => {
  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;
  let mockStudentService: any;
  let mockRouter: any;
  let mockDestroyRef: any;

  const mockStudents: Student[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', level: 'Beginner', matter: 'Math' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', level: 'Intermediate', matter: 'Physics' }
  ];

  beforeEach(async () => {
    mockStudentService = {
      getStudents: jest.fn().mockReturnValue(of(mockStudents)),
      deleteStudent: jest.fn().mockReturnValue(of(void 0))
    };

    mockRouter = {
      navigate: jest.fn()
    };

    mockDestroyRef = {
      onDestroy: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [StudentsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StudentService, useValue: mockStudentService },
        { provide: Router, useValue: mockRouter },
        { provide: DestroyRef, useValue: mockDestroyRef }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadStudents on ngOnInit', () => {
    jest.spyOn(component, 'loadStudents');
    component.ngOnInit();
    expect(component.loadStudents).toHaveBeenCalled();
  });

  describe('loadStudents', () => {
    it('should populate students array on success', () => {
      component.loadStudents();
      expect(component.loading).toBe(false);
      expect(component.error).toBeNull();
      expect(component.students).toEqual(mockStudents);
    });

    it('should handle error when fetching students', () => {
      const errorMessage = 'Error loading students';
      mockStudentService.getStudents.mockReturnValueOnce(throwError(() => new Error(errorMessage)));

      component.loadStudents();

      expect(component.loading).toBe(false);
      expect(component.error).toContain(errorMessage);
      expect(component.students).toEqual(mockStudents); // Should be empty or previous state
    });
  });

  describe('onEdit', () => {
    it('should navigate to student edit page with id', () => {
      const studentToEdit = mockStudents[0];
      component.onEdit(studentToEdit);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/student'], { queryParams: { id: studentToEdit.id } });
    });

    it('should not navigate if student id is missing', () => {
      const studentToEdit: Student = { ...mockStudents[0], id: undefined };
      component.onEdit(studentToEdit);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    let confirmSpy: jest.SpyInstance;
    let alertSpy: jest.SpyInstance;

    beforeEach(() => {
      confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
      alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { }); // Mock alert to prevent UI blocking
      jest.spyOn(component, 'loadStudents'); // Spy on loadStudents to check if it's called
    });

    afterEach(() => {
      confirmSpy.mockRestore();
      alertSpy.mockRestore();
    });

    it('should call deleteStudent and reload students on confirmation and success', () => {
      const studentToDelete = mockStudents[0];
      component.onDelete(studentToDelete);

      expect(confirmSpy).toHaveBeenCalledWith(`Êtes-vous sûr de vouloir supprimer ${studentToDelete.firstName} ${studentToDelete.lastName} ?`);
      expect(mockStudentService.deleteStudent).toHaveBeenCalledWith(studentToDelete.id);
      expect(alertSpy).toHaveBeenCalledWith(`Étudiant ${studentToDelete.firstName} ${studentToDelete.lastName} supprimé avec succès.`);
      expect(component.loadStudents).toHaveBeenCalled();
    });

    it('should not call deleteStudent if confirmation is false', () => {
      confirmSpy.mockReturnValue(false);
      const studentToDelete = mockStudents[0];
      component.onDelete(studentToDelete);

      expect(confirmSpy).toHaveBeenCalled();
      expect(mockStudentService.deleteStudent).not.toHaveBeenCalled();
      expect(alertSpy).not.toHaveBeenCalled();
      expect(component.loadStudents).not.toHaveBeenCalled();
    });

    it('should handle 404 error during deletion', () => {
      const studentToDelete = mockStudents[0];
      const errorResponse = { status: 404, message: 'Not Found' };
      mockStudentService.deleteStudent.mockReturnValueOnce(throwError(() => errorResponse));

      component.onDelete(studentToDelete);

      expect(mockStudentService.deleteStudent).toHaveBeenCalledWith(studentToDelete.id);
      expect(alertSpy).toHaveBeenCalledWith('Étudiant non trouvé.');
      expect(component.loadStudents).toHaveBeenCalled();
    });

    it('should handle 500 error during deletion', () => {
      const studentToDelete = mockStudents[0];
      const errorResponse = { status: 500, message: 'Server Error' };
      mockStudentService.deleteStudent.mockReturnValueOnce(throwError(() => errorResponse));

      component.onDelete(studentToDelete);

      expect(mockStudentService.deleteStudent).toHaveBeenCalledWith(studentToDelete.id);
      expect(alertSpy).toHaveBeenCalledWith('Erreur serveur — réessayez plus tard.');
      expect(component.loadStudents).toHaveBeenCalled();
    });

    it('should handle generic error during deletion', () => {
      const studentToDelete = mockStudents[0];
      const errorResponse = new Error('Unknown error');
      mockStudentService.deleteStudent.mockReturnValueOnce(throwError(() => errorResponse));

      jest.spyOn(console, 'log').mockImplementation(() => { }); // Mock console.log

      component.onDelete(studentToDelete);

      expect(mockStudentService.deleteStudent).toHaveBeenCalledWith(studentToDelete.id);
      expect(console.log).toHaveBeenCalledWith('Erreur lors de la suppression : ' + (errorResponse?.message ?? 'Erreur inconnue'));
      expect(component.loadStudents).toHaveBeenCalled();
    });

    it('should alert if student ID is missing', () => {
      const studentToDelete: Student = { ...mockStudents[0], id: undefined };
      component.onDelete(studentToDelete);

      expect(alertSpy).toHaveBeenCalledWith('ID étudiant manquant');
      expect(mockStudentService.deleteStudent).not.toHaveBeenCalled();
      expect(confirmSpy).not.toHaveBeenCalled();
      expect(component.loadStudents).not.toHaveBeenCalled();
    });
  });

  describe('onCreate', () => {
    it('should navigate to student creation page', () => {
      component.onCreate();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/student']);
    });
  });
});

