import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { AppComponent } from './app.component';
import { StudentComponent } from './pages/student/student.component';
import { StudentsComponent } from './pages/students/students.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'student',
    component: StudentComponent
  },
  {
    path: 'students',
    component: StudentsComponent
  }
];
