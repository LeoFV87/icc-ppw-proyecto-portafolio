import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/firebase/auth';

export const programmerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.loading).pipe(
    filter(loading => !loading), // Espera a que termine de cargar
    take(1),
    map(() => {
      const profile = authService.userProfile();

      // Permitimos entrar si es Programador O Admin (para que tú puedas ver el panel también)
      if (profile?.role === 'programmer' || profile?.role === 'admin') {
        return true;
      } else {
        console.warn('⛔ Acceso denegado: Se requiere ser Programador');
        router.navigate(['/']); // Redirige al Home
        return false;
      }
    })
  );
};
