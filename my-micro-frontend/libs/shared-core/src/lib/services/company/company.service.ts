import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GET_ALL_COMPANY } from '../../constants/company/company-constant';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    constructor(private http: HttpClient) { }

    getAllCompany() {
        return this.http.get(GET_ALL_COMPANY);
    }
}
