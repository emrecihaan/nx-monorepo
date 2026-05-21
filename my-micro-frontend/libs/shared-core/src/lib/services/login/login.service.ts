import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { LOGIN_URL } from '../../constants/constants/login-api-urls.constant';

export interface LoginResponse {
    code: string;
    message?: string;
    response?: string;  // The actual JWT token
    token?: string;
    refreshToken?: string;
    expiresIn?: number;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private http = inject(BaseHttpService);
    login(username: string, password: string, type: number): Observable<LoginResponse> {
        const loginData = {
            username,
            password,
            type
        };
        return this.http.post<LoginResponse>(LOGIN_URL, loginData);
    }
}