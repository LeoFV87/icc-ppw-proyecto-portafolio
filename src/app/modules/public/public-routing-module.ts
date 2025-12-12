import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Explorar } from './pages/explorar/explorar';
import { PortfolioDetail } from './pages/portfolio-detail/portfolio-detail';

const routes: Routes = [

 {
    path: '',
    component: Home,
    pathMatch: 'full'
  },
  {
    path: 'explorar',
    component: Explorar
  },
  {
    path: 'portfolio/:id',
    component: PortfolioDetail
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {



}
