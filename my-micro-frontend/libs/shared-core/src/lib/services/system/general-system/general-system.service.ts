import { Injectable } from '@angular/core';
import { GET_USER_REDIS, SAVE_SYSTEM_LANGUAGE_FOR_USER } from '../../../constants/constants/system-api-urls.constant';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneralSystemService {

  constructor(private http: HttpClient) { }

  getUserRedis() {
    return this.http.get(GET_USER_REDIS)
  }

  saveSystemLanguageForUser(model: any) {
    return this.http.post(SAVE_SYSTEM_LANGUAGE_FOR_USER, model)
  }

}