import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { BASE_URL, GET_DF_FORM_BY_ID, SAVE_TR_FORM, GET_TR_FORM_BY_ID, SAVE_OR_UPDATE_UPLOADED_FILE, GET_REPORT_BY_FORM_ID, DELETE_TR_FORM, GET_USER_BUDGET_RULE, GET_USER_CONSUMPTION_AMOUNT, GET_DF_FORMFIELDS_BY_FIELDID, GET_ALL_DFFORM_BY_IS_BUGGET_CONTROL, GET_FORM_PARAMETER_VALUE_LIST_BY_DFFORMID, GET_ALL_FORM, GET_PARAMETER_TYPE_LIST, CREATE_PARAMETER_TYPE, UPDATE_PARAMETER_TYPE, DELETE_PARAMETER_TYPE, GET_FORM_PARAMETER_VALUE_LIST, CREATE_PARAMETER_VALUE, UPDATE_PARAMETER_VALUE, DELETE_PARAMETER_VALUE, GET_ALL_COST_TYPE, SAVE_OR_UPDATE_COST_TYPE, GET_ALL_USER_PROXY, SAVE_OR_UPDATE_USER_PROXY, GET_FORM_LIST_BY_DFFORMID, GET_FORM_LIST_BY_DFFORMID_AND_USERID, SAVE_OR_UPDATE_COST_CENTER, GET_ALL_COST_CENTERS } from '../../constants/form/form-urls.constant';

import { BASE_URL, GET_DF_FORM_BY_ID, SAVE_TR_FORM, GET_TR_FORM_BY_ID, SAVE_OR_UPDATE_UPLOADED_FILE, GET_REPORT_BY_FORM_ID, DELETE_TR_FORM, GET_USER_BUDGET_RULE, GET_USER_CONSUMPTION_AMOUNT, GET_DF_FORMFIELDS_BY_FIELDID, GET_ALL_DFFORM_BY_IS_BUGGET_CONTROL, GET_FORM_PARAMETER_VALUE_LIST_BY_DFFORMID, GET_ALL_FORM, GET_PARAMETER_TYPE_LIST, CREATE_PARAMETER_TYPE, UPDATE_PARAMETER_TYPE, DELETE_PARAMETER_TYPE, GET_FORM_PARAMETER_VALUE_LIST, CREATE_PARAMETER_VALUE, UPDATE_PARAMETER_VALUE, DELETE_PARAMETER_VALUE, GET_ALL_COST_TYPE, SAVE_OR_UPDATE_COST_TYPE, GET_ALL_USER_PROXY, SAVE_OR_UPDATE_USER_PROXY, GET_FORM_LIST_BY_DFFORMID, GET_FORM_LIST_BY_DFFORMID_AND_USERID, GET_ALL_DF_FORM, GET_USER_TRFORM_REPORT, GET_EXPENSE_REQUEST_FORMS, SEND_SAP } from '../../constants/form/form-urls.constant';

