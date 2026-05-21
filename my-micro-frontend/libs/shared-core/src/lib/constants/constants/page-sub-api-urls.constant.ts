import { API } from "../base/API";

const BASE_URL = API.baseRoute(API.apiType) + API.serviceRoute("pageSub", API.apiType);

export const GET_ALL_SUB_PAGES = `${BASE_URL}/GetAllSubPages`;
export const CREATE_SUB_PAGES = `${BASE_URL}/CreatePageSub`;
export const DELETE_SUB_PAGE = `${BASE_URL}/DeleteSubPageById`;
export const GET_SUB_PAGES_BY_PAGE_ID = `${BASE_URL}/GetSubPagesByPageId`;
export const GET_ALL_SUB_PAGES_WITH_CATEGORY = `${BASE_URL}/GetAllSubPagesWithCategory`;
export const GET_SUBPAGE_FOR_USER = `${BASE_URL}/GetSubPageForUser`;