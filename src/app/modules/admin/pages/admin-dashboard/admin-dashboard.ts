import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'admin' | 'programmer' | 'user';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboard implements OnInit {
  private firestore = inject(Firestore);
  users$!: Observable<UserData[]>;


  selectedUser = signal<UserData | null>(null);

  readonly SUPER_ADMIN_UID = 'hIXAtewNzaS6fgy3aFIo0DZlwad2';

  ngOnInit() {
    const usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCollection, { idField: 'uid' }) as Observable<UserData[]>;
  }

  async changeRole(uid: string, newRole: 'admin' | 'programmer' | 'user') {

    //PROTECCION AL CREADOR
    if (uid === this.SUPER_ADMIN_UID) {
      alert('⛔ ACCIÓN DENEGADA: No se puede modificar el rol del Creador.');
      return;
    }

    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userDocRef, { role: newRole });
      console.log(`Rol actualizado a ${newRole} para el usuario ${uid}`);
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      alert('Error al actualizar el rol.');
    }
  }


  viewDetails(user: UserData) {
    this.selectedUser.set(user);
  }

  closeModal() {
    this.selectedUser.set(null);
  }




}
