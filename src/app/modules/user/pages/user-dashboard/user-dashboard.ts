import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AdvisoryService, AdvisoryRequest } from '../../../../core/services/advisory/advisory';
import { AuthService } from '../../../../core/services/auth/auth';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-dashboard.html',
})
export class UserDashboard implements OnInit {
  private advisoryService = inject(AdvisoryService);
  private authService = inject(AuthService);

  programmers = signal<any[]>([]);
  availableSlots = signal<string[]>([]);

  selectedProgId = signal<number | null>(null);
  topic = signal('');
  message = signal('');
  selectedSlot = signal('');

  myAdvisories$ = toObservable(this.authService.currentUser).pipe(
    switchMap(user => {
      if (user) return this.advisoryService.getClientAdvisories();
      return of([]);
    })
  );

  ngOnInit() {
    this.loadProgrammers();
  }

  loadProgrammers() {
    this.advisoryService.getAllProgrammers().subscribe({
      next: (progs) => this.programmers.set(progs),
      error: (err) => console.error('Error al cargar programadores', err)
    });
  }

  onProgrammerChange(id: number) {
    this.selectedProgId.set(id);
    this.selectedSlot.set('');

    const prog = this.programmers().find(p => p.id === id);

    if (prog && prog.availability && prog.availability.length > 0) {
      this.availableSlots.set(prog.availability);
    } else {
      this.advisoryService.getAvailability(id).subscribe({
        next: (slots) => this.availableSlots.set(slots),
        error: () => this.availableSlots.set([])
      });
    }
  }

  openModal() {
    const modal = document.getElementById('request_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  async submitRequest() {
    const prog = this.programmers().find(p => p.id === this.selectedProgId());
    const user = this.authService.currentUser();

    if (!prog || !user) {
      alert('Error: Información incompleta');
      return;
    }

    const request: AdvisoryRequest = {
      // CLIENTE
      clientId: user.uid || '1',
      clientName: user.displayName || 'Usuario',
      clientEmail: user.email || '',

      // PROGRAMADOR: Enviamos el EMAIL para que haga match en el panel del dev
      programmerId: prog.email,
      programmerName: prog.displayName || prog.name,

      // ASESORÍA
      topic: this.topic(),
      message: this.message(),
      timeSlot: this.selectedSlot(),
      status: 'pending'
    };

    try {
      await this.advisoryService.requestAdvisory(request);
      alert('✅ Solicitud enviada correctamente');
      window.location.reload();
    } catch (error: any) {
      console.error('Error del servidor:', error);
      alert('Error 400: Revisa los campos');
    }
  }
}
