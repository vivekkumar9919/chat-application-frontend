const BASE_URL =  import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

export const API_URLS = {
    SIGNUP_URL: `${BASE_URL}/api/v1/auth/signup`,
    LOGIN_URL: `${BASE_URL}/api/v1/auth/login`,
    LOGOUT_URL: `${BASE_URL}/api/v1/auth/logout`,
    CONVERSATION_URL: `${BASE_URL}/api/v1/conversations`,
    MESSAGE_URL: `${BASE_URL}/api/v1/messages`,
    USER_URL: `${BASE_URL}/api/v1/users`
};