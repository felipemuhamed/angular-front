export enum CallStatus {
  COMPLETED = 'Concluída',
  MISSED = 'Perdida',
  IN_PROGRESS = 'Em Andamento'
}

export interface Chamada {
  id?: number;
  numeroOrigem: string;
  numeroDestino: string;
  dataHoraChamada: string;
  duracao: number; // Duration in seconds, for example
  statusChamada: CallStatus;
  operadorResponsavel: string;
  clienteId?: number; // Optional: ID to associate with a client/contact
  clienteNome?: string; // Optional: For display purposes, if client data is denormalized or fetched
}