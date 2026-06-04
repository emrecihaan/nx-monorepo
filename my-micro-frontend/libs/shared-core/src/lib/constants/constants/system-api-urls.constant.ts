import { API } from "../base/API";

const BASE_URL = API.baseRoute(API.apiType) + API.serviceRoute("system", API.apiType);

export const GET_USER_BY_NAME = `${BASE_URL}/User/GetUserByName`;
export const GET_USERS = `${BASE_URL}/User/GetUsers`;
export const GET_USER_REDIS = `${BASE_URL}/User/GetRedisUserId`;
export const GET_ROLE_BY_USER_ID = `${BASE_URL}/Role/GetRoleByUserId`;
export const SAVE_SYSTEM_LANGUAGE_FOR_USER = `${BASE_URL}/User/SaveSystemLanguageForUser`;