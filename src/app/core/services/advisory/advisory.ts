import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import emailjs from '@emailjs/browser';

export interface AdvisoryRequest {
  id?: number;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  programmerId: string;
  programmerName: string;
  topic: string;
  message: string;
  timeSlot: string;
  status?: 'pending' | 'accepted' | 'rejected';
  createdAt?: string;
  replyMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdvisoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/advisories`;
  private usersUrl = `${environment.apiUrl}/users`;

  constructor() {
    emailjs.init("lVs2nxhuYrJxiZ3C1");
  }

  /**
   * Envío de correo electrónico mediante EmailJS
   */
  private sendEmailNotification(toName: string, toEmail: string, fromName: string, msg: string) {
    const templateParams = {
      to_name: toName,
      from_name: fromName,
      message: msg,
      to_email: toEmail
    };

    // Usando tus IDs reales: service_au60xye y template_mi3q2u9
    emailjs.send("service_au60xye", "template_mi3q2u9", templateParams)
      .then(() => console.log('✅ Notificación enviada con éxito'))
      .catch((error) => console.error('❌ Error al enviar:', error));
  }

  /** 1. Disponibilidad */
  getAvailability(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.usersUrl}/${id}/availability`);
  }

  /** 2. Crear Asesoría */
  async requestAdvisory(data: AdvisoryRequest) {
    const res = await firstValueFrom(this.http.post(this.apiUrl, data));

    // A. Alerta para el PROGRAMADOR
    this.sendEmailNotification(
      data.programmerName,
      "leofernandovasconez1@gmail.com",
      data.clientName || 'Cliente LeMiBit',
      `Nueva solicitud de asesoría sobre: ${data.topic}.`
    );

    // B. Confirmación para el CLIENTE via email
    if (data.clientEmail) {
      this.sendEmailNotification(
        data.clientName || 'Usuario',
        data.clientEmail,
        "Sistema LeMiBit",
        `Hola ${data.clientName}, hemos recibido tu solicitud sobre "${data.topic}". El programador te responderá pronto.`
      );
    }

    return res;
  }

  /** 3. Cliente: Ver mis solicitudes */
  getClientAdvisories(): Observable<AdvisoryRequest[]> {
    return this.http.get<AdvisoryRequest[]>(`${this.apiUrl}/my-advisories`);
  }

  /** 4. Programador: Ver asesorías solicitadas */
  getProgrammerAdvisories(): Observable<AdvisoryRequest[]> {
    return this.http.get<AdvisoryRequest[]>(`${this.apiUrl}/assigned`);
  }

  /** 5. Respuesta: Aceptar o rechazar */
  async respondAdvisory(id: number, status: 'accepted' | 'rejected', replyMessage: string, clientEmail: string, clientName: string) {
    const url = `${this.apiUrl}/${id}/respond`;
    const res = await firstValueFrom(this.http.put(url, { status, replyMessage }));

    // Notifica al cliente
    this.sendEmailNotification(
      clientName,
      clientEmail,
      "Equipo LeMiBit",
      `Tu asesoría ha sido ${status === 'accepted' ? 'ACEPTADA' : 'RECHAZADA'}. Nota: ${replyMessage}`
    );

    return res;
  }

  /** 6. Listar programadores */
  getAllProgrammers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.usersUrl}/role/programmer`);
  }

  /** 7. Estadísticas */
  getStats(): Observable<any> {
    return this.http.get(`${this.usersUrl}/stats/advisories`);
  }
}
