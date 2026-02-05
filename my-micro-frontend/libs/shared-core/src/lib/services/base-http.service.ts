import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BaseHttpService {
    protected http = inject(HttpClient);

    // Example base URL - in a real app this might come from environment config
    protected apiUrl = '/api';

    constructor() { }

    get<T>(endpoint: string, params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params }).pipe(
            catchError(this.handleError)
        );
    }

    post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, options).pipe(
            catchError(this.handleError)
        );
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body).pipe(
            catchError(this.handleError)
        );
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}/${endpoint}`).pipe(
            catchError(this.handleError)
        );
    }

    protected handleError(error: HttpErrorResponse) {
        // Centralized error handling
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
