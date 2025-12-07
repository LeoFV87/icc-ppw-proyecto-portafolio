import { Routes } from '@angular/router';

export const routes: Routes = [

   { path: '',
    loadChildren: () => import('./modules/public/public-module').then(m => m.PublicModule) },

  { path: 'auth',
    loadChildren: () => import('./modules/auth/auth-module').then(m => m.AuthModule) },

  { path: 'admin',
     loadChildren: () => import('./modules/admin/admin-module').then(m => m.AdminModule) },

  { path: 'programmer',
    loadChildren: () => import('./modules/programmer/programmer-module').then(m => m.ProgrammerModule) },

  { path: '**', redirectTo: '' }










];
