import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { filter, map, take } from 'rxjs/operators'; // Usamos filter en vez de skipWhile
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/firebase/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Observamos la señal 'loading'.

  return toObservable(authService.loading).pipe(
    filter(loading => !loading), // 1. Bloquea el paso hasta que loading sea false
    take(1),                     // 2. Toma solo la primera vez que deje de cargar y se desconecta
    map(() => {

      // 3. Ahora que ya cargó, revisamos el perfil directamente
      const profile = authService.userProfile();

      if (profile?.role === 'admin') {
        return true;
      } else {
        console.warn('⛔ Acceso denegado: Se requiere ser Admin');
        router.navigate(['/']); // Redirige al Home
        return false;
      }
    })
  );
};
