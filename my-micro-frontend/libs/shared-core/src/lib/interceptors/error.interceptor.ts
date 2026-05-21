import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred!';
            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                if (error.status === 401) {
                    return throwError(() => error); // Handled by auth.interceptor
                }
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
            console.error(errorMessage);
            // Here you could add a toast notification service call
            return throwError(() => error);
        })
    );
};
