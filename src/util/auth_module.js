import { UserManager, WebStorageStateStore } from 'oidc-client';
import { GETLinkedUser, PUTLogoutStats } from './http_utils';


let userManager = null;
let _linkedUser = null;
// Log.logger = console;
// Log.level = Log.DEBUG;    

if (localStorage.getItem('selectedIdP')) {
    initUserManagerFromStorage();
}

export function initUserManagerFromStorage() {
    let idPStr = localStorage.getItem('selectedIdP');
    if (!idPStr) {
        throw new Error('The identity Provider storage string is missing.');
    }
    let providerCfg = JSON.parse(idPStr);
    userManager = new UserManager({
        authority: providerCfg.issuer,
        client_id: providerCfg.clientId,
        redirect_uri: process.env.REACT_APP_REDIRECT_URI,
        post_logout_redirect_uri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI,
        response_type: providerCfg.grantType === 'authorization_code' ?
            'code' : 'id_token',
        response_mode: 'fragment',
        scope: 'openid',

        userStore: new WebStorageStateStore({ store: window.localStorage })
    });
}


export async function doLogin() {
    return userManager.signinRedirect({ state: 'some data' });
}


export async function loginCallback(url) {
    return await userManager.signinRedirectCallback(url);
}


export async function logout() {
    let oidcUser = await getAuthenticatedUser();
    await PUTLogoutStats(oidcUser.id_token);
    return userManager.signoutRedirect({ state: 'some data' });
}


export async function logoutCallback(url) {
    let response = await userManager.signoutRedirectCallback();
    return response;
}


export async function getAuthenticatedUser() {
    try {
        return await userManager.getUser();
    }
    catch (error) {
        console.log('Error while getting the authenticated user:');
        console.log(error);
        return null;
    }
}


export async function getLinkedUser() {
    if (_linkedUser === null) {
        let oidcUser = await getAuthenticatedUser();
        if (oidcUser !== null) {
            setLinkedUser(await GETLinkedUser(oidcUser.id_token));
        }
    }
    return _linkedUser;
}


export function setLinkedUser(linkedUser) {
    _linkedUser = linkedUser;
}