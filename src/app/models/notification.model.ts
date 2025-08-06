export interface Notification {
  id?: number;
  title: string;
  message: string;
  sentAt: Date | string;
  status: 'enviado' | 'pendente' | 'cancelado';
  targetAudience: 'specific_users' | 'profiles' | 'all_users';
  recipients?: number[]; // Array of user/profile IDs depending on targetAudience
  recipientDetails?: { id: number, name: string, type: 'user' | 'profile' }[]; // For detail view
}

export interface PaginatedNotifications {
  notifications: Notification[];
  totalCount: number;
}