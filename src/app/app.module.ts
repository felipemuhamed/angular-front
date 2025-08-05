import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } => './components/user-form/user-form.component';

// New imports for Profile Management
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { ProfileService } from './services/profile.service';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthGuard } from './guards/auth.guard';
import { KeycloakAuthService } from './services/keycloak.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'YOUR_KEYCLOAK_URL', // Replace with your Keycloak URL
        realm: 'YOUR_REALM',     // Replace with your Keycloak Realm
        clientId: 'YOUR_CLIENT_ID' // Replace with your Keycloak Client ID
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserFormComponent,
    ProfileListComponent, // Declare new component
    ProfileFormComponent  // Declare new component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    KeycloakAngularModule,
    BrowserAnimationsModule,
    MatPaginatorModule
  ],
  providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    AuthGuard,
    KeycloakAuthService,
    ProfileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }