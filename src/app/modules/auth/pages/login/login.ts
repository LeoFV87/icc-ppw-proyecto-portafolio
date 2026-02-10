import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html'
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  // Variables del formulario
  email = '';
  password = '';
  errorMessage = '';

  /*
  Procesa la autenticación mediante el Backend de Spring Boot
  Genera y almacena el Token JWT en el navegador
  */
  loginWithEmail() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos obligatorios.';
      return;
    }

    this.authService.loginWithEmail(this.email, this.password).subscribe({
      next: () => {
        console.log('Login exitoso: Token JWT recibido y guardado.');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error de autenticación:', error);

        // Gestión de errores basada en códigos HTTP de PostgreSQL/Java
        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
        } else if (error.status === 0) {
          this.errorMessage = 'Sin conexión con el servidor. Verifica que el Backend esté activo.';
        } else {
          this.errorMessage = 'Ha ocurrido un error inesperado al intentar ingresar.';
        }
      }
    });
  }
}
