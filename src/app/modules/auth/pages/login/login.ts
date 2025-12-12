import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Agregamos RouterModule para los links
import { FormsModule } from '@angular/forms'; // <--- IMPORTANTE
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

  // Variables para el formulario
  email = '';
  password = '';
  errorMessage = '';

  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => console.error(err)
    });
  }

  loginWithEmail() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.authService.loginWithEmail(this.email, this.password).subscribe({
      next: () => {
        console.log('Login exitoso');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error:', error);
        // Manejo básico de errores de Firebase en español
        if (error.code === 'auth/invalid-credential') {
          this.errorMessage = 'Correo o contraseña incorrectos';
        } else {
          this.errorMessage = 'Ocurrió un error al iniciar sesión';
        }
      }
    });
  }
}
