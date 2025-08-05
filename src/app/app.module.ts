import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';

// Keycloak imports
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { KeycloakAuthService } from './services/keycloak.service'; // Our wrapper service
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard'; // Import AuthGuard

/**
 * Factory function to initialize Keycloak before the Angular application starts.
 * This ensures Keycloak is ready before any components or services require authentication.
 * @param keycloakAuthService Our custom KeycloakAuthService wrapper.
 * @returns A function that returns a Promise, which Angular's APP_INITIALIZER will await.
 */
function initializeKeycloak(keycloakAuthService: KeycloakAuthService) {
  return () => keycloakAuthService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // Add HttpClientModule here
    FormsModule, // Add FormsModule here
    ReactiveFormsModule, // Add ReactiveFormsModule here
    KeycloakAngularModule // Add KeycloakAngularModule for Keycloak integration
  ],
  providers: [
    KeycloakService, // Provide KeycloakService from keycloak-angular itself
    KeycloakAuthService, // Provide our custom KeycloakAuthService wrapper
    AuthGuard, // Provide our AuthGuard for route protection
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true, // Required for multiple APP_INITIALIZER tokens
      deps: [KeycloakAuthService], // Our wrapper service handles initialization
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Required for multiple HTTP_INTERCEPTORS tokens
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
