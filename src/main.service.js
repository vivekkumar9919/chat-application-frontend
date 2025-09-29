
import { callApi } from "./utility/apiClients";
import sampleResponse from "./sampleResponse";
import { API_URLS } from './urls'

const isDev = import.meta.env.NODE_ENV === "development" || false;

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

    async fetchConversationsByUserId(userId) {
        if(isDev){
            return Promise.resolve(sampleResponse.conversationResponse);
        }
        return callApi({
            url: `${API_URLS.CONVERSATION_URL}/user/${userId}`,
            method: 'GET'
        });
    },

    async fetchMessagesByConversationId(conversationId, currentUserId) {
        if(isDev){
            return Promise.resolve(sampleResponse.messageResponse);
        }
        return callApi({
            url: `${API_URLS.MESSAGE_URL}/${conversationId}?userId=${currentUserId}`,
            method: 'GET'
        });
    },

    async sendMessage(requestBody, conversationId) {
        if(isDev){
            return Promise.resolve(sampleResponse.sendMessageResponse);
        }
        return callApi({
            url: `${API_URLS.MESSAGE_URL}/${conversationId}`,
            method: 'POST',
            body: requestBody
        });
    }

}


export default chatServices;