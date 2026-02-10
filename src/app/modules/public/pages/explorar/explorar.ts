import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/firebase/auth';
import { AdvisoryService } from '../../../../core/services/advisory/advisory';

interface Programmer {
  id: number;
  displayName: string;
  email: string;
  role: string;
  photoURL: string;
  description?: string;
  skills?: string[];
  availability?: string[];
  specialty?: string;
}

@Component({
  selector: 'explorar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './explorar.html'
})
export class Explorar implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private advisoryService = inject(AdvisoryService);

  currentUser = this.authService.currentUser;
  programmers = signal<Programmer[]>([]);

  selectedProgrammer = signal<Programmer | null>(null);
  requestTopic = signal('');
  requestMessage = signal('');
  selectedSlot = signal('');
  isModalOpen = signal(false);

  ngOnInit() {
    this.loadProgrammers();
  }

  loadProgrammers() {
  this.http.get<Programmer[]>('http://localhost:8080/api/users').subscribe({
    next: (data) => {
      const onlyDevs = data.filter(u => u.role?.toLowerCase() === 'programmer');
      this.programmers.set(onlyDevs);
    },
    error: (err) => console.error('Error al cargar talentos:', err)
  });
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
  const dev = this.selectedProgrammer();
  if (dev && this.requestTopic() && this.selectedSlot()) {
    try {
      await this.advisoryService.requestAdvisory({
        programmerId: dev.email,
        programmerName: dev.displayName,
        topic: this.requestTopic(),
        message: this.requestMessage(),
        timeSlot: this.selectedSlot(),
        status: 'pending'
      });
      alert('✅ Solicitud enviada con éxito');
      this.closeModal();
     } catch (error) {
      alert('Error al enviar la solicitud');
       }
    }
   }
}
