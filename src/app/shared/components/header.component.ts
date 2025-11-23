import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../core/service/auth-state.service';
import { UserService } from '../../core/service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <div class="flex-grow-1 text-center">
          <h5 class="m-0 text-white">Logiciel de gestion des étudiants</h5>
        </div>
        <nav class="ms-auto">
          @let user = (user$ | async); @if (user) {
            <div class="d-flex align-items-center gap-3">
              <span class="text-white me-2">
                {{ user.firstName }} {{ user.lastName }}
              </span>
              <button class="btn btn-sm btn-outline-light" (click)="onLogout()">
                Déconnecter
              </button>
            </div>
          } @else {
            @if (router.url === '/login') {
              <button class="btn btn-sm btn-outline-light" (click)="onRegister()">
                S'inscrire
              </button>
            } @else {
              <button class="btn btn-sm btn-outline-light" (click)="onLogin()">
                Se connecter
              </button>
            }
          }
        </nav>
      </div>
    </header>
  `,
  styles: [`
    header {
      margin-bottom: 2rem;
    }
  `]
})
export class HeaderComponent {
  readonly authStateService = inject(AuthStateService);
  readonly userService = inject(UserService);
  readonly router = inject(Router);
  readonly user$ = this.authStateService.user$;

  onLogout(): void {
    this.userService.logout().subscribe({
      next: () => {
        localStorage.removeItem('authToken');
        this.authStateService.clearUser();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
        localStorage.removeItem('authToken');
        this.authStateService.clearUser();
        this.router.navigate(['/login']);
      }
    });
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }
}
