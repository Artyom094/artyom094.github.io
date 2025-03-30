/**
 * Servicio para manejar las peticiones a la API
 * Proporciona funciones genéricas para comunicarse con el backend
 */
class ApiService {
    /**
     * Realiza una petición a la API
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} options - Opciones de la petición
     * @returns {Promise<Object>} - Respuesta de la API
     */
    static async request(endpoint, options = {}) {
        try {
            // Añadir token de autenticación si el usuario está autenticado
            if (AuthService.isAuthenticated()) {
                options.headers = options.headers || {};
                options.headers['Authorization'] = `Bearer ${AuthService.getToken()}`;
            }

            // Asegurar que siempre tenemos un Content-Type
            if (options.body && !options.headers?.['Content-Type']) {
                options.headers = options.headers || {};
                options.headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(`${appConfig.apiBaseUrl}${endpoint}`, options);

            // Manejar errores HTTP
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
                error.status = response.status;
                error.data = errorData;
                throw error;
            }

            // Intentar parsear como JSON, si falla, devolver texto
            try {
                return await response.json();
            } catch (e) {
                return await response.text();
            }
        } catch (error) {
            console.error(`Error en petición API (${endpoint}):`, error);
            
            // Si es un error de autenticación, manejar con AuthService
            if (error.status === 401) {
                AuthService._handleAuthError(error);
            }
            
            throw error;
        }
    }

    /**
     * Realiza una petición GET
     * @param {string} endpoint - Endpoint de la API
     * @returns {Promise<Object>} - Respuesta de la API
     */
    static async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    /**
     * Realiza una petición POST
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} data - Datos a enviar
     * @returns {Promise<Object>} - Respuesta de la API
     */
    static async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Realiza una petición PUT
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} data - Datos a enviar
     * @returns {Promise<Object>} - Respuesta de la API
     */
    static async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Realiza una petición DELETE
     * @param {string} endpoint - Endpoint de la API
     * @returns {Promise<Object>} - Respuesta de la API
     */
    static async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Métodos específicos para el manejo de usuarios

    /**
     * Obtiene el perfil del usuario actual
     * @returns {Promise<Object>} - Perfil del usuario
     */
    static async getUserProfile() {
        // Aquí podrías usar el endpoint específico para el perfil
        return this.get(appConfig.endpoints.getUserById.replace('{id}', 'me'));
    }

    /**
     * Actualiza el perfil del usuario
     * @param {Object} profileData - Datos del perfil
     * @returns {Promise<Object>} - Perfil actualizado
     */
    static async updateUserProfile(profileData) {
        return this.put(appConfig.endpoints.updateUsers, profileData);
    }

    // Métodos para el manejo de Values (ejemplo)

    /**
     * Obtiene todos los values
     * @returns {Promise<Array>} - Lista de values
     */
    static async getValues() {
        return this.get(appConfig.endpoints.getValues);
    }

    /**
     * Obtiene un value por su ID
     * @param {string|number} id - ID del value
     * @returns {Promise<Object>} - Value
     */
    static async getValueById(id) {
        return this.get(appConfig.endpoints.getValueById.replace('{id}', id));
    }

    /**
     * Crea un nuevo value
     * @param {Object} valueData - Datos del value
     * @returns {Promise<Object>} - Value creado
     */
    static async createValue(valueData) {
        return this.post(appConfig.endpoints.createValue, valueData);
    }

    /**
     * Actualiza un value
     * @param {string|number} id - ID del value
     * @param {Object} valueData - Datos del value
     * @returns {Promise<Object>} - Value actualizado
     */
    static async updateValue(id, valueData) {
        return this.put(appConfig.endpoints.updateValue.replace('{id}', id), valueData);
    }

    /**
     * Elimina un value
     * @param {string|number} id - ID del value
     * @returns {Promise<Object>} - Respuesta
     */
    static async deleteValue(id) {
        return this.delete(appConfig.endpoints.deleteValue.replace('{id}', id));
    }
}