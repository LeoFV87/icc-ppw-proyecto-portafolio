import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/firebase/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar {

  private authService = inject(AuthService);
  public router = inject(Router);

  // Signals para usar en el HTML
  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

  // Signal para el tema (inicia en light por defecto)
  currentTheme = signal('light');

  constructor() {
    // Al iniciar, leemos si el usuario ya tenía un tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  // Función para alternar entre Sol y Luna
  toggleTheme() {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  // Lógica interna para aplicar el cambio
  private setTheme(theme: string) {
    this.currentTheme.set(theme);
    // Cambia el atributo en el HTML globalmente (DaisyUI detecta esto)
    document.documentElement.setAttribute('data-theme', theme);
    // Guarda en memoria del navegador
    localStorage.setItem('theme', theme);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // FORZAMOS LA REDIRECCIÓN AQUÍ
        this.router.navigate(['/auth/login']);
      },
      error: (err) => console.error('Error al cerrar sesión:', err)
    });
  }

  hasRole(role: string): boolean {
    return this.userProfile()?.role === role;
  }
}
