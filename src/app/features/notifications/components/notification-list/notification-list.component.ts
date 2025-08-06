import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '../../shared/notification.service';
import { Notification, NotificationStatus, TargetAudience } from 'src/app/core/models/notification.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'title', 'message', 'sentAt', 'status', 'targetAudience', 'actions'];
  dataSource = new MatTableDataSource<Notification>();
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchTerm: string = '';
  statusFilter: string = '';
  audienceFilter: string = '';

  notificationStatuses = Object.values(NotificationStatus);
  targetAudiences = Object.values(TargetAudience);

  private searchSubject = new Subject<string>();

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadNotifications();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(() => this.loadNotifications());
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.loadNotifications();
    });
  }

  loadNotifications(): void {
    this.isLoadingResults = true;
    const page = this.paginator ? this.paginator.pageIndex + 1 : 1;
    const limit = this.paginator ? this.paginator.pageSize : 10;

    this.notificationService.getNotifications(page, limit, this.searchTerm, this.statusFilter, this.audienceFilter)
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          // Assuming backend sends total count for pagination. If not, this might need adjustment.
          // this.paginator.length = data.totalCount; 
          this.isLoadingResults = false;
        },
        error: (err) => {
          console.error('Error loading notifications:', err);
          alert('Erro ao carregar notificações.'); // Replaced toastService.showError
          this.isLoadingResults = false;
        }
      });
  }

  applyFilter(): void {
    // Trigger reload when any filter changes
    this.paginator.pageIndex = 0; // Reset pagination when filters change
    this.searchSubject.next(this.searchTerm);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.audienceFilter = '';
    this.applyFilter();
  }

  createNotification(): void {
    this.router.navigate(['/notifications/new']);
  }

  editNotification(id: string): void {
    this.router.navigate([`/notifications/edit/${id}`]);
  }

  viewNotificationDetails(id: string): void {
    this.router.navigate([`/notifications/${id}`]);
  }

  deleteNotification(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta notificação?')) { // Replaced ConfirmationDialogComponent
      this.notificationService.deleteNotification(id).subscribe({
        next: () => {
          alert('Notificação excluída com sucesso!'); // Replaced toastService.showSuccess
          this.loadNotifications();
        },
        error: (err) => {
          console.error('Error deleting notification:', err);
          alert('Erro ao excluir notificação.'); // Replaced toastService.showError
        }
      });
    }
  }
}
