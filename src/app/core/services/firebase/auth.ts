import { Injectable, inject, signal } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, from, of } from 'rxjs';

export type Role = 'admin' | 'programmer' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  role: Role;
  displayName?: string;
  description?: string;
  specialty?: string;
  photoURL?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  availability?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(Auth);

  currentUser = signal<any | null>(null);
  userProfile = signal<UserProfile | null>(null);
  loading = signal<boolean>(false);

  private apiUrl = 'http://localhost:8080/api'; // Url del backend de Spring

  constructor() {
    // Al instanciar el servicio (cuando abres la app o recargas),
    // intentamos recuperar la sesión del localStorage.
    this.restoreSession();
  }

  //LÓGICA DE PERSISTENCIA
  private restoreSession() {
    const token = localStorage.getItem('jwt_token');
    const savedProfile = localStorage.getItem('user_profile');

    if (token && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        this.userProfile.set(profile);
        this.currentUser.set({ email: profile.email });
        console.log('✅ Sesión restaurada desde localStorage');
      } catch (e) {
        console.error('❌ Error al parsear el perfil guardado', e);
        this.logout();
      }
    }
  }

  // 1. LOGIN (Hacia Spring Boot)
  loginWithEmail(email: string, pass: string) {
    this.loading.set(true);
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password: pass }).pipe(
      tap({
        next: (res) => {
          // Guardamos el token
          localStorage.setItem('jwt_token', res.token);

          const profile: UserProfile = {
            uid: res.email,
            email: res.email,
            role: res.role as Role,
            displayName: res.email.split('@')[0]
          };

          // Guardamos el perfil completo como string para recuperarlo tras el F5
          localStorage.setItem('user_profile', JSON.stringify(profile));

          this.userProfile.set(profile);
          this.currentUser.set({ email: res.email });
          this.loading.set(false);
          console.log('🔑 Login exitoso: Token y Perfil persistidos.');
        },
        error: (err) => {
          this.loading.set(false);
          console.error('❌ Error en login:', err);
        }
      })
    );
  }

  // 2. REGISTRO (Hacia Spring Boot)
  registerWithEmail(email: string, pass: string) {
    this.loading.set(true);
    const newUser = {
      name: email.split('@')[0],
      email: email,
      password: pass,
      role: 'user',
      displayName: email.split('@')[0]
    };

    return this.http.post<any>(`${this.apiUrl}/users`, newUser).pipe(
      tap({
        next: () => {
          this.loading.set(false);
          console.log('👤 Usuario registrado exitosamente');
        },
        error: () => this.loading.set(false)
      })
    );
  }

  // 3. GOOGLE (Placeholder)
  loginWithGoogle() {
    console.warn('Google login temporalmente deshabilitado');
    return of(null);
  }

  // 4. LOGOUT
  logout() {
    // Limpiamos todo el rastro en el navegador
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_profile');

    this.userProfile.set(null);
    this.currentUser.set(null);

    // Cerramos sesión también en Firebase por si acaso y navegamos al login
    return from(signOut(this.auth)).pipe(
      tap(() => {
        console.log('🚪 Sesión cerrada y localStorage limpio.');
        this.router.navigate(['/auth/login']);
      })
    );
  }

  hasRole(role: Role): boolean {
    return this.userProfile()?.role === role;
  }
}

export { Auth };
