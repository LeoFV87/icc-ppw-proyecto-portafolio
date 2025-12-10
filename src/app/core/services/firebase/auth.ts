import { Injectable, inject, signal } from '@angular/core';
import { Auth, user, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators'; // <--- Importamos tap

// Definimos la interfaz
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

  // Signals para manejar el estado
  currentUser = signal<User | null>(null);
  userProfile = signal<UserProfile | null>(null);


  loading = signal<boolean>(true);

  user$ = user(this.auth).pipe(
    tap((user) => {
      this.loading.set(true);
      this.currentUser.set(user);
      if (user) {
        // Si hay usuario, buscamos su perfil y luego apagamos loading
        this.fetchUserProfile(user).then(() => this.loading.set(false));
      } else {
        // Si no hay usuario, limpiamos y apagamos loading
        this.userProfile.set(null);
        this.loading.set(false);
      }
    })
  );

  constructor() {
    // Suscribirse para que arranque el monitoreo
    this.user$.subscribe();
  }

  // --- MÉTODOS PRIVADOS (Lógica extraída para que funcione el código de arriba) ---

  private async fetchUserProfile(user: User) {
    const userDocRef = doc(this.firestore, 'users', user.uid);
    const snapshot = await getDoc(userDocRef);

    if (snapshot.exists()) {
      // Si existe, lo cargamos
      this.userProfile.set(snapshot.data() as UserProfile);
    } else {
      // Si no existe, lo creamos (Lógica de registro automático)
      await this.createUserProfile(user);
    }
  }

  private async createUserProfile(user: User) {
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

  // --- Acciones de Autenticación ---

  loginWithGoogle() {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  logout() {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.currentUser.set(null);
        this.userProfile.set(null);
        this.router.navigate(['/auth/login']);
      })
    );
  }

  // --- Utilidades ---

  hasRole(role: Role): boolean {
    return this.userProfile()?.role === role;
  }
}
