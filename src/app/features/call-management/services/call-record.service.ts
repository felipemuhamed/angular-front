import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CallRecord } from '../../shared/models/call-record.model';
import { CallRecordCreateUpdateDto } from '../../shared/dtos/call-record-create-update.dto';

@Injectable({
  providedIn: 'root'
})
export class CallRecordService {
  private apiUrl = '/api/call-records'; // Adjust to your actual API endpoint

  constructor(private http: HttpClient) { }

  /**
   * Fetches a paginated list of call records, with optional search parameters.
   * @param page The current page number (0-indexed).
   * @param size The number of items per page.
   * @param searchTerm Optional search term for originNumber, destinationNumber, or operator.
   * @returns An observable of a paged list of CallRecord.
   */
  getAllCallRecords(
    page: number = 0,
    size: number = 10,
    searchTerm: string = ''
  ): Observable<{ content: CallRecord[]; totalElements: number; totalPages: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<{ content: CallRecord[]; totalElements: number; totalPages: number }>(this.apiUrl, { params });
  }

  /**
   * Fetches a single call record by its ID.
   * @param id The ID of the call record.
   * @returns An observable of the CallRecord.
   */
  getCallRecordById(id: number): Observable<CallRecord> {
    return this.http.get<CallRecord>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new call record.
   * @param callRecordDto The DTO containing the data for the new call record.
   * @returns An observable of the created CallRecord.
   */
  createCallRecord(callRecordDto: CallRecordCreateUpdateDto): Observable<CallRecord> {
    return this.http.post<CallRecord>(this.apiUrl, callRecordDto);
  }

  /**
   * Updates an existing call record.
   * @param id The ID of the call record to update.
   * @param callRecordDto The DTO containing the updated data.
   * @returns An observable of the updated CallRecord.
   */
  updateCallRecord(id: number, callRecordDto: CallRecordCreateUpdateDto): Observable<CallRecord> {
    return this.http.put<CallRecord>(`${this.apiUrl}/${id}`, callRecordDto);
  }

  /**
   * Deletes a call record by its ID.
   * @param id The ID of the call record to delete.
   * @returns An observable of the deletion response (e.g., empty object or success message).
   */
  deleteCallRecord(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
