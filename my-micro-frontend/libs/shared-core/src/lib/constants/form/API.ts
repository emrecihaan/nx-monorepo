export class API {
    static apiType = "test";
    static baseContent = "http://172.28.161.186/FormSystemFile/";
    static imageBase = "https://igsaybackend.igdas.com.tr:8095/";
    static service = {
        system: {
            local: "https://localhost:44309/api",
            test: "system",
            live: ":8091/system"
        },
        login: {
            local: "https://localhost:44334/api/Login",
            test: "login",
            live: ":8090/User"
        },
        survey: {
            local: "https://localhost:44345/api/Survey",
            test: "survey/survey",
            live: ":8090/User"
        },
        surveyQuestion: {
            local: "https://localhost:44345/api/SurveyQuestion",
            test: "survey/SurveyQuestion",
            live: ":8090/User"
        },
        bankIntegration: {
            local: "/bankIntegration/bankIntegration",
            test: ":44397/bankIntegration",
            live: ":80397/bankIntegration"
        },
        smsandmail: {
            local: "https://localhost:44364/api",
            test: "smsmail",
            live: ":8090/User"

        },
        application: {
            local: "https://localhost:44309/api/Application",
            test: "system/application",
            live: ":8090/User"
        },
        company: {
            local: "https://localhost:44309/api/Company",
            test: "system/company",
            live: ":8090/User"
        },
        userType: {
            local: "https://localhost:44309/api/UserType",
            test: "system/UserType",
            live: ":8090/User"
        },
        role: {
            local: "https://localhost:44309/api/Role",
            test: "system/role",
            live: ""
        },
        pageSubFunction: {
            local: "https://localhost:44309/api/SystemPageSubFunction",
            test: "system/SystemPageSubFunction",
            live: ""
        },
        roleSubPagesFuncLink: {
            local: "https://localhost:44309/api/SystemRoleSubPagesFuncLink",
            test: "system/SystemRoleSubPagesFuncLink",
            live: ""
        },
        userRoleLink: {
            local: "https://localhost:44309/api/UserRoleLink",
            test: "system/UserRoleLink",
            live: ""
        },
        surveyHeader: {
            local: "https://localhost:44345/api/SurveyHeader",
            test: "survey/SurveyHeader",
            live: ":8090/User"
        },
        surveyAnswerType: {
            local: "https://localhost:44345/api/SurveyAnswerType",
            test: "survey/SurveyAnswerType",
            live: ":8090/User"
        },


        content: {
            local: "https://localhost:44300/api/Content",
            test: "content/content",
            live: ""
        },
        contentViewAt: {
            local: "https://localhost:44300/api/ContentViewAt",
            test: "content/ContentViewAt",
            live: ""
        },
        contentDisplayFormat: {
            local: "https://localhost:44300/api/ContentDisplayFormat",
            test: "content/ContentDisplayFormat",
            live: ""
        },

        page: {
            local: "https://localhost:44309/api/Page",
            test: "system/page",
            live: ""
        },
        pageSub: {
            local: "https://localhost:44309/api/PageSub",
            test: "system/PageSub",
            live: ""
        },
        category: {
            local: "https://localhost:44309/api/SystemPageCategory",
            test: "system/SystemPageCategory",
            live: ""
        },
        systemMicroservice: {
            local: "https://localhost:44309/api/SystemMicroservice",
            test: "system/SystemMicroservice",
            live: ""
        },
        bank: {
            local: "https://localhost:44319/api/Bank",
            test: "bank/bank",
            live: ""
        },
        posTransaction: {
            local: "https://localhost:44319/api/PosTransaction",
            test: "bank/posTransaction",
            live: ""
        },

        electriconline: {
            local: "https://localhost:44324/api/FreeConsumer",
            test: "electriconline/FreeConsumer",
            live: ""
        },
        surveyType: {
            local: "https://localhost:44345/api/SurveyType",
            test: "survey/SurveyType",
            live: ""
        },
        surveyDetail: {
            local: "https://localhost:44345/api/SurveyDetail",
            test: "survey/SurveyDetail",
            live: ""
        },
        log: {
            local: "https://localhost:44308/api",
            test: "log",
            live: ""
        },
        form: {
            local: "https://localhost:44300/api",
            test: "form",
            live: ""
        },
        dfCostGroup: {
            local: "https://localhost:44300/api/DfCostGroup",
            test: "/form/DfCostGroup",
            live: ""
        },
        dfCostType: {
            local: "https://localhost:7121/api/DfCostType",
            test: "form/DfCostType",
            live: ""
        },
        dfCostCenter: {
            local: "https://localhost:7121/api/DfCostCenter",
            test: "form/DfCostCenter",
            live: ""
        },
        dfUserProxy: {
            local: "https://localhost:7121/api/DfUserProxy",
            test: "form/DfUserProxy",
            live: ""
        }
    }
    static base = {
        local: "",
        test: "http://172.28.161.186/api/",
        live: "https://igsaybackend.igdas.com.tr"
    }
    static baseCdn = {
        local: "testwebtesisatcdn.igdas.com.tr",
        test: "testwebtesisatcdn.igdas.com.tr",
        live: "igsaybackend.igdas.com.tr:8095"
    }
    static baseDas = {
        local: "https://dastest.igdas.istanbul/",
        test: "https://dastest.igdas.istanbul/",
        live: "https://das.igdas.com.tr/"
    }
    static baseRoute(apiType: any) {
        return (API.base as any)[apiType]
    }
    static serviceRoute(service: any, apitype: any) {
        return (API.service as any)[service][apitype]
    }
    static cdnRoute(apiType: any) {
        return (API.baseCdn as any)[apiType]
    }
    static dasRoute(apiType: any) {
        return (API.baseDas as any)[apiType]
    }
}
