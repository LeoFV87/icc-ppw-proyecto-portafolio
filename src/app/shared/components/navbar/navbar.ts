import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/firebase/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'

})
export class Navbar {

  private authService = inject(AuthService);
  public router = inject(Router);

  // Signals para usar en el HTML
  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile; // Aquí debe venir el rol (admin, programmer, user)

  // Método para cerrar sesión
  logout() {
     this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  // Helper para verificar roles en el HTML de forma limpia
  hasRole(role: string): boolean {
    return this.userProfile()?.role === role;
  }
}
