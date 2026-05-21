import { API } from "@my-micro-frontend/shared-core";

const BASE_URL = API.baseRoute(API.apiType) + API.serviceRoute("system", API.apiType);

export const GET_USER_BY_NAME = `${BASE_URL}/User/GetUserByName`;
export const GET_USERS = `${BASE_URL}/User/GetUsers`;
