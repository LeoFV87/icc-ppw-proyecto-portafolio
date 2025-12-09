import { Injectable, inject, signal } from '@angular/core';
import { Auth, user, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Definimos la interfaz aquí mismo para facilitar las cosas
export type Role = 'admin' | 'programmer' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  role: Role;
  displayName?: string;
  photoURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // Signals para manejar el estado en toda la app
  currentUser = signal<User | null>(null);
  userProfile = signal<UserProfile | null>(null);

  // Observable del usuario de Firebase
  user$ = user(this.auth);

  constructor() {
    // Escuchar cambios de autenticación y cargar el perfil de base de datos
    this.user$.pipe(
      switchMap(user => {
        if (user) {
          this.currentUser.set(user);
          // Buscar el documento del usuario en Firestore
          return getDoc(doc(this.firestore, 'users', user.uid));
        } else {
          this.currentUser.set(null);
          this.userProfile.set(null);
          return of(null);
        }
      })
    ).subscribe(async (snapshot) => {
      if (snapshot && snapshot.exists()) {
        // Si existe el perfil, lo cargamos
        this.userProfile.set(snapshot.data() as UserProfile);
      } else if (this.currentUser()) {
        // Si el usuario se loguea por primera vez, creamos su perfil base
        const user = this.currentUser()!;
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: 'user' // Rol por defecto
        };
        await setDoc(doc(this.firestore, 'users', user.uid), newProfile);
        this.userProfile.set(newProfile);
      }
    });
  }

  // --- Acciones de Autenticación ---

  loginWithGoogle() {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  logout() {
    return from(signOut(this.auth)).pipe(
      switchMap(() => {
        this.currentUser.set(null);
        this.userProfile.set(null);
        return of(true);
      })
    );
  }

  // --- Utilidades ---

  hasRole(role: Role): boolean {
    return this.userProfile()?.role === role;
  }
}
