import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, collectionData, Timestamp, updateDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


export interface AdvisoryRequest {
  id?: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  programmerId: string;
  programmerName: string;
  topic: string;
  message: string;
  timeSlot: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class AdvisoryService {
  private firestore = inject(Firestore);

  async requestAdvisory(data: Omit<AdvisoryRequest, 'id' | 'createdAt' | 'status'>) {
    const advisoriesRef = collection(this.firestore, 'advisories');
    await addDoc(advisoriesRef, {
      ...data,
      status: 'pending',
      createdAt: Timestamp.now()
    });
  }

  getClientAdvisories(clientId: string): Observable<AdvisoryRequest[]> {
    const advisoriesRef = collection(this.firestore, 'advisories');
    const q = query(advisoriesRef, where('clientId', '==', clientId));
    return collectionData(q, { idField: 'id' }) as Observable<AdvisoryRequest[]>;
  }

  getProgrammerAdvisories(programmerId: string): Observable<AdvisoryRequest[]> {
    const advisoriesRef = collection(this.firestore, 'advisories');
    const q = query(advisoriesRef, where('programmerId', '==', programmerId));
    return collectionData(q, { idField: 'id' }) as Observable<AdvisoryRequest[]>;
  }

  async updateAdvisoryStatus(advisoryId: string, newStatus: 'accepted' | 'rejected') {
    const advisoryRef = doc(this.firestore, `advisories/${advisoryId}`);
    await updateDoc(advisoryRef, { status: newStatus });
  }
}
