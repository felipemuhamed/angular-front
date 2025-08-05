import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/keycloak.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-keycloak-app';
  isLoggedIn = false;
  username: string | null = null;
  userRoles: string[] = [];

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.isLoggedIn = await this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.username = await this.authService.getUsername();
      this.userRoles = this.authService.getUserRoles();
      // Optionally load user profile for more details
      // const userProfile = await this.authService.loadUserProfile();
      // console.log('User Profile:', userProfile);
    }
  }

  public async logout() {
    await this.authService.logout();
  }

  public async login() {
    await this.authService.login();
  }

  public async getToken() {
    const token = await this.authService.getToken();
    console.log('Current Access Token:', token);
  }
}
