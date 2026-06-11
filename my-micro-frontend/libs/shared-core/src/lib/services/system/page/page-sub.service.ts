import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';
import { GET_SUBPAGE_FOR_USER, GET_SUB_PAGES_BY_PROJECT_ID, GET_SUB_PAGES_BY_PAGE_CATEGORY_ID } from '../../../constants/constants/page-sub-api-urls.constant';

@Injectable({
    providedIn: 'root'
})
export class PageSubService {
    private http = inject(BaseHttpService);

    getPages(): Observable<any> {
        return this.http.get<any>(GET_SUBPAGE_FOR_USER);
    }

    getSubPagesByProjectId(projectId: string): Observable<any> {
        return this.http.get<any>(`${GET_SUB_PAGES_BY_PROJECT_ID}?projectId=${projectId}`);
    }

    getSubPagesByPageCategoryId(pageCategoryId: string): Observable<any> {
        return this.http.get<any>(`${GET_SUB_PAGES_BY_PAGE_CATEGORY_ID}?pageCategoryId=${pageCategoryId}`);
    }
}