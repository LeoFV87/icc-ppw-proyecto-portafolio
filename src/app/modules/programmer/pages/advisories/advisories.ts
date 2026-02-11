import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdvisoryRequest, AdvisoryService } from '../../../../core/services/advisory/advisory';
import { AuthService } from '../../../../core/services/auth/auth';

declare var XLSX: any;

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
      // El servicio utiliza el Token JWT para identificar al programador
      if (user) return this.advisoryService.getProgrammerAdvisories();
      return of([]);
    })
  );

  /** 1. MÉTODO PARA RECARGAR: Actualiza la lista y el estado visual */
  loadAdvisories() {
    window.location.reload();
  }

  /** 2. MÉTODO PARA WHATSAPP: Comunicación directa con el cliente */
  contactWhatsApp(advisory: any) {
    const phone = '593962250122'; // Tu número de demo para la UPS
    const message = `Hola ${advisory.clientName}, soy el programador. He aceptado tu solicitud de asesoría sobre "${advisory.topic}".`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  /** 3. GESTIÓN DE MODAL: Abre la caja para escribir la respuesta */
  openReply(id: number) {
    this.selectedId = id;
    this.replyText = '';
  }

  /** 4. PROCESO DE SOLICITUD: Guarda en BD y dispara notificaciones automáticas */
  async processRequest(advisory: any, status: 'accepted' | 'rejected') {
    try {
      // Se pasan los 5 argumentos requeridos por el servicio actualizado
      await this.advisoryService.respondAdvisory(
        advisory.id,
        status,
        this.replyText || 'Asesoría procesada',
        advisory.clientEmail,
        advisory.clientName
      );

      // Cerramos el modal de respuesta
      const modal = document.getElementById('tu_modal_id') as HTMLDialogElement;
      modal?.close();

      // Si es aceptada, lanzamos el contacto por WhatsApp
      if (status === 'accepted') {
        this.contactWhatsApp(advisory);
      }

      this.loadAdvisories();
      alert(`✅ Solicitud ${status === 'accepted' ? 'aprobada' : 'rechazada'}`);

    } catch (error) {
      console.error('Error al procesar solicitud:', error);
      alert('No se pudo procesar la solicitud en el servidor');
    }
  }

  /** 5. SIMULACIÓN: Notificación secundaria vía WhatsApp Web */
  simulateNotification(request: AdvisoryRequest, status: string, message: string) {
    const action = status === 'accepted' ? 'ACEPTADA ✅' : 'RECHAZADA ❌';
    const text = `Hola ${request.clientName}, tu solicitud de asesoría sobre "${request.topic}" ha sido ${action}.
    Mensaje del programador: "${message}"`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }

  /** 6. REPORTES: Exportación de datos para el portafolio docente */
  exportToExcel() {
    this.myAdvisories$.subscribe(data => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Asesorias');
      XLSX.writeFile(workbook, 'Reporte_Asesorias.xlsx');
    });
  }
}
