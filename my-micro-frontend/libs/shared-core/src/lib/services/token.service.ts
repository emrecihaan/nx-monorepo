import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private readonly TOKEN_KEY = 'auth-token';

    constructor() { }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setToken(token: string): void {
        debugger;
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getDecodedToken(): any {
        const token = this.getToken();
        if (token) {
            try {
                return JSON.parse(atob(token.split('.')[1]));
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    getRoleId(): number {
        const decoded = this.getDecodedToken();
        console.log("decoded ", decoded)
        if (decoded) {
            // Check common role claim names
            const roleId = decoded.roleId || decoded.RoleId || decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (roleId) {
                return Number(roleId);
            }
        }
        return 1; // Default fallback
    }

    getUserId(): number | string | null {
        const decoded = this.getDecodedToken();
        if (decoded) {
            // Check common user ID claim names
            const userId = decoded.userId || decoded.UserId || decoded.sub || decoded.id || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            if (userId) {
                return userId;
            }
        }
        return null;
    }
}
