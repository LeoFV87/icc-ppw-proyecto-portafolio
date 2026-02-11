import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Recuperamos el token que guardamos en el login
  const token = localStorage.getItem('jwt_token');

  // Si el token existe, clonamos la petición y le añadimos el encabezado Authorization
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // Si no hay token, la petición sigue su curso normal
  return next(req);
};
