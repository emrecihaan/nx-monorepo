import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { BASE_URL, GET_DF_FORM_BY_ID, SAVE_TR_FORM, GET_TR_FORM_BY_ID, SAVE_OR_UPDATE_UPLOADED_FILE, GET_REPORT_BY_FORM_ID, DELETE_TR_FORM, GET_USER_BUDGET_RULE, GET_USER_CONSUMPTION_AMOUNT, GET_DF_FORMFIELDS_BY_FIELDID, GET_ALL_DFFORM_BY_IS_BUGGET_CONTROL, GET_FORM_PARAMETER_VALUE_LIST_BY_DFFORMID, GET_ALL_FORM, GET_PARAMETER_TYPE_LIST, CREATE_PARAMETER_TYPE, UPDATE_PARAMETER_TYPE, DELETE_PARAMETER_TYPE, GET_FORM_PARAMETER_VALUE_LIST, CREATE_PARAMETER_VALUE, UPDATE_PARAMETER_VALUE, DELETE_PARAMETER_VALUE, GET_ALL_COST_TYPE, SAVE_OR_UPDATE_COST_TYPE, GET_ALL_USER_PROXY, SAVE_OR_UPDATE_USER_PROXY, GET_FORM_LIST_BY_DFFORMID, GET_FORM_LIST_BY_DFFORMID_AND_USERID, GET_ALL_DF_FORM, GET_USER_TRFORM_REPORT, GET_EXPENSE_REQUEST_FORMS, SEND_SAP, GET_ORGANIZATION_LIST_FOR_DROPDOWN, GET_ORGANIZATION_TRFORM_REPORT, SAVE_OR_UPDATE_COST_CENTER, GET_ALL_COST_CENTERS, GET_ALL_BUDGET_RULE, CREATE_BUDGET_RULE, UPDATE_BUDGET_RULE, DELETE_BUDGET_RULE, CREATE_BUDGET_RULE_OBJECT, UPDATE_BUDGET_RULE_OBJECT, DELETE_BUDGET_RULE_OBJECT, GET_BUDGET_RULE_OBJECT_BY_BUDGET_RULE_ID, COPY_FORM_APPROVE_RULES, GET_FORM_APPROVE_RULES, GET_DFFORM_APPROVERULE_DETAILS_BY_APPROVERULEID, CREATE_FORM_APPROVE_RULE_DETAIL, UPDATE_FORM_APPROVE_RULE_DETAIL, DELETE_FORM_APPROVE_RULE_DETAIL, CREATE_FORM_APPROVE_RULES, UPDATE_FORM_APPROVE_RULES, DELETE_FORM_APPROVE_RULES, GET_FORM_COUNT_BY_USERID, GET_FORM_LIST_BY_STATUS_ID_AND_USER_ID, SEND_APPROVE, APPROVE_FORM, GET_APPROVERS_COUNT_BY_STATUSID, GET_APPROVED_TRFORM_LIST_BY_APPROVERID_AND_STATUSID, GET_ORGANIZATION_LIST, GET_PEOPLE_LIST_BY_ORGANIZATIONID, GET_EMPLOYEE_BY_PERNR, UPDATE_EMPLOYEE_ASSIGNMENT, GET_TITLE_LIST, GET_POSITON_LIST, UPDATE_EMPLOYEE_POSITION, CREATE_EMPLOYEE_ASSIGNMENT, GET_ASSIGNMENT_USER_LINK, CREATE_EMPLOYEE_ASSIGNMENT_ENTITY, CREATE_ORG_RELATION_ENTITY, DELETE_ORG_RELATION_ENTITY, GET_EX_USER_LIST, GET_PEOPLE_LIST_BY_ORGANIZATION_ID, CREATE_TR_FORM_LINK, UPDATE_OR_REMOVE_TR_FORM_LINK, GET_REPORT_BY_FORM_LINK_TR_FORM_ID, GET_UNLINKED_FORMS_BY_FORM_ID } from '../../constants/form/form-urls.constant';




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

  getOrganizationListForDropdown() {
    return this.http.get(GET_ORGANIZATION_LIST_FOR_DROPDOWN);
  }

  getOrganizationTrFormReport(data: any) {
    return this.http.post(GET_ORGANIZATION_TRFORM_REPORT, data);
  }

  //Budget Rule CRUD Operations

  getAllDfBudgetRule() {
    return this.http.get(GET_ALL_BUDGET_RULE);
  }

  createDfBudgetRule(data: any) {
    return this.http.post(CREATE_BUDGET_RULE, data);
  }

  updateDfBudgetRule(data: any) {
    return this.http.post(UPDATE_BUDGET_RULE, data);
  }

  deleteDfBudgetRule(data: any) {
    return this.http.post(DELETE_BUDGET_RULE, data);
  }

  //Budget Rule Object CRUD Operations

  createDfBudgetRuleObject(data: any) {
    return this.http.post(CREATE_BUDGET_RULE_OBJECT, data);
  }

  updateDfBudgetRuleObject(data: any) {
    return this.http.post(UPDATE_BUDGET_RULE_OBJECT, data);
  }

  deleteDfBudgetRuleObject(data: any) {
    return this.http.post(DELETE_BUDGET_RULE_OBJECT, data);
  }

  getDfBudgetRuleObjectsByRuleId(ruleId: any) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("RuleId", ruleId);
    return this.http.get(GET_BUDGET_RULE_OBJECT_BY_BUDGET_RULE_ID, { params: queryParams });
  }

  copyDfFormApproveRule(data: any) {
    return this.http.post(COPY_FORM_APPROVE_RULES, data);
  }

  getFormApproveRulesAndDetailsByFormId(formId: number) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("formId", formId);
    return this.http.get(GET_FORM_APPROVE_RULES, { params: queryParams });
  }

  getDfFormApproveRuleDetailsByRuleId(approveRuleId: number) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("approveRuleId", approveRuleId);
    return this.http.get(GET_DFFORM_APPROVERULE_DETAILS_BY_APPROVERULEID, { params: queryParams });
  }

  createDfFormApproveRuleDetail(data: any) {
    return this.http.post(CREATE_FORM_APPROVE_RULE_DETAIL, data);
  }

  updateDfFormApproveRuleDetail(data: any) {
    return this.http.post(UPDATE_FORM_APPROVE_RULE_DETAIL, data);
  }

  deleteDfFormApproveRuleDetail(data: any) {
    return this.http.post(DELETE_FORM_APPROVE_RULE_DETAIL, data);
  }

  createDfFormApproveRule(data: any) {
    return this.http.post(CREATE_FORM_APPROVE_RULES, data);
  }

  updateDfFormApproveRule(data: any) {
    return this.http.post(UPDATE_FORM_APPROVE_RULES, data);
  }

  deleteDfFormApproveRule(data: any) {
    return this.http.post(DELETE_FORM_APPROVE_RULES, data);
  }
  getUserFormCount(userId: any) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("userId", userId);
    return this.http.get(GET_FORM_COUNT_BY_USERID, { params: queryParams });
  }
  getFormListWithStatusIdAndUserId(statusId: any, userId: any) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("statusId", statusId);
    queryParams = queryParams.append("userId", userId);
    return this.http.get(GET_FORM_LIST_BY_STATUS_ID_AND_USER_ID, { params: queryParams });
  }
  sendApprove(trFormIdDtoList: { id: number }[]) {
    return this.http.post(SEND_APPROVE, trFormIdDtoList);
  }

  approveForm(model: any) {
    return this.http.post(APPROVE_FORM, model);
  }

  getApproversCountByStatusId(approverId: any) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("approverId", approverId);
    return this.http.get(GET_APPROVERS_COUNT_BY_STATUSID, { params: queryParams });
  }

  getApprovedTrFormsByApproverIdAndStatusId(approverId: any, statusId: any) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("approverId", approverId);
    queryParams = queryParams.append("statusId", statusId);
    return this.http.get(GET_APPROVED_TRFORM_LIST_BY_APPROVERID_AND_STATUSID, { params: queryParams });
  }

  getOrganizationList() {
    return this.http.get(GET_ORGANIZATION_LIST);
  }

  getPeopleListByOrganizationId(objId: any) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("orgId", objId);
    return this.http.get(GET_PEOPLE_LIST_BY_ORGANIZATIONID, { params: queryParams });
  }

  getEmployeeDetails(pernr: any) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("pernr", pernr);
    return this.http.get(GET_EMPLOYEE_BY_PERNR, { params: queryParams });
  }

  updateEmployeeAssignment(employee: any) {
    return this.http.post(UPDATE_EMPLOYEE_ASSIGNMENT, employee);
  }

  getTitleList() {
    return this.http.get(GET_TITLE_LIST);
  }

  getPositionList() {
    return this.http.get(GET_POSITON_LIST);
  }

  addPersonToPosition(positionId: any, personelNo: any) {
    return this.http.post(UPDATE_EMPLOYEE_POSITION, { positionId: positionId, pernr: personelNo });
  }

  createAssignmentLink(data: any) {
    return this.http.post(CREATE_EMPLOYEE_ASSIGNMENT, data);
  }

  getAssignmentUserLink(assignmentId: any) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("assignmentId", assignmentId);
    return this.http.get(GET_ASSIGNMENT_USER_LINK, { params: queryParams });
  }

  createEmployeeAssignment(employee: any) {
    return this.http.post(CREATE_EMPLOYEE_ASSIGNMENT_ENTITY, employee);
  }

  createOrgEntity(organization: any) {
    return this.http.post(CREATE_ORG_RELATION_ENTITY, organization);
  }

  deleteOrgEntity(data: any) {
    return this.http.post(DELETE_ORG_RELATION_ENTITY, data);

  }

  exPersonList() {
    return this.http.get(GET_EX_USER_LIST);
  }

  getPersonListByOrgeh(orgeh: any) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("orgeh", orgeh);
    return this.http.get(GET_PEOPLE_LIST_BY_ORGANIZATION_ID, { params: queryParams });
  }

  createTrFormLink(data: any) {
    return this.http.post(CREATE_TR_FORM_LINK, data);
  }

  updateOrRemoveTrFormLink(data: any) {
    return this.http.post(UPDATE_OR_REMOVE_TR_FORM_LINK, data);
  }

  getReportByFormLinkTrFormId(trFormId: number) {
    var queryParams = new HttpParams();
    queryParams = queryParams.append("FormId", trFormId);
    return this.http.get(GET_REPORT_BY_FORM_LINK_TR_FORM_ID, { params: queryParams });
  }
  getUnlinkedFormsByFormId() {
    return this.http.get(GET_UNLINKED_FORMS_BY_FORM_ID);
  }

}