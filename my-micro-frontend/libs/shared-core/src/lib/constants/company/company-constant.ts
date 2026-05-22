import { API } from "../base/API";

export const BASE_URL = API.baseRoute(API.apiType) + API.serviceRoute("company", API.apiType);
export const GET_ALL_COMPANY = `${BASE_URL}/GetAllCompany`;