import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html'
})
export class Register {

  private authService = inject(AuthService);
  private router = inject(Router);

  // Variables del formulario
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  register() {
    // 1. Validaciones básicas
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // 2. Llamada al servicio
    this.authService.registerWithEmail(this.email, this.password).subscribe({
      next: () => {
        console.log('Registro exitoso');

        // En lugar de ir al home, cerramos la sesión automática y mandamos al login
        this.authService.logout().subscribe(() => {
          this.isLoading = false;
          alert('✅ ¡Cuenta creada con éxito! Por favor inicia sesión con tus nuevos datos.');
          this.router.navigate(['/auth/login']);
        });
      },
      error: (error: any) => {
        console.error('Error en registro:', error);
        this.isLoading = false;

        // Mensajes de error amigables
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Este correo ya está registrado.';
        } else if (error.code === 'auth/invalid-email') {
          this.errorMessage = 'El formato del correo no es válido.';
        } else {
          this.errorMessage = 'Ocurrió un error al crear la cuenta.';
        }
      }
    });
  }
}
