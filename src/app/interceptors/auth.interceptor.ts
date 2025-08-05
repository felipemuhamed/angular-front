import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private keycloakService: KeycloakService) {}

  /**
   * Intercepts outgoing HTTP requests to add the Keycloak access token.
   *
   * @param request The outgoing HTTP request.
   * @param next The next interceptor in the chain.
   * @returns An Observable of the HTTP event.
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Ensure the request does not target the Keycloak authentication server itself
    // to avoid infinite loops or sending tokens to the wrong endpoint.
    const keycloakAuthServerUrl = this.keycloakService.getKeycloakInstance().authServerUrl;
    const isKeycloakAuthRequest = keycloakAuthServerUrl ? request.url.startsWith(keycloakAuthServerUrl) : false;

    // Only add token if the user is logged in and the request is not for Keycloak's auth server.
    if (this.keycloakService.isLoggedIn() && !isKeycloakAuthRequest) {
      // Use 'from' to convert the Promise returned by getToken() into an Observable,
      // and then 'mergeMap' to flatten the Observable of a Promise into the actual HTTP Observable.
      return from(this.keycloakService.getToken()).pipe(
        mergeMap((token) => {
          // Clone the request and set the Authorization header with the Bearer token.
          const authorizedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Pass the cloned request to the next handler.
          return next.handle(authorizedRequest);
        })
      );
    }

    // If not logged in or it's a Keycloak auth request, proceed with the original request.
    return next.handle(request);
  }
}