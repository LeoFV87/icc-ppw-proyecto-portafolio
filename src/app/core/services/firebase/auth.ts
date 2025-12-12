import { Injectable, inject, signal } from '@angular/core';
import { Auth, user, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';

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

  // Inicia sesión con credenciales de correo y contraseña existentes
  loginWithEmail(email: string, pass: string) {
    return from(signInWithEmailAndPassword(this.auth, email, pass));
  }

  // Crea una cuenta nueva en Firebase Auth y genera automáticamente el perfil en Firestore
  registerWithEmail(email: string, pass: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, pass)).pipe(
      switchMap((userCredential) => {
        // Establecemos el usuario actual en el estado
        this.currentUser.set(userCredential.user);
        // Llamamos a la función que crea el documento en la base de datos
        return this.createUserProfile(userCredential.user);
      })
    );
  }

  // Inicia sesión abriendo una ventana emergente de Google
  loginWithGoogle() {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  // Cierra la sesión, limpia los estados y redirige al login
  logout() {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.currentUser.set(null);
        this.userProfile.set(null);
      })
    );
  }

  // --- Métodos Privados y de Base de Datos ---

  private async fetchUserProfile(user: User) {
    const userDocRef = doc(this.firestore, 'users', user.uid);
    const snapshot = await getDoc(userDocRef);

    if (snapshot.exists()) {
      // Si existe el documento, actualizamos la signal del perfil
      this.userProfile.set(snapshot.data() as UserProfile);
    } else {
      // Si no existe, creamos uno nuevo por defecto
      await this.createUserProfile(user);
    }
  }

  // Crea el documento del usuario en Firestore con rol 'user' por defecto
  // (Nota: Se hizo público o accesible internamente para usarse en el registro)
  async createUserProfile(user: User) {
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || '', // En registro por correo esto puede estar vacío inicialmente
      photoURL: user.photoURL || '',
      role: 'user'
    };
    await setDoc(doc(this.firestore, 'users', user.uid), newProfile);
    this.userProfile.set(newProfile);
  }

  // --- Utilidades ---

  hasRole(role: Role): boolean {
    return this.userProfile()?.role === role;
  }
}

export { Auth };
