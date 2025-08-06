import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../shared/notification.service';
import { Notification, NotificationStatus, TargetAudience } from 'src/app/core/models/notification.model';
import { Observable, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})
export class NotificationFormComponent implements OnInit {
  notificationForm!: FormGroup;
  isEditMode = false;
  notificationId: string | null = null;
  isLoading = false;

  notificationStatuses = Object.values(NotificationStatus);
  targetAudiences = Object.values(TargetAudience);

  // For 'Specific Users' or 'Profiles' (placeholders, actual implementation would involve fetching users/profiles)
  availableUsers: string[] = ['user1@example.com', 'user2@example.com', 'user3@example.com'];
  availableProfiles: string[] = ['Administrators', 'Moderators', 'Standard Users'];

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.notificationId = this.route.snapshot.paramMap.get('id');
    if (this.notificationId) {
      this.isEditMode = true;
      this.loadNotification(this.notificationId);
    }
  }

  initForm(): void {
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      targetAudienceType: [TargetAudience.ALL, Validators.required], // Controls which input to show
      targetAudienceUsers: [[]],
      targetAudienceProfiles: [[]],
      sentAt: [new Date(), Validators.required],
      sentAtTime: [this.getFormattedTime(new Date()), Validators.required], // Time part
      status: [NotificationStatus.PENDING, Validators.required]
    });

    // Dynamically adjust validators based on targetAudienceType
    this.notificationForm.get('targetAudienceType')?.valueChanges.subscribe(type => {
      const usersControl = this.notificationForm.get('targetAudienceUsers');
      const profilesControl = this.notificationForm.get('targetAudienceProfiles');

      if (type === TargetAudience.SPECIFIC_USERS) {
        usersControl?.setValidators(Validators.required);
        profilesControl?.clearValidators();
      } else if (type === TargetAudience.PROFILES) {
        profilesControl?.setValidators(Validators.required);
        usersControl?.clearValidators();
      } else {
        usersControl?.clearValidators();
        profilesControl?.clearValidators();
      }
      usersControl?.updateValueAndValidity();
      profilesControl?.updateValueAndValidity();
    });
  }

  loadNotification(id: string): void {
    this.isLoading = true;
    this.notificationService.getNotificationById(id).subscribe({
      next: (notification) => {
        // Determine targetAudienceType based on the loaded notification
        let targetAudienceType: TargetAudience | string = TargetAudience.ALL;
        let targetAudienceUsers: string[] = [];
        let targetAudienceProfiles: string[] = [];

        if (Array.isArray(notification.targetAudience)) {
          // Heuristic: if values match available profiles, assume profiles. Otherwise, users.
          const isProfiles = notification.targetAudience.every(item => this.availableProfiles.includes(item as string));
          if (isProfiles) {
            targetAudienceType = TargetAudience.PROFILES;
            targetAudienceProfiles = notification.targetAudience as string[];
          } else {
            targetAudienceType = TargetAudience.SPECIFIC_USERS;
            targetAudienceUsers = notification.targetAudience as string[];
          }
        } else if (typeof notification.targetAudience === 'string') {
          targetAudienceType = notification.targetAudience as TargetAudience;
        }

        const sentAtDate = notification.sentAt ? new Date(notification.sentAt) : new Date();

        this.notificationForm.patchValue({
          title: notification.title,
          message: notification.message,
          targetAudienceType: targetAudienceType,
          targetAudienceUsers: targetAudienceUsers,
          targetAudienceProfiles: targetAudienceProfiles,
          sentAt: sentAtDate,
          sentAtTime: this.getFormattedTime(sentAtDate),
          status: notification.status
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notification:', err);
        alert('Erro ao carregar notificação para edição.'); // Replaced toastService.showError
        this.isLoading = false;
        this.router.navigate(['/notifications']);
      }
    });
  }

  private getFormattedTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private combineDateTime(): Date {
    const datePart = this.notificationForm.get('sentAt')?.value;
    const timePart = this.notificationForm.get('sentAtTime')?.value;

    if (!datePart || !timePart) {
      return new Date(); // Or throw an error/handle invalid input
    }

    const [hours, minutes] = timePart.split(':').map(Number);
    const combinedDate = new Date(datePart);
    combinedDate.setHours(hours, minutes, 0, 0);
    return combinedDate;
  }

  onSubmit(): void {
    if (this.notificationForm.invalid) {
      this.notificationForm.markAllAsTouched();
      alert('Por favor, preencha todos os campos obrigatórios corretamente.'); // Replaced toastService.showError
      return;
    }

    this.isLoading = true;

    const formValue = this.notificationForm.getRawValue();
    const combinedSentAt = this.combineDateTime();

    let targetAudienceValue: TargetAudience | string[] | string;
    if (formValue.targetAudienceType === TargetAudience.SPECIFIC_USERS) {
      targetAudienceValue = formValue.targetAudienceUsers;
    } else if (formValue.targetAudienceType === TargetAudience.PROFILES) {
      targetAudienceValue = formValue.targetAudienceProfiles;
    } else {
      targetAudienceValue = formValue.targetAudienceType;
    }

    const notification: Notification = {
      title: formValue.title,
      message: formValue.message,
      sentAt: combinedSentAt,
      status: formValue.status,
      targetAudience: targetAudienceValue
    };

    let operation: Observable<Notification>;
    if (this.isEditMode && this.notificationId) {
      operation = this.notificationService.updateNotification(this.notificationId, notification);
    } else {
      operation = this.notificationService.createNotification(notification);
    }

    operation.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        alert(`Notificação ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso!`); // Replaced toastService.showSuccess
        this.router.navigate(['/notifications']);
      },
      error: (err) => {
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} notification:`, err);
        alert(`Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} notificação.`); // Replaced toastService.showError
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/notifications']);
  }
}
