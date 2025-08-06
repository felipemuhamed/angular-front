import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CallRecordService } from '../../services/call-record.service';
import { CallRecord } from '../../models/call-record.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-call-record-form',
  templateUrl: './call-record-form.component.html',
  styleUrls: ['./call-record-form.component.css']
})
export class CallRecordFormComponent implements OnInit {
  callRecordForm!: FormGroup;
  isEditMode: boolean = false;
  callRecordId: number | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private callRecordService: CallRecordService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.subscriptions.add(this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.callRecordId = +id;
        this.loadCallRecord(this.callRecordId);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initForm(): void {
    this.callRecordForm = this.fb.group({
      originNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]], // Example: 10-15 digits
      destinationNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      callDateTime: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(0)]],
      status: ['in_progress', Validators.required],
      operator: ['', Validators.required],
      clientId: [null], // Optional
      clientName: [''] // Optional
    });
  }

  loadCallRecord(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.subscriptions.add(this.callRecordService.getCallRecordById(id)
      .subscribe({
        next: (record: CallRecord) => {
          this.callRecordForm.patchValue({
            originNumber: record.originNumber,
            destinationNumber: record.destinationNumber,
            // Ensure date format is compatible with input type=datetime-local
            callDateTime: record.callDateTime ? new Date(record.callDateTime).toISOString().slice(0, 16) : '',
            duration: record.duration,
            status: record.status,
            operator: record.operator,
            clientId: record.clientId,
            clientName: record.clientName
          });
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load call record for editing: ' + err.message;
          this.isLoading = false;
          console.error('Error loading call record:', err);
          this.showErrorMessage('Erro ao carregar registro de chamada.');
        }
      })
    );
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.callRecordForm.invalid) {
      this.callRecordForm.markAllAsTouched();
      this.isLoading = false;
      this.showErrorMessage('Por favor, preencha todos os campos obrigatórios e corrija os erros de validação.');
      return;
    }

    const callRecord: CallRecord = this.callRecordForm.value;

    if (this.isEditMode && this.callRecordId) {
      this.subscriptions.add(this.callRecordService.updateCallRecord(this.callRecordId, callRecord)
        .subscribe({
          next: () => {
            this.showSuccessMessage('Registro de chamada atualizado com sucesso!');
            this.router.navigate(['/call-records']);
          },
          error: (err) => {
            this.errorMessage = 'Failed to update call record: ' + err.message;
            this.isLoading = false;
            console.error('Error updating call record:', err);
            this.showErrorMessage('Erro ao atualizar registro de chamada.');
          }
        })
      );
    } else {
      this.subscriptions.add(this.callRecordService.createCallRecord(callRecord)
        .subscribe({
          next: () => {
            this.showSuccessMessage('Registro de chamada adicionado com sucesso!');
            this.router.navigate(['/call-records']);
          },
          error: (err) => {
            this.errorMessage = 'Failed to add call record: ' + err.message;
            this.isLoading = false;
            console.error('Error adding call record:', err);
            this.showErrorMessage('Erro ao adicionar registro de chamada.');
          }
        })
      );
    }
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    // Example: this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    // Example: this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}