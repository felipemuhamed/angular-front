import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home/home.component'; // Assuming you have a home component
import { AdminComponent } from './admin/admin.component'; // Assuming you have an admin component
import { UserProfileComponent } from './user-profile/user-profile.component'; // Assuming user profile component

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  // Add a route for unauthorized access if needed
  { path: 'unauthorized', component: HomeComponent } // Redirect to home or a dedicated unauthorized page
  // ... other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
