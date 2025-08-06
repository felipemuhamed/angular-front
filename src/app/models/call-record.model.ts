export interface CallRecord {
  id?: number;
  originNumber: string;
  destinationNumber: string;
  callDateTime: string; // ISO 8601 string for date and time
  duration: number; // Duration in seconds
  status: 'completed' | 'missed' | 'in_progress';
  operator: string; // Name of the responsible operator
  clientId?: number; // Optional: ID of the associated client
  clientName?: string; // Optional: Name of the associated client/contact
}

export interface CallRecordApiResponse {
  callRecords: CallRecord[];
  totalCount: number;
}