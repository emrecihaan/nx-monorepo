import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';
import { GET_SUBPAGE_FOR_USER } from '../../../constants/constants/page-sub-api-urls.constant';

@Injectable({
    providedIn: 'root'
})
export class PageSubService {
    private http = inject(BaseHttpService);

    getPages(): Observable<any> {
        return this.http.get<any>(GET_SUBPAGE_FOR_USER);
    }
}