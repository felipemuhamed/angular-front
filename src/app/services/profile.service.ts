import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Profile } from '../models/profile.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profiles`; // Assuming a /profiles endpoint

  constructor(private http: HttpClient) { }

  /**
   * Retrieves a paginated and searchable list of profiles.
   * @param page The current page number (1-indexed).
   * @param pageSize The number of items per page.
   * @param searchTerm The search term for name or description.
   * @returns An observable of an object containing profiles and total count.
   */
  getProfiles(page: number, pageSize: number, searchTerm: string): Observable<{ profiles: Profile[], totalCount: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('searchTerm', searchTerm);

    return this.http.get<Profile[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map(response => {
        const totalCount = Number(response.headers.get('X-Total-Count')) || 0; // Backend should send X-Total-Count header
        return { profiles: response.body || [], totalCount };
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single profile by its ID.
   * @param id The ID of the profile.
   * @returns An observable of the Profile object.
   */
  getProfileById(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new profile.
   * @param profile The profile object to create.
   * @returns An observable of the created Profile object.
   */
  createProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(this.apiUrl, profile).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing profile.
   * @param id The ID of the profile to update.
   * @param profile The updated profile object.
   * @returns An observable of the updated Profile object.
   */
  updateProfile(id: number, profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${id}`, profile).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a profile by its ID.
   * @param id The ID of the profile to delete.
   * @returns An observable of the deletion response.
   */
  deleteProfile(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
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
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error; // Backend might send a plain error message
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    // Propagate the error message for component to display
    return throwError(() => new Error(errorMessage));
  }
}