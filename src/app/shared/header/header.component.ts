import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../core/service/auth-state.service';
import { UserService } from '../../core/service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
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
