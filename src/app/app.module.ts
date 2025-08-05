import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthService } from './core/services/keycloak.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor'; // Assuming you might add an interceptor

function initializeKeycloak(keycloak: KeycloakService, authService: AuthService) {
  return () => authService.init();
}

@NgModule({
  declarations: [
    AppComponent
    // ... other components
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    KeycloakAngularModule
  ],
  providers: [
    KeycloakService, // Provide KeycloakService itself
    AuthService, // Provide your custom AuthService
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, AuthService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // Register the interceptor if needed
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
