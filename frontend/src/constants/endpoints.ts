const API_BASE_URL = window.env?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
    SIGNUP: `${API_BASE_URL}/user/signup`,
    LOGIN: `${API_BASE_URL}/user/login`,
    GOOGLE_LOGIN: `${API_BASE_URL}/user/login/google`,
    VERIFY_EMAIL: `${API_BASE_URL}/user/verify-email`,
    CHECK_EMAIL: `${API_BASE_URL}/user/exists`,
    NOTIFY_RESET_PASSWORD: `${API_BASE_URL}/user/reset-password`,
    VERIFY_RESET_PASSWORD: `${API_BASE_URL}/user/reset-password/confirm`,

    GET_ALL_SUBJECTS: `${API_BASE_URL}/subject/get-all`,
    GET_SUBJECT: `${API_BASE_URL}/subject/subject-id`,

    USER_PROFILE: `${API_BASE_URL}/user`,
    USER_STRIPE_ACCOUNT: `${API_BASE_URL}/user/stripe-account/id`,
    USER_STATISTICS: `${API_BASE_URL}/material/statistics`,
    VERIFY_USER: `${API_BASE_URL}/auth/verify`,

    GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,

    CREATE_LESSON: `${API_BASE_URL}/lesson/create-lesson`,

    UPLOAD: `${API_BASE_URL}/material/upload`,
    USER_MATERIALS: `${API_BASE_URL}/material/user`,
    GET_MATERIAL: `${API_BASE_URL}/material/material-id`,
    GET_MATERIAL_PAGE: `${API_BASE_URL}/material/material-id/page/page-number`,
    SEARCH_MATERIAL: `${API_BASE_URL}/material/search`,
    DOWNLOAD_MATERIAL: `${API_BASE_URL}/material/url/material-id`,

    CREATE_COMMENT: `${API_BASE_URL}/comment/create`,
    DELETE_COMMENT: `${API_BASE_URL}/comment/comment-id/delete`,
    GET_COMMENTS: `${API_BASE_URL}/comment/material-id`,
    VOTE_COMMENT: `${API_BASE_URL}/comment/comment-id/vote`,
    CHECK_UPVOTE: `${API_BASE_URL}/comment/user-id/comment-id/check`,

    USER_LESSONS: `${API_BASE_URL}/lesson/user`,
    ALL_MATERIALS_LESSON: `${API_BASE_URL}/lesson/lesson-id/all-materials`,
    ADD_MATERIAL_LESSON: `${API_BASE_URL}/lesson/lesson-id/add-material`,
    GET_LESSON: `${API_BASE_URL}/lesson/lesson-id`,
    SEARCH_LESSON: `${API_BASE_URL}/lesson/search`,

    GET_MATERIAL_RATING: `${API_BASE_URL}/rating/material-id`,
    RATE_MATERIAL: `${API_BASE_URL}/rating/rate`,
    CHECK_USER_RATING: `${API_BASE_URL}/rating/material-id/check`,

    ADD_HISTORY_ENTRY: `${API_BASE_URL}/history/add`,
    DELETE_HISTORY_ENTRY: `${API_BASE_URL}/history/delete`,
    BULK_DELETE_HISTORY_ENTRIES: `${API_BASE_URL}/history/bulk-delete`,
    LIST_HISTORY_ENTRIES: `${API_BASE_URL}/history/list`,

    REDIRECT_TO_CHECKOUT: `${API_BASE_URL}/payment/redirect-to-checkout`,
    CHECK_MATERIAL_PAYMENT: `${API_BASE_URL}/payment/check-material-payment`,
    PAYMENT_HISTORY: `${API_BASE_URL}/payment/payment-history`,
    ORDERS_HISTORY: `${API_BASE_URL}/payment/orders-history`,

    STRIPE_REDIRECT_URI: `${API_BASE_URL}/payment/oauth/callback`,

    GET_GENERAL_STATS: `${API_BASE_URL}/statistics/general`,
    GET_TOP_MATERIALS: `${API_BASE_URL}/statistics/top-materials`,
    GET_TOP_CONTRIBUTORS: `${API_BASE_URL}/statistics/top-contributors`,

    GENERATE_AI_RESPONSE: `${API_BASE_URL}/ai-chat/generate-response`,
    CLEAR_AI_SESSION: `${API_BASE_URL}/ai-chat/clear-session`,

    RECENT_TASKS: `${API_BASE_URL}/tasks/recent-tasks`
};