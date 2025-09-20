
import { callApi } from "./utility/apiClients";
import sampleResponse from "./sampleResponse";
import { API_URLS } from './urls'

const isDev = false;

const chatServices = {
    async loginService(requestBody) {
        if(isDev){
            return Promise.resolve(sampleResponse.loginResponse);
        }
        return callApi({
            url: API_URLS.LOGIN_URL,
            method: 'POST',
            body:requestBody
        });
    },
    async logoutService(requestBody) {
        if(isDev){
            return Promise.resolve(sampleResponse.logoutResponse);
        }
        return callApi({
            url: API_URLS.LOGOUT_URL,
            method: 'POST',
            body:requestBody
        });
    },
    async signupService(requestBody) {
        if(isDev){
            return Promise.resolve(sampleResponse.signupResponse);
        }
        return callApi({
            url: API_URLS.SIGNUP_URL,
            method: 'POST',
            body:requestBody
        });
    },

}


export default chatServices;