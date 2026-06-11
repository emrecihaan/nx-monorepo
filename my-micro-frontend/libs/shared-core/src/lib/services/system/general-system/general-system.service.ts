import { Injectable } from '@angular/core';
import { GET_USER_REDIS, SAVE_SYSTEM_LANGUAGE_FOR_USER, GET_PROJECT_DETAIL_BY_ROLE_ID, GET_PAGE_CATEGORY_BY_USER_ID } from '../../../constants/constants/system-api-urls.constant';
import { HttpClient, HttpParams } from '@angular/common/http';

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

  getProjectDetailByRoleId(userId: any) {
    let params = new HttpParams().set('userId', userId.toString());
    return this.http.get(GET_PROJECT_DETAIL_BY_ROLE_ID, { params });
  }

  getPageCategoryByUserId(userId: any) {
    let params = new HttpParams().set('userId', userId.toString());
    return this.http.get(GET_PAGE_CATEGORY_BY_USER_ID, { params });
  }

}