import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule // Needed for UserService
  ],
  providers: [
    UserService // Provide the service globally if not 'providedIn: root'
               // (though 'providedIn: root' is preferred as per UserService code)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
