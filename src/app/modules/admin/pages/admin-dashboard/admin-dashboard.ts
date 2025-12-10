import { Component, inject, OnInit } from '@angular/core';
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
  imports: [CommonModule], // Importante para el pipe async y ngClass
  templateUrl: './admin-dashboard.html'

})
export class AdminDashboard implements OnInit {
  private firestore = inject(Firestore);

  // Observable que traerá los usuarios en tiempo real
  users$!: Observable<UserData[]>;

  ngOnInit() {
    // Referencia a la colección 'users'
    const usersCollection = collection(this.firestore, 'users');
    // Traemos los datos y pedimos que incluya el ID del documento en el campo 'uid'
    this.users$ = collectionData(usersCollection, { idField: 'uid' }) as Observable<UserData[]>;
  }

  // Función para cambiar el rol (la usaremos en los botones)
  async changeRole(uid: string, newRole: 'admin' | 'programmer' | 'user') {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userDocRef, { role: newRole });
      console.log(`Rol actualizado a ${newRole} para el usuario ${uid}`);
      // No hace falta recargar, collectionData actualiza la tabla solo
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      alert('Error al actualizar el rol. Verifica la consola.');
    }
  }
}
