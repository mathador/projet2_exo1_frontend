import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private readonly httpClient: HttpClient) { }

  createStudent(student: Student): Observable<Object> {
    return this.httpClient.post('/api/students', student);
  }

  updateStudent(student: Student): Observable<Object> {
    return this.httpClient.put(`/api/students/${student.id}`, student);
  }

  getStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>('/api/students');
  }

  deleteStudent(id: number): Observable<Object> {
    return this.httpClient.delete(`/api/students/${id}`);
  }

  getStudent(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`/api/students/${id}`);
  }
}
