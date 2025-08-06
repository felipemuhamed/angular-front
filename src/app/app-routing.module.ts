import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } = require("./components/user-form/user-form.component");
import { AuthGuard } from './guards/auth.guard';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { CallRecordListComponent } from './components/call-record-list/call-record-list.component';
import { CallRecordFormComponent } from './components/call-record-form/call-record-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'user'] } },
  { path: 'users/add', component: UserFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'users/edit/:id', component: UserFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'profiles', component: ProfileListComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'profiles/add', component: ProfileFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'profiles/edit/:id', component: ProfileFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  // New routes for Call Records
  { path: 'call-records', component: CallRecordListComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'operator'] } },
  { path: 'call-records/add', component: CallRecordFormComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'operator'] } },
  { path: 'call-records/edit/:id', component: CallRecordFormComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'operator'] } },
  // Wildcard route for any other path
  { path: '**', redirectTo: '/users' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
