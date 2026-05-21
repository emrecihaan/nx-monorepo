import { API } from "../base/API";

export const BASE_URL = API.baseRoute(API.apiType) + API.serviceRoute("form", API.apiType);
export const GET_DF_FORM_BY_ID = `${BASE_URL}/getDfFormById`;
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