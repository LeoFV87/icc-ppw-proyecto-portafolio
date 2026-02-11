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

  // Signals conectados al estado global de PostgreSQL
  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

  constructor() {
    // Protección de ruta: si no hay sesión, redirige al login
    effect(() => {
      if (!this.authService.loading() && !this.currentUser()) {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  /**
   * Valida el rol del usuario de forma insensible a mayúsculas.
   */
  hasRole(role: string): boolean {
    return this.userProfile()?.role?.toLowerCase() === role.toLowerCase();
  }

  /**
   * Finaliza la sesión y limpia el estado global.
   */
  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/auth/login']);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  }
}
