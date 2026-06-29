import { API } from "../base/API";

const BASE_URL = API.baseRoute(API.apiType) + API.serviceRoute("login", API.apiType);

export const LOGIN_URL = `${BASE_URL}/Login`;
export const FORGOT_PASSWORD_URL = `${BASE_URL}/ForgotPassword`;
export const VERIFY_TOKEN_URL = `${BASE_URL}/VerifyToken`;
export const RESET_PASSWORD_URL = `${BASE_URL}/ResetPassword`;