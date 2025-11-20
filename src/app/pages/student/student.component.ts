import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { Student } from '../../core/models/Student';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StudentService } from '../../core/service/student.service';

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
    this.isEditMode = false;
    this.studentForm.reset();
    this.studentForm.get('id')?.disable();
  }

  // Fonctionnalité future : charger un étudiant existant pour modification
  loadStudent(id: number): void {
    // Implémentation à venir : récupération via userService.getStudent(id)
    // et peuplement du formulaire avec les données
  }
}

