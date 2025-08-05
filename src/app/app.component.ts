import { Component, OnInit } from '@angular/core';
import { KeycloakAuthService } from './services/keycloak.service';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-front';
  isLoggedIn = false;
  userProfile: KeycloakProfile | null = null;

  constructor(private keycloakAuthService: KeycloakAuthService) {}

  /**
   * Initializes component, checks login status, and loads user profile.
   */
  async ngOnInit(): Promise<void> {
    this.isLoggedIn = await this.keycloakAuthService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloakAuthService.loadUserProfile();
    }
  }

  /**
   * Initiates the Keycloak login process.
   */
  login(): void {
    this.keycloakAuthService.login();
  }

  /**
   * Initiates the Keycloak logout process.
   */
  logout(): void {
    this.keycloakAuthService.logout();
  }

  /**
   * Checks if the currently logged-in user has the 'admin' role.
   * Used for conditional rendering of UI elements (e.g., 'Add User' button).
   * @returns True if the user has the 'admin' role, false otherwise.
   */
  hasAdminRole(): boolean {
    return this.keycloakAuthService.hasRole('admin');
  }
}