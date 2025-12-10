import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/firebase/auth';
import {  RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterModule],
  templateUrl: './home.html'

})
export class Home {

  private authService = inject(AuthService);

  // Exponer las signals al HTML
  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

}
