/**
 * @description Represents the status of a user.
 */
export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

/**
 * @description Represents a user role.
 * (Example roles, adjust as per backend definitions)
 */
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Manager = 'manager',
}

/**
 * @description Interface representing a user object as received from the API
 * or displayed in the UI. Corresponds to Requisito 1.
 */
export interface User {
  id: number; // Unique identifier for the user
  name: string; // User's full name
  email: string; // User's email address
  role: UserRole; // User's role in the system
  status: UserStatus; // User's active/inactive status
}

/**
 * @description Interface representing the payload for creating a new user.
 * Corresponds to Requisito 2.
 */
export interface UserCreatePayload {
  name: string; // User's full name (required)
  email: string; // User's email address (required, must be unique)
  password: string; // User's password (required, masked in UI per Requisito 9)
  role: UserRole; // User's role (required)
  status: UserStatus; // Initial status of the user (required)
}

/**
 * @description Interface representing the payload for updating an existing user.
 * Corresponds to Requisito 3.
 */
export interface UserUpdatePayload {
  name: string; // User's full name
  email: string; // User's email address
  password?: string; // Optional: Only send if the password needs to be changed (Requisito 9)
  role: UserRole; // User's role
  status: UserStatus; // User's active/inactive status
}

/**
 * @description Interface for user search criteria.
 * Corresponds to Requisito 5.
 */
export interface UserSearchCriteria {
  query?: string; // Search term (can be part of name or email)
}

/**
 * @description Interface for pagination metadata, typically received from APIs.
 * Corresponds to Requisito 6.
 */
export interface Pagination {
  totalItems: number; // Total number of items available
  currentPage: number; // Current page number (1-indexed)
  pageSize: number; // Number of items per page
  totalPages: number; // Total number of pages
}

/**
 * @description Generic interface for an API response that includes a list of items and pagination.
 * Useful for Requisito 6.
 */
export interface PaginatedResponse<T> {
  data: T[]; // Array of items for the current page
  pagination: Pagination; // Pagination metadata
}