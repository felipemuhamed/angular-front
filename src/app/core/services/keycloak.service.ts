import { Injectable } from '@angular/core';
import { KeycloakService, KeycloakEventType } from 'keycloak-angular';
import { from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloakService: KeycloakService;

  constructor(keycloakService: KeycloakService) {
    this.keycloakService = keycloakService;
    this.keycloakService.keycloakEvents$.pipe(
      filter(event => event.type === KeycloakEventType.OnTokenExpired)
    ).subscribe(() => {
      console.log('Token expired, attempting to refresh...');
      this.refreshToken();
    });
  }

  public init(): Promise<boolean> {
    return this.keycloakService.init({
      config: {
        url: 'http://localhost:8080/auth',
        realm: 'your-realm',
        clientId: 'your-client-id'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      },
      bearerExcludedUrls: [] // Add URLs that should not have the bearer token attached
    });
  }

  public isLoggedIn(): Promise<boolean> {
    return this.keycloakService.isLoggedIn();
  }

  public login(): Promise<void> {
    return this.keycloakService.login();
  }

  public logout(): Promise<void> {
    return this.keycloakService.logout(window.location.origin);
  }

  public getUsername(): Promise<string> {
    return this.keycloakService.getUsername();
  }

  public getUserRoles(allRoles?: boolean): string[] {
    return this.keycloakService.getUserRoles(allRoles);
  }

  public isUserInRole(role: string): boolean {
    return this.keycloakService.isUserInRole(role);
  }

  public getToken(): Promise<string> {
    return this.keycloakService.getToken();
  }

  public refreshToken(): Observable<boolean> {
    return from(this.keycloakService.updateToken(70)).pipe(
      map(refreshed => {
        if (refreshed) {
          console.log('Token successfully refreshed.');
        } else {
          console.log('Token not refreshed, token is still valid.');
        }
        return refreshed;
      })
    );
  }

  public loadUserProfile(): Promise<any> {
    return this.keycloakService.loadUserProfile();
  }

}
