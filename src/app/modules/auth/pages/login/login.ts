import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html'

})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: (user) => {
        console.log('Login exitoso:', user);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error en login:', error);
      }
    });
  }
}
