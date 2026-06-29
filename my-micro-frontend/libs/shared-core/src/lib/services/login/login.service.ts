import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { FORGOT_PASSWORD_URL, LOGIN_URL, RESET_PASSWORD_URL, VERIFY_TOKEN_URL } from '../../constants/constants/login-api-urls.constant';

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
    forgotPassword(email: string) {
        const loginData = {
            email,
        };
        return this.http.post(FORGOT_PASSWORD_URL, loginData);
    }
    verifyToken(token: string) {
        return this.http.get(VERIFY_TOKEN_URL + `?token=${token}`);
    }
    resetPassword(token: string, newPassword: string) {
        const loginData = {
            token,
            newPassword
        };
        return this.http.post(RESET_PASSWORD_URL, loginData);
    }
}