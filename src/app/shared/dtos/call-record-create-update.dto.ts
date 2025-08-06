import { CallStatus } from "../enums/call-status.enum";

export interface CallRecordCreateUpdateDto {
  originNumber: string; // Número de origem
  destinationNumber: string; // Número de destino
  callDateTime: string; // Data/hora da chamada (ISO 8601 string)
  duration: number; // Duração em segundos
  status: CallStatus; // Status da chamada
  // operator will likely be determined by the backend based on the authenticated user
  clientId?: number; // Opcional: ID do cliente associado
  contactId?: number; // Opcional: ID do contato associado
}
