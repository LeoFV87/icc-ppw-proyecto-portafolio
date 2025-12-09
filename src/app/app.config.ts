import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 1. Importaciones de Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// 2. Tu configuración (la que copiaste)
const firebaseConfig = {
  apiKey: "AIzaSyCHnZwGdhsVFCK7LT9ncSRT1bLCvypP2b8",
  authDomain: "proyecto-integrador-ppw.firebaseapp.com",
  projectId: "proyecto-integrador-ppw",
  storageBucket: "proyecto-integrador-ppw.firebasestorage.app",
  messagingSenderId: "855044593028",
  appId: "1:855044593028:web:7b4e677e2787144399b9d1"
};

export const appConfig: ApplicationConfig = {
  providers: [
    // Tus proveedores actuales
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    // 3. Proveedores de Firebase agregados
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
