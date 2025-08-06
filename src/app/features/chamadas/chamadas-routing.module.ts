import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChamadaListComponent } from './components/chamada-list/chamada-list.component';
import { ChamadaFormComponent } from './components/chamada-form/chamada-form.component';

const routes: Routes = [
  { path: '', component: ChamadaListComponent },
  { path: 'nova', component: ChamadaFormComponent },
  { path: 'editar/:id', component: ChamadaFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChamadasRoutingModule { }
