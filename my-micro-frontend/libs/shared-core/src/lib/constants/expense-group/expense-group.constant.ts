import { API } from "../base/API";

export const BASE_URL = API.baseRoute(API.apiType) + API.serviceRoute("dfCostGroup", API.apiType);
export const GET_ALL_COST_GROUP = `${BASE_URL}/GetAllCostGroup`;
export const SAVE_OR_UPDATE_COST_GROUP = `${BASE_URL}/SaveOrUpdateCostGroup`