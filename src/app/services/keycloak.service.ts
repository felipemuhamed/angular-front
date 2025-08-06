import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakLoginOptions } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {
  private userProfile: KeycloakProfile | null = null;
  private isAuthenticated = false;

  constructor(private keycloakService: KeycloakService) {
    this.initAuthState();
  }

  private async initAuthState(): Promise<void> {
    this.isAuthenticated = await this.keycloakService.isLoggedIn();
    if (this.isAuthenticated) {
      await this.loadUserProfile();
    }
  }

  async init(): Promise<any> {
    try {
      const authenticated = await this.keycloakService.init({
        config: {
          url: 'YOUR_KEYCLOAK_URL/auth',
          realm: 'YOUR_REALM',
          clientId: 'YOUR_CLIENT_ID'
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          pkceMethod: 'S256',
        },
        enableBearerInterceptor: false
      });
      this.isAuthenticated = authenticated;
      if (authenticated) {
        await this.loadUserProfile();
      }
      console.log('Keycloak initialized. Authenticated:', authenticated);
      return authenticated;
    } catch (error) {
      console.error('Error initializing Keycloak:', error);
      return false;
    }
  }

  login(options?: KeycloakLoginOptions): Promise<void> {
    return this.keycloakService.login(options);
  }

  logout(redirectUri?: string): Promise<void> {
    return this.keycloakService.logout(redirectUri);
  }

  getToken(): Promise<string> {
    return this.keycloakService.getToken();
  }

  isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }

  async loadUserProfile(): Promise<KeycloakProfile> {
    if (!this.userProfile) {
      this.userProfile = await this.keycloakService.loadUserProfile();
    }
    return this.userProfile;
  }

  getUserProfile(): KeycloakProfile | null {
    return this.userProfile;
  }

  hasRole(role: string): boolean {
    return this.keycloakService.isUserInRole(role);
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshed = await this.keycloakService.updateToken(70);
      console.log('Token refreshed:', refreshed);
      return refreshed;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }
}