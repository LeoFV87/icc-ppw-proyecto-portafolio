import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html'
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  register() {
    // 1. Validaciones de Inputs (Línea gráfica y consistencia)
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Todos los campos son obligatorios para el registro.';
      return;
    }

    // Validación de formato de correo (Lo que falló en la entrega anterior)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'El formato del correo electrónico no es válido (ejemplo@ups.edu.ec).';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'La confirmación no coincide con la contraseña ingresada.';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Por seguridad, la contraseña debe tener al menos 8 caracteres.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // 2. Llamada al Backend (Spring Boot)
    this.authService.registerWithEmail(this.email, this.password).subscribe({
      next: () => {
        alert('✅ Cuenta creada con éxito. Ahora puedes iniciar sesión.');
        this.router.navigate(['/auth/login']);
      },
      error: (error: any) => {
        this.isLoading = false;
        // Gestión de errores basada en HTTP Status Codes de tu API Java
        if (error.status === 409) {
          this.errorMessage = 'Este correo electrónico ya se encuentra registrado en el sistema.';
        } else if (error.status === 400) {
          this.errorMessage = 'Los datos enviados no cumplen con los requisitos del servidor.';
        } else {
          this.errorMessage = 'No se pudo completar el registro. Inténtalo más tarde.';
        }
      }
    });
  }
}
