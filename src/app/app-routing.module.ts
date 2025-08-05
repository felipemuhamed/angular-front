import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard], data: { roles: ['user', 'admin'] } },
  { path: 'users/new', component: UserFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'users/edit/:id', component: UserFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: '**', redirectTo: '/users' } // Wildcard route for any other unrecognized paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
