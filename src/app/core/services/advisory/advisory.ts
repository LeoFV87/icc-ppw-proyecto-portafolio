import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

// Actualizamos la interfaz para que coincida con tu modelo de Java/PostgreSQL
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

  // 1. Solicitar nueva asesoría (POST)
  requestAdvisory(data: AdvisoryRequest) {
  return firstValueFrom(
    this.http.post('http://localhost:8080/api/advisories', data)
    );
  }

  // 2. Obtener asesorías del Cliente (GET)
  // Nota: El Backend ya filtra por el usuario del Token gracias al Ownership
  getClientAdvisories(): Observable<AdvisoryRequest[]> {
    return this.http.get<AdvisoryRequest[]>(`${this.apiUrl}/my-advisories`);
  }

  // 3. Obtener asesorías para el Programador (GET)
  getProgrammerAdvisories(): Observable<AdvisoryRequest[]> {
    return this.http.get<AdvisoryRequest[]>(`${this.apiUrl}/assigned`);
  }

  // 4. Responder/Actualizar estado de la asesoría (PUT/PATCH)
  async respondAdvisory(id: number, status: 'accepted' | 'rejected', replyMessage: string) {
    const url = `${this.apiUrl}/${id}/respond`;
    return this.http.put(url, { status, replyMessage }).toPromise();
  }
}
