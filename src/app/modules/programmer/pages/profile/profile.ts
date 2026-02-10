import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html'
})
export class Profile {

  private authService = inject(AuthService);
  private http = inject(HttpClient);

  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

  description = signal('');
  skillsInput = signal('');
  photoInput = signal('');
  specialty = signal('');
  linkedin = signal('');
  github = signal('');
  isSaving = signal(false);

  constructor() {
    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        this.description.set(profile.description || '');
        this.skillsInput.set(profile.skills ? profile.skills.join(', ') : '');
        this.photoInput.set(profile.photoURL || '');
        this.specialty.set(profile.specialty || '');
        this.linkedin.set(profile.linkedin || '');
        this.github.set(profile.github || '');
      }
    });
  }

  async saveProfile() {
    this.isSaving.set(true);
    const skillsArray = this.skillsInput().split(',').map(s => s.trim()).filter(s => s);

    const profileData = {
      description: this.description(),
      skills: skillsArray,
      photoURL: this.photoInput(),
      specialty: this.specialty(),
      linkedin: this.linkedin(),
      github: this.github()
    };

    // Llamada a tu Backend de Spring Boot
    this.http.put('http://localhost:8080/api/users/profile', profileData).subscribe({
      next: () => {
        alert('✅ Perfil guardado en PostgreSQL');
        this.isSaving.set(false);
      },
      error: () => {
        alert('❌ Error al guardar');
        this.isSaving.set(false);
      }
    });
  }
}
