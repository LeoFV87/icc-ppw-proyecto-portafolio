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
  selectedId: string | null = null;

  myAdvisories$ = toObservable(this.authService.currentUser).pipe(
    switchMap(user => {
      // Nota: Asegúrate de que tu servicio tenga este método (getProgrammerAdvisories)
      if (user) return this.advisoryService.getProgrammerAdvisories(user.uid);
      return of([]);
    })
  );

  // 1. Abre la cajita para escribir la respuesta
  openReply(id: string) {
    this.selectedId = id;
    this.replyText = ''; // Limpiar mensaje anterior
  }

  // 2. Procesa la solicitud (Guarda en BD y Simula Notificación)
  async processRequest(request: AdvisoryRequest, status: 'accepted' | 'rejected') {
    if (!request.id) return;

    // Validación: Obligar a escribir una justificación
    if (!this.replyText.trim()) {
      alert('Por favor escribe un mensaje de confirmación o justificación para el cliente.');
      return;
    }

    try {
      // Llamamos al servicio (Asegúrate de haber actualizado AdvisoryService con respondAdvisory)
      // Si tu servicio aún se llama updateAdvisoryStatus, cámbialo aquí o actualiza el servicio
      await this.advisoryService.respondAdvisory(request.id, status, this.replyText);

      // Simulación de envío externo (Punto 6 del PDF)
      this.simulateNotification(request, status, this.replyText);

      this.selectedId = null; // Cerrar la caja de respuesta
      alert(`Solicitud ${status === 'accepted' ? 'Aprobada' : 'Rechazada'} correctamente.`);

    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Ocurrió un error al procesar la solicitud.');
    }
  }

  // 3. Simula el envío de un WhatsApp/Correo
  simulateNotification(request: AdvisoryRequest, status: string, message: string) {
    const action = status === 'accepted' ? 'ACEPTADA ✅' : 'RECHAZADA ❌';

    // Creamos el mensaje para WhatsApp
    const text = `Hola ${request.clientName}, tu solicitud de asesoría sobre "${request.topic}" ha sido ${action}.

Mensaje del programador:
"${message}"`;

    // Generar link de WhatsApp Web
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank');
  }
}
