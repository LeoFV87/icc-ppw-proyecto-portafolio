import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html'

})
export class Home {

  private authService = inject(AuthService);

  // Exponer las signals al HTML
  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

}
