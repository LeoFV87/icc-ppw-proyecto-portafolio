import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/firebase/auth';


@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-settings.html'
})
export class ProfileSettings {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Señales para acceder a los datos
  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

  constructor() {
    effect(() => {
      if (!this.authService.loading() && !this.currentUser()) {
         this.router.navigate(['/auth/login']);
      }
    });
  }

  hasRole(role: string): boolean {
    return this.userProfile()?.role === role;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Redirección explícita al terminar el logout
        this.router.navigate(['/auth/login']);
      },
      error: (err) => console.error('Error al cerrar sesión:', err)
    });
  }
}
