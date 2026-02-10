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

  // Signal para el tema
  currentTheme = signal('light');

  constructor() {
    // Al iniciar, leemos si el usuario ya tenía un tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  /**
   * Determina si el usuario se encuentra en la página de inicio.
   * Se utiliza para deshabilitar el clic en el logo y ocultar el botón "Home".
   */
  isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

  // Función para alternar entre Sol y Luna
  toggleTheme() {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  // Lógica interna para aplicar el cambio de tema (DaisyUI)
  private setTheme(theme: string) {
    this.currentTheme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Redirección forzada al login tras cerrar sesión
        this.router.navigate(['/auth/login']);
      },
      error: (err) => console.error('Error al cerrar sesión:', err)
    });
  }

  hasRole(role: string): boolean {
    return this.userProfile()?.role === role;
  }
}
