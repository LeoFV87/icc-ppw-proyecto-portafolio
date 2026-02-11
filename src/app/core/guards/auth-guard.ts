import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.loading).pipe(
    filter(loading => !loading), // 1. Esperamos a que Firebase termine de cargar
    take(1),
    map(() => {
      // 2. Verificamos si hay un usuario logueado
      if (authService.currentUser()) {
        return true; // ¡Adelante!
      } else {
        // 3. Si no hay usuario, lo mandamos al Login
        console.warn('⛔ Acceso denegado: Debes iniciar sesión.');
        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};
