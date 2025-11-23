import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { Student } from '../../core/models/Student';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StudentService } from '../../core/service/student.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-student',
  imports: [CommonModule, MaterialModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
  standalone: true
})
export class StudentComponent implements OnInit {
  private readonly studentService = inject(StudentService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  studentForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isEditMode: boolean = false;

  ngOnInit() {
    this.studentForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      level: ['', Validators.required],
      matter: ['', Validators.required]
    });

    // Check if an ID is provided via query params for edit mode
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.loadStudent(Number.parseInt(id, 10));
        }
      });
  }

  get form() {
    return this.studentForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.studentForm.invalid) {
      return;
    }

    const formValue = this.studentForm.getRawValue();
    const student: Student = {
      id: formValue.id ? Number.parseInt(formValue.id, 10) : undefined,
      firstName: formValue.firstname,
      lastName: formValue.lastname,
      level: formValue.level,
      matter: formValue.matter
    };

    const request$ = this.isEditMode && student.id
      ? this.studentService.updateStudent(student)
      : this.studentService.createStudent(student);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const action = this.isEditMode ? 'modifié' : 'créé';
          alert(`Étudiant ${action} avec succès.`);
          this.onReset();
          this.isEditMode = false;
          this.router.navigate(['/students']);
        },
        error: (err) => {
          if (err?.status === 400) {
            alert('Données invalides — vérifiez les champs.');
          } else if (err?.status === 404) {
            alert('Étudiant non trouvé.');
          } else if (err?.status >= 500) {
            alert('Erreur serveur — réessayez plus tard.');
          } else {
            const msg = err?.message ?? JSON.stringify(err);
            alert('Erreur : ' + msg);
          }
          this.submitted = false;
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    if (this.isEditMode) {
      this.router.navigate(['/students']);
    }
    else {
      this.studentForm.reset();
      this.studentForm.get('id')?.disable();
    } 
    this.isEditMode = false;
  }

  // Fonctionnalité future : charger un étudiant existant pour modification
  loadStudent(id: number): void {
    this.studentService.getStudent(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student) => {
          this.isEditMode = true;
          this.studentForm.patchValue({
            id: student.id,
            firstname: student.firstName,
            lastname: student.lastName,
            level: student.level,
            matter: student.matter
          });
        },
        error: (err) => {
          console.error('Erreur lors du chargement de l\'étudiant', err);
          alert('Impossible de charger l\'étudiant. Vérifiez l\'ID fourni.');
          this.isEditMode = false;
        }
      });
  }
}

