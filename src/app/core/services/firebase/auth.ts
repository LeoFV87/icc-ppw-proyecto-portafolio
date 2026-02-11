import { Injectable, inject, signal } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, from, Observable } from 'rxjs';

export type Role = 'admin' | 'programmer' | 'user';

export interface UserProfile {
  uid: string;
  name: string;
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

  private apiUrl = 'http://localhost:8080/api';

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    const token = localStorage.getItem('jwt_token');
    const savedProfile = localStorage.getItem('user_profile');
    if (token && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        this.userProfile.set(profile);
        this.currentUser.set({ email: profile.email });
        this.refreshProfile();
      } catch (e) {
        this.logout().subscribe();
      }
    }
  }

  registerWithEmail(email: string, pass: string): Observable<any> {
    this.loading.set(true);
    const newUser = {
      name: email.split('@')[0],
      email: email,
      password: pass,
      role: 'user'
    };
    return this.http.post<any>(`${this.apiUrl}/users`, newUser).pipe(
      tap({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false)
      })
    );
  }

  loginWithEmail(email: string, pass: string) {
    this.loading.set(true);
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password: pass }).pipe(
      tap({
        next: (res) => {
          localStorage.setItem('jwt_token', res.token);
          const profile = this.mapToProfile(res);
          this.saveAndSetProfile(profile);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  refreshProfile() {
    this.http.get<UserProfile>(`${this.apiUrl}/users/profile`).subscribe({
      next: (profile) => this.saveAndSetProfile(profile),
      error: (err) => console.error('Error al refrescar:', err)
    });
  }

  logout(): Observable<void> {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_profile');
    this.userProfile.set(null);
    this.currentUser.set(null);
    return from(signOut(this.auth));
  }

  /**
   * Método que faltaba: Verifica si el usuario tiene un rol específico.
   * Compara en minúsculas para evitar errores de consistencia.
   */
  hasRole(role: string): boolean {
    const currentRole = this.userProfile()?.role;
    return currentRole?.toLowerCase() === role.toLowerCase();
  }

  private mapToProfile(res: any): UserProfile {
    return {
      uid: res.email,
      name: res.name || res.email.split('@')[0],
      email: res.email,
      role: res.role as Role,
      photoURL: res.photoURL || '',
      skills: res.skills || [],
      availability: res.availability || []
    };
  }

  private saveAndSetProfile(profile: UserProfile) {
    localStorage.setItem('user_profile', JSON.stringify(profile));
    this.userProfile.set(profile);
    this.currentUser.set({ email: profile.email });
  }
}
