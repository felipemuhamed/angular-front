import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CallRecord, CallRecordApiResponse } from '../models/call-record.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CallRecordService {
  private apiUrl = `${environment.apiUrl}/call-records`; // Adjust based on your backend API

  constructor(private http: HttpClient) { }

  /**
   * Retrieves a paginated and searchable list of call records.
   * @param page The current page number (1-indexed).
   * @param pageSize The number of items per page.
   * @param searchTerm The search term for originNumber, destinationNumber, or operator.
   * @returns An observable of an object containing call records and total count.
   */
  getCallRecords(page: number, pageSize: number, searchTerm: string = ''): Observable<CallRecordApiResponse> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', pageSize.toString());

    if (searchTerm) {
      // Assuming backend supports full-text search or specific field search
      // For example, JSON-server allows q parameter for full-text search
      // For specific fields, you might need to adjust based on your API.
      params = params.set('q', searchTerm);
    }

    // The backend should return 'X-Total-Count' header for pagination
    return this.http.get<CallRecord[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map(response => {
        const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
        return { callRecords: response.body || [], totalCount };
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single call record by its ID.
   * @param id The ID of the call record.
   * @returns An observable of the CallRecord object.
   */
  getCallRecordById(id: number): Observable<CallRecord> {
    return this.http.get<CallRecord>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new call record.
   * @param callRecord The call record object to create.
   * @returns An observable of the created CallRecord object.
   */
  createCallRecord(callRecord: CallRecord): Observable<CallRecord> {
    return this.http.post<CallRecord>(this.apiUrl, callRecord).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing call record.
   * @param id The ID of the call record to update.
   * @param callRecord The updated call record object.
   * @returns An observable of the updated CallRecord object.
   */
  updateCallRecord(id: number, callRecord: CallRecord): Observable<CallRecord> {
    return this.http.put<CallRecord>(`${this.apiUrl}/${id}`, callRecord).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a call record by its ID.
   * @param id The ID of the call record to delete.
   * @returns An observable of the deletion response.
   */
  deleteCallRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handles HTTP errors.
   * @param error The error response from the HTTP request.
   * @returns An observable that throws an error.
   */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
      } else if (error.statusText) {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.statusText}`;
      }
    }
    // You can also integrate a global error handling service or toast messages here
    return throwError(() => new Error(errorMessage));
  }
}