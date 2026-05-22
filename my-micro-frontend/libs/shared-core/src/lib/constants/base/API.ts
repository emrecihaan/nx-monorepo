type ApiType = 'local' | 'test' | 'live';

export class API {
    static apiType: ApiType = "test";

    static service = {
        login: {
            local: "https://localhost:44334/api/Login",
            test: "http://172.28.161.186:8090/api/Login",
            live: "/api8090/api/Login"
        },
        system: {
            local: "https://localhost:44309/api",
            test: "http://172.28.161.186:8091/api",
            live: "/api8091/api"
        },
        pageSub: {
            local: "https://localhost:44309/api/PageSub",
            test: "http://172.28.161.186:8091/api/PageSub",
            live: "/api8091/api/PageSub"
        },
        form: {
            local: "https://localhost:44300/api",
            test: "http://172.28.161.186/api/form",
            live: ""
        },
        cost: {
            local: "https://localhost:44309/api/DfCostRule",
            test: "http://172.28.161.186:8115/api/DfCostRule",
            live: "/api8091/api/DfCostRule"
        },
        company: {
            local: "https://localhost:44309/api/Company",
            test: "http://172.28.161.186/api/system/company",
            live: "/api8090/api/Company"
        },
        dfCostGroup: {
            local: "https://localhost:44300/api/DfCostGroup",
            test: "http://172.28.161.186/api/form/DfCostGroup",
            live: ""
        },
    }
    static base = {
        local: "",
        test: "",
        live: ""
    }
    static baseRoute(apiType: ApiType) {
        return API.base[apiType]
    }
    static serviceRoute(service: keyof typeof API.service, apitype: ApiType) {
        return API.service[service][apitype]
    }
}
