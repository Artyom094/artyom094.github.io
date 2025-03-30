const API_CONFIG = {
    BASE_URL: '//UEL', // URL base de la API
    ENDPOINTS: {
        AUTH: '/auth',
        PLACES: '/places',
        CATEGORIES: '/categories',
        CUSTOM_CATEGORIES: '/categories/custom',
        USERS: '/users',
        REVIEWS: '/reviews'
    },
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

function getAuthHeaders() {
    const token = localStorage.getItem('userToken');
    return {
        ...API_CONFIG.HEADERS,
        'Authorization': token ? `Bearer ${token}` : ''
    };
}
