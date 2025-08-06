import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationFormComponent } => './components/notification-form/notification-form.component';
import { NotificationDetailComponent } from './components/notification-detail/notification-detail.component';

const routes: Routes = [
  { path: '', component: NotificationListComponent },
  { path: 'new', component: NotificationFormComponent },
  { path: 'edit/:id', component: NotificationFormComponent },
  { path: ':id', component: NotificationDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }