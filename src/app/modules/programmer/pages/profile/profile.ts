import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html'
})
export class Profile {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  userProfile = this.authService.userProfile;

  // Signals inicializados para evitar que se borren los datos al cargar
  name = signal('');
  description = signal('');
  skillsInput = signal('');
  photoInput = signal('');
  specialty = signal('');
  linkedin = signal('');
  github = signal('');
  availabilityInput = signal('');
  isSaving = signal(false);

  constructor() {
    // Este efecto garantiza que los datos guardados en PostgreSQL se carguen al entrar
    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        this.name.set(profile.name || '');
        this.description.set(profile.description || '');
        this.skillsInput.set(profile.skills ? profile.skills.join(', ') : '');
        this.photoInput.set(profile.photoURL || '');
        this.specialty.set(profile.specialty || '');
        this.linkedin.set(profile.linkedin || '');
        this.github.set(profile.github || '');
        this.availabilityInput.set(profile.availability ? profile.availability.join(', ') : '');
      }
    });
  }

  async saveProfile() {
    this.isSaving.set(true);

    const profileData = {
      name: this.name(),
      description: this.description(),
      skills: this.skillsInput().split(',').map(s => s.trim()).filter(s => s),
      availability: this.availabilityInput().split(',').map(a => a.trim()).filter(a => a),
      photoURL: this.photoInput(),
      specialty: this.specialty(),
      linkedin: this.linkedin(),
      github: this.github()
    };

    this.http.put('http://localhost:8080/api/users/profile', profileData).subscribe({
      next: () => {
        // CLAVE: Refrescamos el estado global antes de irnos
        this.authService.refreshProfile();
        alert('✅ Perfil actualizado');
        this.isSaving.set(false);
        this.router.navigate(['/programmer/dashboard']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isSaving.set(false);
      }
    });
  }
}
