// src/app/shared/components/navbar/navbar.ts
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Referencias a los signals del servicio para que el HTML reaccione
  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

  currentTheme = signal('light');

  constructor() {
    // Recuperamos el tema preferido de la laptop
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  /**
   * Cambia entre modo claro y oscuro.
   */
  toggleTheme() {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private setTheme(theme: string) {
    this.currentTheme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  /**
   * Proxy para verificar roles desde el HTML.
   */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  /**
   * Cierra la sesión y limpia los datos de Leo Vásconez del sistema.
   */
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => console.error('Error al cerrar sesión:', err)
    });
  }
}
