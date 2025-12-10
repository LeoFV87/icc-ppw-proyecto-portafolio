import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgrammerDashboard } from './pages/programmer-dashboard/programmer-dashboard';
import { Advisories } from './pages/advisories/advisories';
import { Profile } from './pages/profile/profile';
import { MyProjects } from './pages/my-projects/my-projects';

const routes: Routes = [
  {
    path: '', // Ruta base: /programmer
    component: ProgrammerDashboard
  },
  {
    path: 'dashboard',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'proyectos', // Ruta: /programmer/proyectos
    component: MyProjects
  },
  {
    path: 'perfil',    // Ruta: /programmer/perfil
    component: Profile
  },
  {
    path: 'asesorias', // Ruta: /programmer/asesorias
    component: Advisories
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgrammerRoutingModule { }
