
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
    },

    // User search and management APIs
    async searchUsers(query) {
        if(isDev){
            return Promise.resolve(sampleResponse.userSearchResponse);
        }
        return callApi({
            url: `${API_URLS.USER_URL}/search?query=${encodeURIComponent(query)}`,
            method: 'GET'
        });
    },

    async fetchAllUsers() {
        if(isDev){
            return Promise.resolve(sampleResponse.allUsersResponse);
        }
        return callApi({
            url: `${API_URLS.USER_URL}/fetchAll`,
            method: 'GET'
        });
    },

    // Conversation management APIs
    async createConversation(type, userIds) {
        if(isDev){
            return Promise.resolve(sampleResponse.createConversationResponse);
        }
        return callApi({
            url: `${API_URLS.CONVERSATION_URL}`,
            method: 'POST',
            body: { type, userIds }
        });
    }

}


export default chatServices;