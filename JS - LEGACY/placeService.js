class PlaceService {
    constructor() {
        this.categoriesCache = null;
    }

    async getCategories() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error fetching categories');
            return await response.json();
        } catch (error) {
            console.error('Error in getCategories:', error);
            throw error;
        }
    }

    async getCustomCategories() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOM_CATEGORIES}`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error fetching custom categories');
            return await response.json();
        } catch (error) {
            console.error('Error in getCustomCategories:', error);
            throw error;
        }
    }

    async getPlacesByCategory(categoryId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PLACES}?category=${categoryId}`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error fetching places');
            return await response.json();
        } catch (error) {
            console.error('Error in getPlacesByCategory:', error);
            throw error;
        }
    }
}

const placeService = new PlaceService();
