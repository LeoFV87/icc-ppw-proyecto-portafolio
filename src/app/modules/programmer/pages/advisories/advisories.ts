import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdvisoryRequest, AdvisoryService } from '../../../../core/services/advisory/advisory';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-advisories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advisories.html'
})
export class Advisories {
  private advisoryService = inject(AdvisoryService);
  private authService = inject(AuthService);

  requests$ = toObservable(this.authService.currentUser).pipe(
    switchMap(user => {
      if (user) return this.advisoryService.getProgrammerAdvisories(user.uid);
      return of([]);
    })
  );

  async respondRequest(request: AdvisoryRequest, status: 'accepted' | 'rejected') {
    if (!request.id) return;
    try {
      await this.advisoryService.updateAdvisoryStatus(request.id, status);
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Ocurrió un error al procesar la solicitud.');
    }
  }
}
