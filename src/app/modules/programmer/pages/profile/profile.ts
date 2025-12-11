import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html'
})
export class Profile {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

  // Formulario local
  description = signal('');
  skillsInput = signal('');
  isSaving = signal(false);

  constructor() {
    // Cuando cargue el perfil, rellenamos el formulario
    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        const p = profile as any;
        this.description.set(p.description || '');
        this.skillsInput.set(p.skills ? p.skills.join(', ') : '');
      }
    });
  }

  async saveProfile() {
    const uid = this.currentUser()?.uid;
    if (!uid) return;

    this.isSaving.set(true);
    try {

      const skillsArray = this.skillsInput().split(',').map(s => s.trim()).filter(s => s);

      const userRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userRef, {
        description: this.description(),
        skills: skillsArray
      });

      alert('✅ Perfil público actualizado correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al guardar perfil');
    } finally {
      this.isSaving.set(false);
    }
  }
}
