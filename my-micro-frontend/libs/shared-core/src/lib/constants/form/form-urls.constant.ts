import { API } from "../base/API";

export const BASE_URL = API.baseRoute(API.apiType) + API.serviceRoute("form", API.apiType);
export const GET_DF_FORM_BY_ID = `${BASE_URL}/DfForm/getDfFormById`;
export const GET_DF_FORMFIELDS_BY_FIELDID = `${BASE_URL}/DfFormFields/getDfFormFieldsByFieldId`;
export const SAVE_TR_FORM = `${BASE_URL}/TrForm/saveTrForm`;
export const GET_TR_FORM_BY_ID = `${BASE_URL}/TrForm/getTrFormById`;
export const SAVE_OR_UPDATE_UPLOADED_FILE = `${BASE_URL}/TrForm/saveOrUpdateUploadedFile`;
export const GET_REPORT_BY_FORM_ID = `${BASE_URL}/TrForm/getReportByFormId`;
export const DELETE_TR_FORM = `${BASE_URL}/TrForm/deleteForm`;

export const GET_USER_BUDGET_RULE = `${BASE_URL}/TrForm/GetUserBudgetRule`;

export const GET_USER_CONSUMPTION_AMOUNT = `${BASE_URL}/TrForm/GetUserConsumptionAmount`;

export const GET_ALL_DFFORM_BY_IS_BUGGET_CONTROL = `${BASE_URL}/DfForm/getAllDfFormByIsBudgetControl`;

export const GET_FORM_PARAMETER_VALUE_LIST_BY_DFFORMID = `${BASE_URL}/DfFormParameterValue/getFormParameterValueListByDfFormId`;

export const GET_ALL_FORM = `${BASE_URL}/DfForm/getAllDfForm`;

//Parameter Type
export const GET_PARAMETER_TYPE_LIST = `${BASE_URL}/DfFormParameterType/getFormParameterTypeList`;

export const CREATE_PARAMETER_TYPE = `${BASE_URL}/DfFormParameterType/CreateDfFormParameterType`;

export const UPDATE_PARAMETER_TYPE = `${BASE_URL}/DfFormParameterType/UpdateDfFormParameterType`;

export const DELETE_PARAMETER_TYPE = `${BASE_URL}/DfFormParameterType/DeleteDfFormParameterType`;

export const GET_FORM_PARAMETER_VALUE_LIST = `${BASE_URL}/DfFormParameterValue/GetFormParameterValueListByTypeId`;

export const CREATE_PARAMETER_VALUE = `${BASE_URL}/DfFormParameterValue/CreateDfFormParameterValue`;

export const UPDATE_PARAMETER_VALUE = `${BASE_URL}/DfFormParameterValue/UpdateDfFormParameterValue`;

export const DELETE_PARAMETER_VALUE = `${BASE_URL}/DfFormParameterValue/DeleteDfFormParameterValue`;

//Expense Type
export const GET_ALL_COST_TYPE = `${BASE_URL}/DfCostType/getDfCostTypes`;

export const SAVE_OR_UPDATE_COST_TYPE = `${BASE_URL}/DfCostType/SaveOrUpdateCostType`

//User Proxy
export const GET_ALL_USER_PROXY = `${BASE_URL}/DfUserProxy/getAllDfUserProxy`;

export const SAVE_OR_UPDATE_USER_PROXY = `${BASE_URL}/DfUserProxy/SaveOrUpdateUserProxy`;

export const GET_FORM_LIST_BY_DFFORMID = `${BASE_URL}/TrForm/getFormListByDfFormId`;

export const GET_FORM_LIST_BY_DFFORMID_AND_USERID = `${BASE_URL}/TrForm/getFormListByDfFormIdAndUserId`;

export const GET_ALL_COST_CENTERS = `${BASE_URL}/DfCostCenter/getAllDfCostCenters`;

export const SAVE_OR_UPDATE_COST_CENTER = `${BASE_URL}/DfCostCenter/SaveOrUpdateCostCenter`;
export const GET_ALL_DF_FORM = `${BASE_URL}/DfForm/getAllDfForm`;

export const GET_USER_TRFORM_REPORT = `${BASE_URL}/TrForm/GetUserTrFormReport`;

export const GET_EXPENSE_REQUEST_FORMS = `${BASE_URL}/TrForm/GetExpenseRequestForms`;


export const SEND_SAP = `${BASE_URL}/TrForm/sendSAP`;

export const GET_FORM_COUNT_BY_USERID = `${BASE_URL}/TrForm/getFormCountByUserId`;
export const GET_FORM_LIST_BY_STATUS_ID_AND_USER_ID = `${BASE_URL}/TrForm/getFormListByStatusIdAndUserId`;
export const SEND_APPROVE = `${BASE_URL}/TrForm/sendApprove`;

export const GET_ORGANIZATION_LIST_FOR_DROPDOWN = `${BASE_URL}/TrForm/getOrganizationListForDropdown`;

export const GET_ORGANIZATION_TRFORM_REPORT = `${BASE_URL}/TrForm/GetOrganizationTrFormReport`;