import { GET_COST_RULE_LIST, CREATE_COST_RULE, UPDATE_COST_RULE, DELETE_COST_RULE, CREATE_COST_RULE_FILTER, UPDATE_COST_RULE_FILTER, DELETE_COST_RULE_FILTER, GET_COST_RULE_FILTER_DETAILS_BY_RULEFILTERID, GET_COST_RULE_OBJECTS_BY_RULEFILTERID, CREATE_COST_RULE_FILTER_DETAIL, UPDATE_COST_RULE_FILTER_DETAIL, DELETE_COST_RULE_FILTER_DETAIL, CREATE_COST_RULE_OBJECT, UPDATE_COST_RULE_OBJECT, DELETE_COST_RULE_OBJECT, GET_COST_RULE_FILTERS_BY_RULEID } from '../../constants/form/cost-url.constant';
@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) { }

  getAllForm() {
    return this.http.get<any>(GET_ALL_FORM);
  }

  getDfFormById(id: number) {
    let queryParams = new HttpParams().append("Id", id);
    return this.http.get<any>(GET_DF_FORM_BY_ID, { params: queryParams });
  }

  getDfFormFieldsByFieldId(id: number) {
    let queryParams = new HttpParams().append("Id", id);
    return this.http.get<any>(GET_DF_FORMFIELDS_BY_FIELDID, { params: queryParams });
  }

  saveTrForm(model: any) {
    return this.http.post<any>(SAVE_TR_FORM, model);
  }

  getTrFormById(id: number) {
    let queryParams = new HttpParams().append("Id", id);
    return this.http.get<any>(GET_TR_FORM_BY_ID, { params: queryParams });
  }

  saveOrUpdateUplaodedFile(uplaodedFile: any) {
    return this.http.post<any>(SAVE_OR_UPDATE_UPLOADED_FILE, uplaodedFile);
  }

  getReportByFormId(formId: number, date: any) {
    let queryParams = new HttpParams().append("FormId", formId).append("date", date);
    return this.http.get<any>(GET_REPORT_BY_FORM_ID, { params: queryParams });
  }

  deleteTrForm(model: any) {
    return this.http.post<any>(DELETE_TR_FORM, model);
  }

  getFieldDataByUrl(url: string) {
    return this.http.get<any>(`${BASE_URL}${url}`);
  }

  getFieldDataByUrlWithParams(url: string, queryParams: HttpParams) {
    return this.http.get<any>(`${BASE_URL}${url}`, { params: queryParams });
  }

  getUserBudgetRule(userId: number, formId: number) {
    let queryParams = new HttpParams().append("userId", userId).append("formId", formId);
    return this.http.get<any>(GET_USER_BUDGET_RULE, { params: queryParams });
  }

  getUserConsumptionAmount(userId: number, dfformId: number, statusId: number, startDate: any, endDate: any) {
    let queryParams = new HttpParams()
      .append("userId", userId)
      .append("dfformId", dfformId)
      .append("statusId", statusId)
      .append("startDate", startDate)
      .append("endDate", endDate);
    return this.http.get<any>(GET_USER_CONSUMPTION_AMOUNT, { params: queryParams });
  }

  getAllDfFormByIsBuggetControl() {
    return this.http.get<any>(GET_ALL_DFFORM_BY_IS_BUGGET_CONTROL);
  }

  getFormParameterValueListByDfFormId(formId: number, code: string) {
    let queryParams = new HttpParams().append("formId", formId).append("code", code);
    return this.http.get<any>(GET_FORM_PARAMETER_VALUE_LIST_BY_DFFORMID, { params: queryParams });
  }

  getCostRuleList() {
    return this.http.get<any>(GET_COST_RULE_LIST);
  }

  createCostRule(model: any) {
    return this.http.post<any>(CREATE_COST_RULE, model);
  }

  updateCostRule(model: any) {
    return this.http.post<any>(UPDATE_COST_RULE, model);
  }

  deleteCostRule(model: any) {
    return this.http.post<any>(DELETE_COST_RULE, model);
  }

  createCostRuleFilter(model: any) {
    return this.http.post<any>(CREATE_COST_RULE_FILTER, model);
  }

  updateCostRuleFilter(model: any) {
    return this.http.post<any>(UPDATE_COST_RULE_FILTER, model);
  }

  deleteCostRuleFilter(model: any) {
    return this.http.post<any>(DELETE_COST_RULE_FILTER, model);
  }

  getCostRuleFilterDetailsByRuleFilterId(ruleFilterId: number) {
    let queryParams = new HttpParams().append("ruleFilterId", ruleFilterId);
    return this.http.get<any>(GET_COST_RULE_FILTER_DETAILS_BY_RULEFILTERID, { params: queryParams });
  }

  getCostRuleObjectsByRuleFilterId(ruleFilterId: number) {
    let queryParams = new HttpParams().append("ruleFilterId", ruleFilterId);
    return this.http.get<any>(GET_COST_RULE_OBJECTS_BY_RULEFILTERID, { params: queryParams });
  }

  createCostRuleFilterDetail(model: any) {
    return this.http.post<any>(CREATE_COST_RULE_FILTER_DETAIL, model);
  }

  updateCostRuleFilterDetail(model: any) {
    return this.http.post<any>(UPDATE_COST_RULE_FILTER_DETAIL, model);
  }

  deleteCostRuleFilterDetail(model: any) {
    return this.http.post<any>(DELETE_COST_RULE_FILTER_DETAIL, model);
  }

  createCostRuleObject(model: any) {
    return this.http.post<any>(CREATE_COST_RULE_OBJECT, model);
  }

  updateCostRuleObject(model: any) {
    return this.http.post<any>(UPDATE_COST_RULE_OBJECT, model);
  }

  deleteCostRuleObject(model: any) {
    return this.http.post<any>(DELETE_COST_RULE_OBJECT, model);
  }

  getCostRuleFilterByCostRuleId(costRuleId: number) {
    let queryParams = new HttpParams().append("ruleId", costRuleId);
    return this.http.get<any>(GET_COST_RULE_FILTERS_BY_RULEID, { params: queryParams });
  }

  getParameterTypeList() {
    return this.http.get<any>(GET_PARAMETER_TYPE_LIST);
  }

  createParameterType(data: any) {
    return this.http.post<any>(CREATE_PARAMETER_TYPE, data);
  }

  updateParameterType(data: any) {
    return this.http.post<any>(UPDATE_PARAMETER_TYPE, data);
  }

  deleteParameterType(data: any) {
    return this.http.post<any>(DELETE_PARAMETER_TYPE, data);
  }

  getParameterValueList(Id: any) {
    let queryParams = new HttpParams().append("Id", Id);
    return this.http.get<any>(GET_FORM_PARAMETER_VALUE_LIST, { params: queryParams });
  }


  createParameterValue(data: any) {
    return this.http.post<any>(CREATE_PARAMETER_VALUE, data);
  }

  updateParameterValue(data: any) {
    return this.http.post<any>(UPDATE_PARAMETER_VALUE, data);
  }

  deleteParameterValue(data: any) {
    return this.http.post<any>(DELETE_PARAMETER_VALUE, data);
  }

  getAllCostType() {
    return this.http.get<any>(GET_ALL_COST_TYPE);
  }

  saveOrUpdateCostType(data: any) {
    return this.http.post<any>(SAVE_OR_UPDATE_COST_TYPE, data);
  }

  getAllUserProxy() {
    return this.http.get<any>(GET_ALL_USER_PROXY);
  }

  saveOrUpdateUserProxy(model: any) {
    return this.http.post<any>(SAVE_OR_UPDATE_USER_PROXY, model);
  }

  getFormListByDfFormId(formId: number) {
    let queryParams = new HttpParams().append("Id", formId);
    return this.http.get<any>(GET_FORM_LIST_BY_DFFORMID, { params: queryParams });
  }

  getFormListByDfFormIdAndUserId(formId: number, userId: number) {
    let queryParams = new HttpParams().append("formId", formId).append("userId", userId);
    return this.http.get<any>(GET_FORM_LIST_BY_DFFORMID_AND_USERID, { params: queryParams });
  }
  getAllCostCenter() {
    return this.http.get<any>(GET_ALL_COST_CENTERS);
  }

  saveOrUpdateCostCenter(model: any) {
    return this.http.post<any>(SAVE_OR_UPDATE_COST_CENTER, model);
  }
  getAllDfForm() {
    return this.http.get(GET_ALL_DF_FORM);
  }

  getUserTrFormReport(data: any) {
    return this.http.post(GET_USER_TRFORM_REPORT, data);
  }

  getExpenseRequestForms(filters: any) {
    return this.http.post(GET_EXPENSE_REQUEST_FORMS, filters);
  }

  createExpenseRequestSAP(data: any) {
    return this.http.post(SEND_SAP, data);
  }
}
