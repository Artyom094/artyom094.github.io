const API_CONFIG = {
    baseUrl: '/api',
    endpoints: {
        auth: {
            login: '/auth/login',
            logout: '/auth/logout',
            profile: '/auth/profile'
        },
        places: {
            list: '/places',
            categories: '/places/categories',
            details: '/places/:id',
            nearby: '/places/nearby'
        },
        reviews: {
            list: '/reviews',
            create: '/reviews',
            update: '/reviews/:id',
            delete: '/reviews/:id'
        },
        badges: {
            list: '/badges',
            userBadges: '/badges/user'
        }
    }
};

class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    }

    async request(endpoint, options = {}) {
        try {
            const url = this.baseUrl + endpoint;
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async get(endpoint, params = {}) {
        const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('API request failed');
        return await response.json();
    }

    async post(endpoint, data = {}) {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('API request failed');
        return await response.json();
    }

    async put(endpoint, data = {}) {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('API request failed');
        return await response.json();
    }

    async delete(endpoint) {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('API request failed');
        return await response.json();
    }

    // Places methods
    async getPlacesByCategory(category) {
        return this.request(`${API_CONFIG.endpoints.places.list}?category=${category}`);
    }

    async getNearbyPlaces(lat, lng) {
        return this.request(`${API_CONFIG.endpoints.places.nearby}?lat=${lat}&lng=${lng}`);
    }

    // Reviews methods
    async createReview(data) {
        return this.request(API_CONFIG.endpoints.reviews.create, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // User methods
    async getUserProfile() {
        return this.request(API_CONFIG.endpoints.auth.profile);
    }

    async getUserBadges() {
        return this.request(API_CONFIG.endpoints.badges.userBadges);
    }
}

// Exportar una instancia única
const apiService = new ApiService();
