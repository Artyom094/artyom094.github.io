/**
 * Servicio AJAX para CityVibes
 * Proporciona métodos para realizar solicitudes AJAX a la API
 */
class AjaxService {
    constructor() {
        this.API_BASE_URL = 'https://cityvibess.bsite.net/api';
    }

    /**
     * Realiza una solicitud GET
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} params - Parámetros de consulta (opcional)
     * @returns {Promise} - Promesa con la respuesta
     */
    async get(endpoint, params = null) {
        try {
            let url = `${this.API_BASE_URL}${endpoint}`;
            
            // Agregar parámetros de consulta si existen
            if (params) {
                const queryString = Object.keys(params)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                    .join('&');
                url = `${url}?${queryString}`;
            }
            
            const token = localStorage.getItem('userToken');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            
            const response = await fetch(url, {
                method: 'GET',
                headers: headers
            });
            
            return this.handleResponse(response);
        } catch (error) {
            console.error(`Error en GET ${endpoint}:`, error);
            throw this.handleError(error);
        }
    }

    /**
     * Realiza una solicitud POST
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} data - Datos a enviar
     * @returns {Promise} - Promesa con la respuesta
     */
    async post(endpoint, data) {
        try {
            const token = localStorage.getItem('userToken');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };
            
            const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            
            return this.handleResponse(response);
        } catch (error) {
            console.error(`Error en POST ${endpoint}:`, error);
            throw this.handleError(error);
        }
    }

    /**
     * Realiza una solicitud PUT
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} data - Datos a enviar
     * @returns {Promise} - Promesa con la respuesta
     */
    async put(endpoint, data) {
        try {
            const token = localStorage.getItem('userToken');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };
            
            const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(data)
            });
            
            return this.handleResponse(response);
        } catch (error) {
            console.error(`Error en PUT ${endpoint}:`, error);
            throw this.handleError(error);
        }
    }

    /**
     * Realiza una solicitud DELETE
     * @param {string} endpoint - Endpoint de la API
     * @returns {Promise} - Promesa con la respuesta
     */
    async delete(endpoint) {
        try {
            const token = localStorage.getItem('userToken');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            
            const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: headers
            });
            
            return this.handleResponse(response);
        } catch (error) {
            console.error(`Error en DELETE ${endpoint}:`, error);
            throw this.handleError(error);
        }
    }

    /**
     * Maneja la respuesta de la API
     * @param {Response} response - Respuesta de fetch
     * @returns {Promise} - Promesa con los datos procesados
     */
    async handleResponse(response) {
        if (!response.ok) {
            // Si la respuesta no es exitosa, intentar obtener detalles del error
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                // Si no hay JSON en la respuesta, usar texto básico
                errorData = { message: await response.text() || 'Error en la solicitud' };
            }
            
            throw {
                status: response.status,
                message: errorData.message || `Error ${response.status}`,
                data: errorData
            };
        }
        
        // Verificar si hay contenido en la respuesta
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    }

    /**
     * Maneja errores generales
     * @param {Error} error - Error a manejar
     * @returns {Object} - Objeto de error estandarizado
     */
    handleError(error) {
        return {
            status: error.status || 500,
            message: error.message || 'Error en la solicitud',
            data: error.data || error
        };
    }
}

// Crear una instancia única del servicio
const ajaxService = new AjaxService();

// Exportar la instancia
export default ajaxService;
