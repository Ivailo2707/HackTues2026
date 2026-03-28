export const API_PATHS = {
    AUTH_LOGIN: '/auth/login',
    AUTH_REFRESH: '/auth/refresh',
    AUTH_LOGOUT: '/auth/logout',

    USERS: '/users',
    USER_BY_ID: (id) => `/users/${id}`,
    ME: '/me',

    AI: '/ai',

    VILLAGES: '/villages',
    VILLAGE_BY_ID: (id) => `/villages/${id}`,
};