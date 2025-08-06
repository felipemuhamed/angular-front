import { CallStatus } from "../enums/call-status.enum";

export interface CallRecord {
  id: number; // ID da chamada
  originNumber: string; // Número de origem
  destinationNumber: string; // Número de destino
  callDateTime: string; // Data/hora da chamada (ISO 8601 string)
  duration: number; // Duração em segundos
  status: CallStatus; // Status da chamada (concluída, perdida, em andamento)
  operator: string; // Operador responsável
  clientId?: number; // Opcional: ID do cliente associado
  contactId?: number; // Opcional: ID do contato associado
}
