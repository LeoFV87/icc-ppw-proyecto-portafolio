import { Routes } from '@angular/router';
import { ProfileSettings } from './modules/auth/pages/profile-settings/profile-settings';
import { programmerGuard } from './core/guards/programmer-guard';
import { adminGuard } from './core/guards/admin-guard';
import { UserDashboard } from './modules/user/pages/user-dashboard/user-dashboard';
import { userGuard } from './core/guards/user-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

   { path: '',
    loadChildren: () => import('./modules/public/public-module').then(m => m.PublicModule) },

  { path: 'auth',
    loadChildren: () => import('./modules/auth/auth-module').then(m => m.AuthModule) },

  { path: 'admin',
     loadChildren: () => import('./modules/admin/admin-module').then(m => m.AdminModule),
    canActivate: [adminGuard] },

  { path: 'programmer',
    loadChildren: () => import('./modules/programmer/programmer-module').then(m => m.ProgrammerModule) ,
    canActivate: [programmerGuard]},

  {
    path: 'perfil',
    component: ProfileSettings,
    canActivate: [authGuard]
  },
  {
  path: 'mis-asesorias',
  component: UserDashboard,
  canActivate: [userGuard]
  },

  { path: '**', redirectTo: '' }




];
