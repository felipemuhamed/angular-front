import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'users/new', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: 'users/edit/:id', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: 'profiles', component: ProfileListComponent, canActivate: [AuthGuard] },
  { path: 'profiles/add', component: ProfileFormComponent, canActivate: [AuthGuard] },
  { path: 'profiles/edit/:id', component: ProfileFormComponent, canActivate: [AuthGuard] },
  {
    path: 'notifications',
    loadChildren: () => import('./features/notifications/notifications.module').then(m => m.NotificationsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'chamadas', // New route for call management
    loadChildren: () => import('./features/chamadas/chamadas.module').then(m => m.ChamadasModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/users' } // Wildcard route for any unmatched URL
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
