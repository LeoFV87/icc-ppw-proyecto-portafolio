import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdvisoryRequest, AdvisoryService } from '../../../../core/services/advisory/advisory';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-advisories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advisories.html'
})
export class Advisories {
  private advisoryService = inject(AdvisoryService);
  private authService = inject(AuthService);

  // Variables para la respuesta y la selección
  replyText = '';

  selectedId: number | null = null;

  myAdvisories$ = toObservable(this.authService.currentUser).pipe(
    switchMap(user => {
      // El servicio ya no necesita el UID porque lo lleva el Token JWT
      if (user) return this.advisoryService.getProgrammerAdvisories();
      return of([]);
    })
  );

  // 1. Abre la cajita para escribir la respuesta (ID cambiado a number)
  openReply(id: number) {
    this.selectedId = id;
    this.replyText = ''; // Limpiar mensaje anterior
  }

  // 2. Procesa la solicitud (Guarda en BD de Spring Boot)
  async processRequest(request: AdvisoryRequest, status: 'accepted' | 'rejected') {
    // Verificamos que el ID exista y sea numérico
    if (request.id === undefined) return;

    // Validación: Obligar a escribir una justificación
    if (!this.replyText.trim()) {
      alert('Por favor escribe un mensaje de confirmación o justificación para el cliente.');
      return;
    }

    try {
      // Llamamos al servicio de Java
      await this.advisoryService.respondAdvisory(request.id, status, this.replyText);

      // Simulación de envío externo (WhatsApp)
      this.simulateNotification(request, status, this.replyText);

      this.selectedId = null; // Cerrar la caja de respuesta
      alert(`Solicitud ${status === 'accepted' ? 'Aprobada' : 'Rechazada'} correctamente.`);

    } catch (error) {
      console.error('Error al actualizar en el Backend:', error);
      alert('Ocurrió un error al procesar la solicitud en el servidor.');
    }
  }

  // 3. Simula el envío de un WhatsApp
  simulateNotification(request: AdvisoryRequest, status: string, message: string) {
    const action = status === 'accepted' ? 'ACEPTADA ✅' : 'RECHAZADA ❌';

    const text = `Hola ${request.clientName}, tu solicitud de asesoría sobre "${request.topic}" ha sido ${action}.

Mensaje del programador:
"${message}"`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }
}
