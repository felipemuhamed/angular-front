export interface Notification {
  id?: string;
  title: string;
  message: string;
  sentAt?: Date;
  status: NotificationStatus;
  targetAudience: TargetAudience | string[] | string;
  // For details view: specific users or profiles that received it
  recipients?: string[]; // e.g., list of user IDs or profile names
}

export enum NotificationStatus {
  SENT = 'enviado',
  PENDING = 'pendente',
  CANCELED = 'cancelado'
}

export enum TargetAudience {
  ALL = 'todos',
  PROFILES = 'perfis',
  SPECIFIC_USERS = 'usuários específicùs'
}
