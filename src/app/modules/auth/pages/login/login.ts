import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  loginWithEmail() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Debes ingresar tus credenciales para continuar.';
      return;
    }

    this.authService.loginWithEmail(this.email, this.password).subscribe({
      next: () => {
        // Redirección inmediata para evitar el "doble login"
        this.router.navigate(['/home']);
      },
      error: (error) => {
        // Manejo de errores sin exponer detalles técnicos sensibles
        if (error.status === 401) {
          this.errorMessage = 'El correo o la contraseña son incorrectos. Por favor, verifica tus datos.';
        } else if (error.status === 404) {
          this.errorMessage = 'No existe una cuenta asociada a este correo electrónico.';
        } else if (error.status === 0) {
          this.errorMessage = 'Error de conexión: El servidor no responde. Verifica tu conexión a internet.';
        } else if (error.status === 500) {
          this.errorMessage = 'El servicio de autenticación está experimentando problemas técnicos.';
        } else {
          this.errorMessage = 'No se pudo validar tu identidad. Por favor, intenta de nuevo.';
        }
      }
    });
  }
}
