import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../../constants/base/API';
import { GET_ALL_COST_GROUP, SAVE_OR_UPDATE_COST_GROUP } from '../../constants/expense-group/expense-group.constant';

@Injectable({
  providedIn: 'root'
})
export class ExpenseGroupService {

  constructor(private http: HttpClient) { }

  getAllCostGroup() {
    return this.http.get(GET_ALL_COST_GROUP);
  }

  saveOrUpdateCostGroup(model: any) {
    return this.http.post(`${SAVE_OR_UPDATE_COST_GROUP}`, model);
  }
}
