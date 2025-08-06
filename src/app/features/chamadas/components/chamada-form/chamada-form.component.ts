import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChamadaService } from '../../../../services/chamada.service';
import { Chamada, CallStatus } from '../../../../core/models/chamada.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chamada-form',
  templateUrl: './chamada-form.component.html',
  styleUrls: ['./chamada-form.component.css']
})
export class ChamadaFormComponent implements OnInit {

  chamadaForm!: FormGroup;
  isEditMode = false;
  chamadaId: number | null = null;
  callStatuses: CallStatus[] = [];
  availableClients: { id: number; nome: string }[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private chamadaService: ChamadaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.callStatuses = this.chamadaService.getCallStatuses();
    this.loadClients();

    this.chamadaForm = this.fb.group({
      id: [null],
      numeroOrigem: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]], // E.164 format regex
      numeroDestino: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      dataHoraChamada: ['', Validators.required],
      duracao: [0, [Validators.required, Validators.min(0)]],
      statusChamada: ['', Validators.required],
      operadorResponsavel: ['', Validators.required],
      clienteId: [null] // Optional, can be null
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.chamadaId = +id;
        this.loadChamada(this.chamadaId);
      }
    });
  }

  loadChamada(id: number): void {
    this.isLoading = true;
    this.chamadaService.getChamadaById(id).subscribe({
      next: (chamada) => {
        this.chamadaForm.patchValue({
          id: chamada.id,
          numeroOrigem: chamada.numeroOrigem,
          numeroDestino: chamada.numeroDestino,
          dataHoraChamada: chamada.dataHoraChamada, // Assuming API returns compatible date string
          duracao: chamada.duracao,
          statusChamada: chamada.statusChamada,
          operadorResponsavel: chamada.operadorResponsavel,
          clienteId: chamada.clienteId
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar chamada:', error);
        this.showSnackBar('Erro ao carregar chamada.', 'error');
        this.isLoading = false;
        this.router.navigate(['/chamadas']);
      }
    });
  }

  loadClients(): void {
    this.chamadaService.getAvailableClients().subscribe({
      next: (clients) => {
        this.availableClients = clients;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.showSnackBar('Erro ao carregar lista de clientes.', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.chamadaForm.invalid) {
      this.chamadaForm.markAllAsTouched();
      this.showSnackBar('Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
      return;
    }

    this.isLoading = true;
    const chamada: Chamada = this.chamadaForm.value;

    // Handle date formatting if necessary, e.g., to ISO string for backend
    // if (chamada.dataHoraChamada instanceof Date) {
    //   chamada.dataHoraChamada = chamada.dataHoraChamada.toISOString();
    // }

    let operation: Observable<Chamada>;

    if (this.isEditMode && this.chamadaId) {
      operation = this.chamadaService.updateChamada(this.chamadaId, chamada);
    } else {
      operation = this.chamadaService.createChamada(chamada);
    }

    operation.subscribe({
      next: () => {
        this.showSnackBar(`Chamada ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso!`, 'success');
        this.isLoading = false;
        this.router.navigate(['/chamadas']);
      },
      error: (error) => {
        console.error('Erro ao salvar chamada:', error);
        this.showSnackBar(`Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} chamada.`, 'error');
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/chamadas']);
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }
}