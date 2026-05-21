import { API } from "../base/API";

export const BASE_URL = API.baseRoute(API.apiType) + API.serviceRoute("cost", API.apiType);

export const GET_COST_RULE_LIST = `${BASE_URL}/GetCostRules`;
export const CREATE_COST_RULE = `${BASE_URL}/CreateCostRule`;
export const UPDATE_COST_RULE = `${BASE_URL}/UpdateCostRule`;
export const DELETE_COST_RULE = `${BASE_URL}/DeleteCostRule`;

// Cost Rule Filter

export const GET_COST_RULE_FILTERS_BY_RULEID = `${BASE_URL}/CostRuleFiltersByRuleId`;
export const CREATE_COST_RULE_FILTER = `${BASE_URL}/CreateCostRuleFilter`;
export const UPDATE_COST_RULE_FILTER = `${BASE_URL}/UpdateCostRuleFilter`;
export const DELETE_COST_RULE_FILTER = `${BASE_URL}/DeleteCostRuleFilter`;

// Cost Rule Filter Details

export const GET_COST_RULE_FILTER_DETAILS_BY_RULEFILTERID = `${BASE_URL}/GetCostRuleFilterDetailsByRuleFilterId`;
export const CREATE_COST_RULE_FILTER_DETAIL = `${BASE_URL}/CreateCostRuleFilterDetail`;
export const UPDATE_COST_RULE_FILTER_DETAIL = `${BASE_URL}/UpdateCostRuleFilterDetail`;
export const DELETE_COST_RULE_FILTER_DETAIL = `${BASE_URL}/DeleteCostRuleFilterDetail`;
export const GET_COST_RULE_OBJECTS_BY_RULEFILTERID = `${BASE_URL}/GetCostRuleObjectsByRuleFilterId`;
export const CREATE_COST_RULE_OBJECT = `${BASE_URL}/CreateCostRuleObject`;
export const UPDATE_COST_RULE_OBJECT = `${BASE_URL}/UpdateCostRuleObject`;
export const DELETE_COST_RULE_OBJECT = `${BASE_URL}/DeleteCostRuleObject`;