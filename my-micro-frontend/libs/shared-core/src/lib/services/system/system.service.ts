import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { GET_ROLE_BY_USER_ID, GET_USER_BY_NAME, GET_USER_REDIS, GET_USERS } from '../../constants/constants/system-api-urls.constant';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private http = inject(BaseHttpService);

  getUserByName(name: string): Observable<any> {
    return this.http.get<any>(GET_USER_BY_NAME, { name });
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(GET_USERS);
  }

  getUserRedis(): Observable<any> {
    return this.http.get<any>(GET_USER_REDIS);
  }

  getRoleByUserId(userId: any) {
    return this.http.get<any>(GET_ROLE_BY_USER_ID, { userId })
  }
}
