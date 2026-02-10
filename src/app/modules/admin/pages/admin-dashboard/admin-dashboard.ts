import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface UserData {
  id: number;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'admin' | 'programmer' | 'user';
  specialty?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboard implements OnInit {
  private http = inject(HttpClient);

  // Señales reactivas
  users = signal<UserData[]>([]);
  stats = signal<any>(null);
  selectedUser = signal<UserData | null>(null);

  // Seguridad: Email del administrador principal que no se puede degradar
  readonly MAIN_ADMIN_EMAIL = 'admin@ups.edu.ec';

  ngOnInit() {
    this.loadUsers();
    this.loadStats();
  }

  loadUsers() {
    this.http.get<UserData[]>('http://localhost:8080/api/users').subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  loadStats() {
    this.http.get('http://localhost:8080/api/advisories/stats').subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error al cargar estadísticas:', err)
    });
  }

  async changeRole(id: number, email: string, newRole: string) {
    // Bloqueo de seguridad para el admin principal
    if (email === this.MAIN_ADMIN_EMAIL) {
      alert('⛔ ACCIÓN DENEGADA: El Administrador Principal no puede cambiar su propio rol.');
      return;
    }

    try {
      // PatchMapping en Java: /api/users/{id}/role?role=newRole
      await firstValueFrom(
        this.http.patch(`http://localhost:8080/api/users/${id}/role?role=${newRole}`, {})
      );
      alert('✅ Rol actualizado correctamente');
      this.loadUsers(); // Refrescar la tabla
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el rol en el servidor.');
    }
  }

  viewDetails(user: UserData) {
    this.selectedUser.set(user);
  }

  closeModal() {
    this.selectedUser.set(null);
  }
}
