export interface Profile {
  id?: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  keycloakRoles?: string[]; // For Requisito 9: association with Keycloak roles
}