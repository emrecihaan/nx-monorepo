import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BaseHttpService {
    protected http = inject(HttpClient);

    constructor() { }

    get<T>(endpoint: string, params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }): Observable<T> {
        // All endpoints should now be absolute URLs from API.ts constants
        return this.http.get<T>(endpoint, { params }).pipe(
            catchError(this.handleError)
        );
    }

    post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
        // All endpoints should now be absolute URLs from API.ts constants
        return this.http.post<T>(endpoint, body, options).pipe(
            catchError(this.handleError)
        );
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        // All endpoints should now be absolute URLs from API.ts constants
        return this.http.put<T>(endpoint, body).pipe(
            catchError(this.handleError)
        );
    }

    delete<T>(endpoint: string): Observable<T> {
        // All endpoints should now be absolute URLs from API.ts constants
        return this.http.delete<T>(endpoint).pipe(
            catchError(this.handleError)
        );
    }

    protected handleError(error: HttpErrorResponse) {
        // Error is already handled by error.interceptor for global cases
        // Retrowing to allow component specific handling if needed
        return throwError(() => error);
    }
}
