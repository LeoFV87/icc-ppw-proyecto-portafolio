import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing-module';
import { Home } from './pages/home/home';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PublicRoutingModule,
    Home
  ]
})
export class PublicModule { }
