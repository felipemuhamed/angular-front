import { Component, OnInit, ViewChild } from '@angular/core';
import { Chamada, CallStatus } from '../../../../core/models/chamada.model';
import { ChamadaService } from '../../../../services/chamada.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-chamada-list',
  templateUrl: './chamada-list.component.html',
  styleUrls: ['./chamada-list.component.css']
})
export class ChamadaListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'numeroOrigem', 'numeroDestino', 'dataHoraChamada', 'duracao', 'statusChamada', 'operadorResponsavel', 'cliente', 'actions'];
  dataSource = new MatTableDataSource<Chamada>();
  isLoadingResults = true;
  totalChamadas = 0;
  pageSize = 10;
  currentPage = 1;
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private searchSubject = new Subject<string>();

  constructor(
    private chamadaService: ChamadaService,
    private router: Router,
    private dialog: MatDialog, // For confirmation modal
    private snackBar: MatSnackBar // For success/error messages
  ) { }

  ngOnInit(): void {
    this.loadChamadas();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadChamadas();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(): void {
    this.searchSubject.next(this.searchTerm);
  }

  loadChamadas(): void {
    this.isLoadingResults = true;
    this.chamadaService.getChamadas(this.currentPage, this.pageSize, this.searchTerm)
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.chamadas;
          this.totalChamadas = response.totalCount;
          this.isLoadingResults = false;
        },
        error: (error) => {
          console.error('Erro ao carregar chamadas:', error);
          this.isLoadingResults = false;
          this.showSnackBar('Erro ao carregar chamadas.', 'error');
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; // MatPaginator uses 0-based index
    this.pageSize = event.pageSize;
    this.loadChamadas();
  }

  addChamada(): void {
    this.router.navigate(['/chamadas/nova']);
  }

  editChamada(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/chamadas/editar', id]);
    }
  }

  deleteChamada(id: number | undefined): void {
    if (id) {
      // Implement confirmation modal
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: { message: 'Tem certeza que deseja excluir esta chamada?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.chamadaService.deleteChamada(id).subscribe({
            next: () => {
              this.showSnackBar('Chamada excluída com sucesso!', 'success');
              this.loadChamadas(); // Reload list after deletion
            },
            error: (error) => {
              console.error('Erro ao excluir chamada:', error);
              this.showSnackBar('Erro ao excluir chamada.', 'error');
            }
          });
        }
      });
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }
}

// Dummy ConfirmationDialogComponent (needs to be created in a shared module or here)
// For simplicity, assuming a basic dialog component exists.
// In a real app, this would be in a shared module.
// The import of 'Component' from @angular/core was removed as it's already imported at the top.
@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h1 mat-dialog-title>Confirmação</h1>
    <div mat-dialog-content>{{ data.message }}</div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Não</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Sim</button>
    </div>
  `,
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}