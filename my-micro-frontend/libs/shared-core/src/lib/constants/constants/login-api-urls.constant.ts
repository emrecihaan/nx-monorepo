import { API } from "../base/API";

const BASE_URL = API.baseRoute(API.apiType) + API.serviceRoute("login", API.apiType);

export const LOGIN_URL = `${BASE_URL}/Login`;
