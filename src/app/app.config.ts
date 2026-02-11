import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

// Importación del Interceptor que maneja tus tokens JWT de Spring Boot
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuración del cliente HTTP con el interceptor de seguridad
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // Optimizaciones de rendimiento y manejo de rutas
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
};
