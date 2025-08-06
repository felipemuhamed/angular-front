import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chamada, CallStatus } from '../core/models/chamada.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChamadaService {
  private apiUrl = `${environment.apiUrl}/chamadas`; // Adjust API endpoint as needed

  constructor(private http: HttpClient) { }

  /**
   * Retrieves a paginated and searchable list of call records.
   * @param page The current page number (1-indexed).
   * @param pageSize The number of items per page.
   * @param searchTerm The search term for origin number, destination number, or operator.
   * @returns An observable of an object containing calls and total count.
   */
  getChamadas(page: number, pageSize: number, searchTerm: string = ''): Observable<{ chamadas: Chamada[], totalCount: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<{ chamadas: Chamada[], totalCount: number }>(this.apiUrl, { params });
  }

  /**
   * Retrieves a single call record by its ID.
   * @param id The ID of the call record.
   * @returns An observable of the Chamada object.
   */
  getChamadaById(id: number): Observable<Chamada> {
    return this.http.get<Chamada>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new call record.
   * @param chamada The Chamada object to create.
   * @returns An observable of the created Chamada object.
   */
  createChamada(chamada: Chamada): Observable<Chamada> {
    return this.http.post<Chamada>(this.apiUrl, chamada);
  }

  /**
   * Updates an existing call record.
   * @param id The ID of the call record to update.
   * @param chamada The updated Chamada object.
   * @returns An observable of the updated Chamada object.
   */
  updateChamada(id: number, chamada: Chamada): Observable<Chamada> {
    return this.http.put<Chamada>(`${this.apiUrl}/${id}`, chamada);
  }

  /**
   * Deletes a call record by its ID.
   * @param id The ID of the call record to delete.
   * @returns An observable of the deletion response.
   */
  deleteChamada(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Retrieves a list of available call statuses.
   * @returns An array of CallStatus enum values.
   */
  getCallStatuses(): CallStatus[] {
    return Object.values(CallStatus);
  }

  // Dummy method for fetching clients/contacts, assuming a separate ClientService exists
  // In a real application, this would fetch from a ClientService
  getAvailableClients(): Observable<{ id: number; nome: string }[]> {
    // Simulate API call for clients
    return new Observable(observer => {
      setTimeout(() => {
        observer.next([
          { id: 1, nome: 'Cliente A' },
          { id: 2, nome: 'Cliente B' },
          { id: 3, nome: 'Cliente C' }
        ]);
        observer.complete();
      }, 500);
    });
  }
}