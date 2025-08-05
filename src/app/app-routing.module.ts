import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { AuthGuard } from './guards/auth.guard'; // Import the AuthGuard

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard], // Protect this route with AuthGuard
    data: { roles: ['user', 'admin'] } // Example: Users with 'user' or 'admin' role can access
  },
  {
    path: 'users/add',
    component: UserFormComponent,
    canActivate: [AuthGuard], // Protect this route with AuthGuard
    data: { roles: ['admin'] } // Example: Only 'admin' role can add users
  },
  {
    path: 'users/edit/:id',
    component: UserFormComponent,
    canActivate: [AuthGuard], // Protect this route with AuthGuard
    data: { roles: ['admin'] } // Example: Only 'admin' role can edit users
  },
  // Wildcard route for any unmatched paths, redirects to /users
  { path: '**', redirectTo: '/users' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
