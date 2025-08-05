import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {
  private userProfile: KeycloakProfile | null = null;
  private isAuthenticated = false;

  constructor(private keycloakService: KeycloakService) {
    // Initialize authentication status and user profile if already logged in
    this.keycloakService.isLoggedIn().then(loggedIn => {
      this.isAuthenticated = loggedIn;
      if (loggedIn) {
        this.loadUserProfile();
      }
    });
  }

  /**
   * Initializes the Keycloak client with configuration.
   * This method is typically called via APP_INITIALIZER in app.module.ts.
   */
  async init(): Promise<any> {
    try {
      const authenticated = await this.keycloakService.init({
        config: {
          url: 'YOUR_KEYCLOAK_URL/auth', // e.g., 'http://localhost:8080/auth'
          realm: 'YOUR_REALM', // e.g., 'my-app-realm'
          clientId: 'YOUR_CLIENT_ID' // e.g., 'angular-client'
        },
        initOptions: {
          onLoad: 'check-sso', // 'login-required' or 'check-sso'
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          pkceMethod: 'S256',
          // Optional: Set refresh token lifespan in seconds for testing. Default is realm setting.
          // refreshTokenLifespan: 300
        },
        enableBearerInterceptor: false // We will handle this with our custom interceptor
      });
      this.isAuthenticated = authenticated;
      if (authenticated) {
        await this.loadUserProfile();
      }
      console.log('Keycloak initialized. Authenticated:', authenticated);
      return authenticated;
    } catch (error) {
      console.error('Error initializing Keycloak:', error);
      // Depending on the error, you might want to redirect to an error page or handle it gracefully.
      return false;
    }
  }

  /**
   * Performs Keycloak login, redirecting to the Keycloak login page.
   * @param options KeycloakLoginOptions for customizing login behavior.
   */
  login(options?: KeycloakJs.KeycloakLoginOptions): Promise<void> {
    return this.keycloakService.login(options);
  }

  /**
   * Performs Keycloak logout, redirecting to the Keycloak logout page.
   * @param redirectUri Optional URI to redirect to after logout.
   */
  logout(redirectUri?: string): Promise<void> {
    return this.keycloakService.logout(redirectUri);
  }

  /**
   * Retrieves the Keycloak access token.
   * @returns A promise that resolves with the access token string.
   */
  getToken(): Promise<string> {
    return this.keycloakService.getToken();
  }

  /**
   * Checks if the user is currently authenticated with Keycloak.
   * @returns A promise that resolves to true if authenticated, false otherwise.
   */
  isLoggedIn(): Promise<boolean> {
    return this.keycloakService.isLoggedIn();
  }

  /**
   * Loads the user profile from Keycloak if not already loaded.
   * Updates the internal userProfile property.
   * @returns A promise that resolves with the KeycloakProfile object.
   */
  async loadUserProfile(): Promise<KeycloakProfile> {
    if (!this.userProfile) {
      this.userProfile = await this.keycloakService.loadUserProfile();
    }
    return this.userProfile;
  }

  /**
   * Retrieves the cached user profile.
   * @returns The KeycloakProfile object or null if not loaded/authenticated.
   */
  getUserProfile(): KeycloakProfile | null {
    return this.userProfile;
  }

  /**
   * Checks if the authenticated user has a specific role or any of the specified roles.
   * @param role A single role string or an array of role strings to check for.
   * @returns True if the user has the role(s), false otherwise.
   */
  hasRole(role: string | string[]): boolean {
    return this.keycloakService.isUserInRole(role);
  }

  /**
   * Manually attempts to refresh the Keycloak access token.
   * The `keycloak-angular` library often handles this automatically with `check-sso`.
   * @returns A promise that resolves to true if the token was refreshed, false otherwise.
   */
  async refreshToken(): Promise<boolean> {
    try {
      // Refreshes token if it expires in less than 70 seconds. Adjust threshold as needed.
      const refreshed = await this.keycloakService.updateToken(70);
      console.log('Token refreshed:', refreshed);
      return refreshed;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }
}