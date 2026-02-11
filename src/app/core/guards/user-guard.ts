import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth/auth';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.loading).pipe(
    filter(loading => !loading),
    take(1),
    map(() => {
      const profile = authService.userProfile();

      // LÓGICA ESTRICTA: SOLO USUARIOS (CLIENTES)
      if (profile?.role === 'user') {
        return true;
      }

      // Si eres Programador o Admin, te redirige a tu lugar
      else {
        if (profile?.role === 'programmer') {
            console.warn('Redirigiendo programador a su panel...');
            router.navigate(['/programmer/dashboard']);
        } else if (profile?.role === 'admin') {
            router.navigate(['/admin/dashboard']);
        } else {
            router.navigate(['/']); // Si no tiene rol, al home
        }
        return false;
      }
    })
  );
};