//DfBudgetRule 
export const CREATE_BUDGET_RULE = `${BASE_URL}/DfBudgetRule/CreateDfBudgetRule`;

export const UPDATE_BUDGET_RULE = `${BASE_URL}/DfBudgetRule/UpdateDfBudgetRule`;

export const DELETE_BUDGET_RULE = `${BASE_URL}/DfBudgetRule/DeleteDfBudgetRule`;

export const GET_ALL_BUDGET_RULE = `${BASE_URL}/DfBudgetRule/getAllDfBudgetRule`;

//DfBudgetRuleObject
export const CREATE_BUDGET_RULE_OBJECT = `${BASE_URL}/DfBudgetRuleObject/CreateDfBudgetRuleObject`;

export const UPDATE_BUDGET_RULE_OBJECT = `${BASE_URL}/DfBudgetRuleObject/UpdateDfBudgetRuleObject`;

export const DELETE_BUDGET_RULE_OBJECT = `${BASE_URL}/DfBudgetRuleObject/DeleteDfBudgetRuleObject`;

export const GET_BUDGET_RULE_OBJECT_BY_BUDGET_RULE_ID = `${BASE_URL}/DfBudgetRuleObject/GetDfBudgetRuleObjectsByRuleId`;


//DfFormApproveRules
export const COPY_FORM_APPROVE_RULES = `${BASE_URL}/DfFormApproveRules/CopyDfFormApproveRule`;

export const GET_FORM_APPROVE_RULES = `${BASE_URL}/DfFormApproveRules/GetDfFormApproveRulesAndDetailsByFormId`;

export const GET_DFFORM_APPROVERULE_DETAILS_BY_APPROVERULEID = `${BASE_URL}/DfFormApproveRules/GetDfFormApproveRuleDetailsByApproveRuleId`;

export const CREATE_FORM_APPROVE_RULE_DETAIL = `${BASE_URL}/DfFormApproveRules/CreateRuleDetail`;

export const UPDATE_FORM_APPROVE_RULE_DETAIL = `${BASE_URL}/DfFormApproveRules/UpdateRuleDetail`;

export const DELETE_FORM_APPROVE_RULE_DETAIL = `${BASE_URL}/DfFormApproveRules/DeleteRuleDetail`;

export const CREATE_FORM_APPROVE_RULES = `${BASE_URL}/DfFormApproveRules/CreateRule`;

export const UPDATE_FORM_APPROVE_RULES = `${BASE_URL}/DfFormApproveRules/UpdateRule`;

export const DELETE_FORM_APPROVE_RULES = `${BASE_URL}/DfFormApproveRules/DeleteRule`;

export const APPROVE_FORM = `${BASE_URL}/TrFormApprover/ApproveForm`;

export const GET_APPROVERS_COUNT_BY_STATUSID = `${BASE_URL}/TrFormApprover/getApproversCountByStatusId`;

export const GET_APPROVED_TRFORM_LIST_BY_APPROVERID_AND_STATUSID = `${BASE_URL}/TrForm/getApprovedTrFormsByApproverIdAndStatusId`;

export const GET_ORGANIZATION_LIST = `${BASE_URL}/TrForm/getOrganizationList`;

export const GET_PEOPLE_LIST_BY_ORGANIZATIONID = `${BASE_URL}/TrForm/getPeopleListByOrganizationId`;

export const GET_EMPLOYEE_BY_PERNR = `${BASE_URL}/TrForm/getPersonByPERNR`;

export const UPDATE_EMPLOYEE_ASSIGNMENT = `${BASE_URL}/TrForm/UpdateEmployeeAssignment`;

export const GET_TITLE_LIST = `${BASE_URL}/TrForm/getTitleList`;

export const GET_POSITON_LIST = `${BASE_URL}/TrForm/getPositionList`;

export const UPDATE_EMPLOYEE_POSITION = `${BASE_URL}/TrForm/AddPersonToPosition`;

export const GET_ASSIGNMENT_USER_LINK = `${BASE_URL}/TrForm/GetEmployeeAssignment`;

export const CREATE_EMPLOYEE_ASSIGNMENT = `${BASE_URL}/TrForm/CreateEmployeeAssignment`;

export const CREATE_EMPLOYEE_ASSIGNMENT_ENTITY = `${BASE_URL}/TrForm/CreateEmployeeAssignmentEntity`;

export const GET_EX_USER_LIST = `${BASE_URL}/TrForm/getExPeopleList`;

export const CREATE_ORG_RELATION_ENTITY = `${BASE_URL}/TrForm/CreateOrgEntity`;

export const DELETE_ORG_RELATION_ENTITY = `${BASE_URL}/TrForm/DeleteOrgEntity`;

export const GET_PEOPLE_LIST_BY_ORGANIZATION_ID = `${BASE_URL}/TrForm/getPeopleListByOrgeh`;

export const CREATE_TR_FORM_LINK = `${BASE_URL}/TrForm/CreateTrFormLink`;

export const UPDATE_OR_REMOVE_TR_FORM_LINK = `${BASE_URL}/TrForm/UpdateOrRemoveTrFormLink`;