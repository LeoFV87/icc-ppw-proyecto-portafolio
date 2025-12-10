import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-settings.html'

})
export class ProfileSettings {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Señales para acceder a los datos
  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

  hasRole(role: string): boolean {
    return this.userProfile()?.role === role;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
