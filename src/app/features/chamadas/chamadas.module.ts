import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ChamadasRoutingModule } from './chamadas-routing.module';
import { ChamadaListComponent } from './components/chamada-list/chamada-list.component';
import { ConfirmationDialogComponent } from './components/chamada-list/chamada-list.component'; // Import ConfirmationDialogComponent
import { ChamadaFormComponent } from './components/chamada-form/chamada-form.component'; // Import ChamadaFormComponent


@NgModule({
  declarations: [
    ChamadaListComponent,
    ChamadaFormComponent,
    ConfirmationDialogComponent // Declare ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    ChamadasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSnackBarModule // For success/error messages
  ]
})
export class ChamadasModule { }
