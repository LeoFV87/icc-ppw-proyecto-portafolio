import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AdvisoryService } from '../../../../core/services/advisory/advisory';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.html',
})
export class UserDashboard {
  private advisoryService = inject(AdvisoryService);
  private authService = inject(AuthService);

  myAdvisories$ = toObservable(this.authService.currentUser).pipe(
    switchMap(user => {
      if (user) {
        return this.advisoryService.getClientAdvisories(user.uid);
      }
      return of([]);
    })
  );
}
