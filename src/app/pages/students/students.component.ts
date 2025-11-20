import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { Student } from '../../core/models/Student';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { StudentService } from '../../core/service/student.service';

@Component({
  selector: 'app-students',
  imports: [CommonModule, MaterialModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
  standalone: true
})
export class StudentsComponent implements OnInit {
  private readonly studentService = inject(StudentService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  students: Student[] = [];
  loading: boolean = false;
  error: string | null = null;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'level', 'matter', 'actions'];

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = null;
    this.studentService.getStudents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.students = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Erreur lors du chargement des étudiants : ' + (err?.message ?? 'Erreur inconnue');
        }
      });
  }

  onEdit(student: Student): void {
    if (student.id) {
      this.router.navigate(['/student'], { queryParams: { id: student.id } });
    }
  }

  onDelete(student: Student): void {
    if (!student.id) {
      alert('ID étudiant manquant');
      return;
    }
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${student.firstname} ${student.lastname} ?`)) {
      return;
    }

    this.studentService.deleteStudent(student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          alert(`Étudiant ${student.firstname} ${student.lastname} supprimé avec succès.`);
          this.loadStudents();
        },
        error: (err) => {
          if (err?.status === 404) {
            alert('Étudiant non trouvé.');
          } else if (err?.status >= 500) {
            alert('Erreur serveur — réessayez plus tard.');
          } else {
            alert('Erreur lors de la suppression : ' + (err?.message ?? 'Erreur inconnue'));
          }
        }
      });
  }

  onCreate(): void {
    this.router.navigate(['/student']);
  }
}

