import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdvisoryRequest, AdvisoryService } from '../../../../core/services/advisory/advisory';
import { AuthService } from '../../../../core/services/firebase/auth';
import emailjs from '@emailjs/browser';

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
      // El servicio ya no necesita el UID porque lo lleva el Token JWT
      if (user) return this.advisoryService.getProgrammerAdvisories();
      return of([]);
    })
  );

  // 1. MÉTODO PARA RECARGAR (Actualiza lista y gráfico)
  loadAdvisories() {
    window.location.reload();
  }

  // 2. MÉTODO PARA WHATSAPP
  contactWhatsApp(advisory: any) {
    const phone = '593962250122'; // Tu número de demo
    const message = `Hola ${advisory.clientName}, soy el programador. He aceptado tu solicitud de asesoría sobre "${advisory.topic}".`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  // 1. Abre la cajita para escribir la respuesta (ID cambiado a number)
  openReply(id: number) {
    this.selectedId = id;
    this.replyText = ''; // Limpiar mensaje anterior
  }

  // 2. Procesa la solicitud (Guarda en BD de Spring Boot)
  async processRequest(advisory: any, status: 'accepted' | 'rejected') {
    try {

    await this.sendEmailNotification(advisory, status);
    //  Guardamos en el servidor
    await this.advisoryService.respondAdvisory(advisory.id, status, 'Asesoría procesada');

    //  Cerramos el modal inmediatamente
    const modal = document.getElementById('tu_modal_id') as HTMLDialogElement;
    modal?.close();

    //  Si es aceptada, lanzamos WhatsApp
    if (status === 'accepted') {
      this.contactWhatsApp(advisory);
    }

    //  Recargamos los datos para que el gráfico se actualice
    this.loadAdvisories(); // O la función que uses para listar
    alert(`✅ Solicitud ${status === 'accepted' ? 'aprobada' : 'rechazada'}`);

    } catch (error) {
    console.error('Error:', error);
    alert('No se pudo procesar la solicitud');
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


    async sendEmailNotification(advisory: any, status: string) {
      const templateParams = {
      to_name: advisory.clientName,
      to_email: advisory.clientEmail,
      subject: `Tu asesoría ha sido ${status}`,
      message: `Hola ${advisory.clientName}, tu solicitud sobre "${advisory.topic}" ha sido ${status === 'accepted' ? 'APROBADA' : 'RECHAZADA'}.`,
      reply_message: this.replyText
    };

      try {
        // Reemplaza estos 3 IDs con los de tu cuenta gratuita en emailjs.com
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY');
        console.log('📧 Correo enviado con éxito');
      } catch (error) {
        console.error('❌ Error al enviar correo:', error);
      }
  }

  exportToExcel() {
      this.myAdvisories$.subscribe(data => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Asesorias');
        XLSX.writeFile(workbook, 'Reporte_Asesorias.xlsx');
      });
  }




}
