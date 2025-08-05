import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override router: Router,
    protected override keycloakService: KeycloakService
  ) {
    super(router, keycloakService);
  }

  /**
   * Determines if the user is allowed to activate the route.
   * Implements custom logic for authentication and role-based authorization.
   *
   * @param route The activated route snapshot.
   * @param state The router state snapshot.
   * @returns A promise that resolves to true, a UrlTree, or false indicating access permission.
   */
  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloakService.login({
        redirectUri: window.location.origin + state.url,
      });
      // Return false immediately after initiating login redirection to prevent route activation.
      return false;
    }

    // Get required roles from the route's data property.
    const requiredRoles = route.data['roles'];

    // Allow access if no roles are specified for the route.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Check if the user has ALL of the required roles.
    // 'this.roles' is inherited from KeycloakAuthGuard and contains roles assigned to the user.
    if (requiredRoles.every((role: string) => this.roles.includes(role))) {
      return true;
    } else {
      console.warn(
        'Access Denied: User does not have required roles.',
        'Required:', requiredRoles,
        'User Roles:', this.roles
      );
      // Optionally, redirect to an unauthorized access page or simply deny access.
      // For example: this.router.navigate(['/unauthorized']);
      return false; // Prevent access due to insufficient roles
    }
  }
}