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
  availabilityInput = signal('');
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
    const availabilityArray = this.availabilityInput().split(',').map(a => a.trim()).filter(a => a);

    const profileData = {
      description: this.description(),
      skills: skillsArray,
      availability: availabilityArray,
      photoURL: this.photoInput(),
      specialty: this.specialty(),
      linkedin: this.linkedin(),
      github: this.github()
    };

    this.http.put('http://localhost:8080/api/users/profile', profileData).subscribe({
      next: () => {
        alert('✅ Perfil y Horarios guardados en PostgreSQL');
        this.isSaving.set(false);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('❌ Error al guardar perfil');
        this.isSaving.set(false);
      }
    });
  }
}
