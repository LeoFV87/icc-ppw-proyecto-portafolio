import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, updateDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.html'
})
export class Schedule {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

  // Variables del formulario
  selectedDay = signal('Lunes');
  selectedTime = signal('');

  // Lista local de horarios (se sincroniza con el perfil)
  mySlots = signal<string[]>([]);

  constructor() {
    effect(() => {
      // Cargar horarios existentes si los hay
      const profile = this.userProfile() as any;
      if (profile && profile.availability) {
        this.mySlots.set(profile.availability);
      }
    });
  }

  async addSlot() {
    if (!this.selectedTime()) return;

    const newSlot = `${this.selectedDay()} - ${this.selectedTime()}`;

    // Evitar duplicados
    if (this.mySlots().includes(newSlot)) {
      alert('Ya tienes ese horario agregado.');
      return;
    }

    try {
      const uid = this.currentUser()?.uid;
      if (!uid) return;

      const userRef = doc(this.firestore, `users/${uid}`);
      // Guardar en Firestore usando arrayUnion
      await updateDoc(userRef, {
        availability: arrayUnion(newSlot)
      });

      // Actualizar localmente
      this.mySlots.update(slots => [...slots, newSlot]);
      alert('✅ Horario agregado');
    } catch (error) {
      console.error(error);
      alert('Error al guardar horario');
    }
  }

  async removeSlot(slot: string) {
    try {
      const uid = this.currentUser()?.uid;
      if (!uid) return;

      const userRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userRef, {
        availability: arrayRemove(slot)
      });

      this.mySlots.update(slots => slots.filter(s => s !== slot));
    } catch (error) {
      console.error(error);
    }
  }
}
