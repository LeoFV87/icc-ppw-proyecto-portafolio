import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

// Interfaz para las peticiones de asesoría
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
  private apiUrl = 'http://localhost:8080/api/advisories';
  private usersUrl = 'http://localhost:8080/api/users';

  /** * 1. Disponibilidad: Obtener horarios reales del programador
   */
  getAvailability(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.usersUrl}/${id}/availability`);
  }

  /** * 2. Crear: El cliente solicita una nueva asesoría
   */
  requestAdvisory(data: AdvisoryRequest) {
    return firstValueFrom(this.http.post(this.apiUrl, data));
  }

  /** * 3. Cliente: Ver mis solicitudes enviadas
   */
  getClientAdvisories(): Observable<AdvisoryRequest[]> {
    return this.http.get<AdvisoryRequest[]>(`${this.apiUrl}/my-advisories`);
  }

  /** * 4. Programador: Ver las asesorías que me han solicitado (EL QUE FALTABA)
   */
  getProgrammerAdvisories(): Observable<AdvisoryRequest[]> {
    return this.http.get<AdvisoryRequest[]>(`${this.apiUrl}/assigned`);
  }

  /** * 5. Respuesta: Aceptar o rechazar una asesoría (EL OTRO QUE FALTABA)
   */
  async respondAdvisory(id: number, status: 'accepted' | 'rejected', replyMessage: string) {
    const url = `${this.apiUrl}/${id}/respond`;
    // Enviamos el estado y el mensaje al backend de Spring Boot
    return firstValueFrom(this.http.put(url, { status, replyMessage }));
  }

  /** * 6. Utilidad: Listar todos los programadores para los combos
   */
  getAllProgrammers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.usersUrl}/role/programmer`);
  }

  /** * 7. Estadísticas: Obtener totales para el gráfico del dashboard
   */
  getStats(): Observable<any> {
    // URL configurada en Java para las estadísticas de asesorías
    return this.http.get(`${this.usersUrl}/stats/advisories`);
  }
}
