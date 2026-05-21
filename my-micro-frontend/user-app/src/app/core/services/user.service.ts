import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@my-micro-frontend/shared-core';
import { GET_USER_BY_NAME, GET_USERS } from '../constants/system-api-urls.constant';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(BaseHttpService);
    getUserByName(name: string): Observable<any> {
        return this.http.get<any>(GET_USER_BY_NAME, { name });
    }
    getUsers(): Observable<any> {
        return this.http.get<any>(GET_USERS);
    }
}
