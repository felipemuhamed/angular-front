import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../shared/notification.service';
import { Notification, NotificationStatus, TargetAudience } from 'src/app/core/models/notification.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss']
})
export class NotificationDetailComponent implements OnInit {
  notification: Notification | undefined;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadNotificationDetails(id);
    } else {
      alert('ID da notificação não fornecido.'); // Replaced toastService.showError
      this.router.navigate(['/notifications']);
    }
  }

  loadNotificationDetails(id: string): void {
    this.isLoading = true;
    this.notificationService.getNotificationById(id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.notification = data;
      },
      error: (err) => {
        console.error('Error loading notification details:', err);
        alert('Erro ao carregar detalhes da notificação.'); // Replaced toastService.showError
        this.router.navigate(['/notifications']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/notifications']);
  }
}
