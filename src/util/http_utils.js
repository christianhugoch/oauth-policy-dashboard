import axios from 'axios';


let policyServerBasePath = process.env.REACT_APP_POLICY_SERVER_BASE_PATH ||
    "http://localhost:3031";

const HttpVerbs = {
    GET: 0,
    POST: 1,
    PUT: 2,
    DELETE: 3,
};


function prepareFunctionAndParams(args) {
    switch (args.httpVerb) {
        case HttpVerbs.GET: {
            return [axios.get, { params: args.params }];
        }
        case HttpVerbs.DELETE: {
            return [axios.delete, { params: args.params }];
        }
        case HttpVerbs.POST: {
            return [axios.post, args.params];
        }
        case HttpVerbs.PUT: {
            return [axios.put, args.params];
        }
        default: {
            throw new Error('A httpVerb parameter is mandatory');
        }
    }
}


async function callService(args) {
    if (args.url === undefined) {
        throw new Error('A url parameter is mandatory.');
    }
    axios.defaults.headers.common['Authorization'] =
        `id_token ${args.idToken}`;
    axios.defaults.headers.common['oidc_issuer'] =
        args.oidcIssuer;
    const [fn, params] = prepareFunctionAndParams(args);
    try {
        let response = await fn.call(axios, args.url, params);
        return response.data;
    }
    catch (error) {
        console.trace(error);
        if (!error.response) {
            throw new Error(`Unable to reach '${args.url}'`);
        }
        throw new Error(error.response.data.message);
    }
}


export async function GETPolicy(idToken, policyId) {
    let response = await callService({
        httpVerb: HttpVerbs.GET,
        url: `${policyServerBasePath}/policy/${policyId}`,
        idToken: idToken,
    });
    return response.policy;
}


export async function PUTPolicy(idToken, name, id, code) {
    let response = await callService({
        httpVerb: HttpVerbs.PUT,
        url: `${policyServerBasePath}/policy`,
        idToken: idToken,
        params: { policy: code, policyId: id, name: name },
    });
    return response.policy;
}


export async function POSTPolicy(idToken, name, code) {
    let response = await callService({
        httpVerb: HttpVerbs.POST,
        url: `${policyServerBasePath}/policy`,
        idToken: idToken,
        params: { policy: code, name: name },
    });
    return response.policy;
}


export async function DELETEPolicy(policyId, idToken) {
    let response = await callService({
        httpVerb: HttpVerbs.DELETE,
        url: `${policyServerBasePath}/policy`,
        idToken: idToken,
        params: { id: policyId },
    });
    return response.policy;
}


export async function DELETETestSuite(testSuiteId, idToken) {
    await callService({
        httpVerb: HttpVerbs.DELETE,
        url: `${policyServerBasePath}/policy_test_suite`,
        idToken: idToken,
        params: { id: testSuiteId },
    });
}


export async function GETOidcCfgs() {
    let response = await callService({
        httpVerb: HttpVerbs.GET,
        url: `${policyServerBasePath}/oidc/cfgs`,
    });
    return response.cfgs;
}


export async function GETPolicies(idToken) {
    let response = await callService({
        httpVerb: HttpVerbs.GET,
        url: `${policyServerBasePath}/policy`,
        idToken: idToken,
    });
    return response.policies;
}


export async function GETPolicyTestSuites(idToken) {
    let response = await callService({
        httpVerb: HttpVerbs.GET,
        url: `${policyServerBasePath}/policy_test_suite`,
        idToken: idToken,
    });
    return response.suites;
}


export async function POSTExecuteTestSuites(idToken, name) {
    let response = await callService({
        httpVerb: HttpVerbs.POST,
        url: `${policyServerBasePath}/policy_test_suite/exec`,
        idToken: idToken,
        params: { testSuites: name },
    });
    return response.statistics;
}


export async function GetPolicyTestSuite(idToken, suiteId) {
    let response = await callService({
        httpVerb: HttpVerbs.GET,
        url: `${policyServerBasePath}/policy_test_suite/${suiteId}`,
        idToken: idToken,
    });
    return response.suite;
}


export async function POSTPolicyTestSuite(idToken, suiteCode) {
    let response = await callService({
        httpVerb: HttpVerbs.POST,
        url: `${policyServerBasePath}/policy_test_suite`,
        idToken: idToken,
        params: { suite: escape(suiteCode) },
    });
    return response.suite;
}


export async function PUTPolicyTestSuite(idToken, jsonCode, suitedId) {
    let response = await callService({
        httpVerb: HttpVerbs.PUT,
        url: `${policyServerBasePath}/policy_test_suite`,
        idToken: idToken,
        params: { id: suitedId, suite: escape(jsonCode) },
    });
    return response.suite;
}


export async function POSTLinkedUser(idToken) {
    let response = await callService({
        httpVerb: HttpVerbs.POST,
        url: `${policyServerBasePath}/user/linkedUser`,
        idToken: idToken,
        oidcIssuer: 'local'
    });
    return response.user;
}


export async function GETLinkedUser(idToken) {
    let response = await callService({
        httpVerb: HttpVerbs.GET,
        url: `${policyServerBasePath}/user/linkedUser`,
        idToken: idToken,
    });
    return response.user;
}


export async function PUTLoginStats(idToken) {
    let response = await callService({
        httpVerb: HttpVerbs.PUT,
        url: `${policyServerBasePath}/user/loginStats`,
        idToken: idToken,
        oidcIssuer: 'local'
    });
    return response.user;
}


export async function PUTLogoutStats(idToken) {
    let response = await callService({
        httpVerb: HttpVerbs.PUT,
        url: `${policyServerBasePath}/user/logoutStats`,
        idToken: idToken,
    });
    return response.user;
}