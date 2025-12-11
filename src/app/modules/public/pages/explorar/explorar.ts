import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/firebase/auth';
import { AdvisoryService } from '../../../../core/services/advisory/advisory';


interface Programmer {
  uid: string;
  displayName: string;
  role: string;
  photoURL: string;
  description?: string;
  skills?: string[];
  // IMPORTANTE: Agregamos esto para que TypeScript sepa que el programador tiene horarios
  availability?: string[];
}

@Component({
  selector: 'explorar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './explorar.html' // Asegúrate que tu archivo se llame así
})
export class Explorar {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private advisoryService = inject(AdvisoryService);

  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

  programmers$: Observable<Programmer[]>;

  // Estado para el Modal
  selectedProgrammer = signal<Programmer | null>(null);
  requestTopic = signal('');
  requestMessage = signal('');

  //Señal del horario
  selectedSlot = signal('');

  isModalOpen = signal(false);

  constructor() {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('role', '==', 'programmer'));
    this.programmers$ = collectionData(q, { idField: 'uid' }) as Observable<Programmer[]>;
  }

  openRequestModal(dev: Programmer) {
    if (!this.currentUser()) {
      alert('Debes iniciar sesión para solicitar una asesoría.');
      return;
    }
    this.selectedProgrammer.set(dev);


    this.selectedSlot.set('');

    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedProgrammer.set(null);
    this.requestTopic.set('');
    this.requestMessage.set('');
    this.selectedSlot.set('');
  }

  async sendRequest() {
    const user = this.currentUser();
    const dev = this.selectedProgrammer();


    if (user && dev && this.requestTopic() && this.selectedSlot()) {
      try {
        await this.advisoryService.requestAdvisory({
          clientId: user.uid,
          clientName: user.displayName || 'Usuario',
          clientEmail: user.email || '',
          programmerId: dev.uid,
          programmerName: dev.displayName,
          topic: this.requestTopic(),
          message: this.requestMessage(),


          timeSlot: this.selectedSlot()
        });

        alert('✅ Solicitud enviada con éxito');
        this.closeModal();
      } catch (error) {
        console.error(error);
        alert('Error al enviar solicitud');
      }
    } else {
        alert('Por favor completa todos los campos obligatorios (Tema y Horario)');
    }
  }
}
