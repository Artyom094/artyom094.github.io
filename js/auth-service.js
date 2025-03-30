/**
 * Servicio de autenticación para la aplicación CityVibes
 * Proporciona funciones para registro, inicio de sesión, y gestión de usuarios
 */
class AuthService {
    /**
     * Registra un nuevo usuario en la aplicación
     * @param {Object} userData - Datos del usuario a registrar
     * @returns {Promise<Object>} - Datos del usuario registrado
     */
    static async register(userData) {
        try {
            const response = await fetch(`${appConfig.apiBaseUrl}${appConfig.endpoints.register}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Username: userData.username,
                    Email: userData.email,
                    Password: userData.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar usuario');
            }

            const data = await response.json();
            
            // Si el registro devuelve un token, lo guardamos directamente
            if (data.token) {
                this._saveToken(data.token, data.expiry);
            }
            
            return data;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    /**
     * Inicia sesión con credenciales de usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<Object>} - Datos del usuario autenticado
     */
    static async login(email, password) {
        try {
            const response = await fetch(`${appConfig.apiBaseUrl}${appConfig.endpoints.login}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al iniciar sesión');
            }

            const userData = await response.json();
            this._saveToken(userData.token, userData.expiry);
            return userData;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    /**
     * Actualiza el perfil del usuario actual
     * @param {Object} userData - Datos a actualizar
     * @returns {Promise<Object>} - Perfil actualizado
     */
    static async updateProfile(userData) {
        try {
            await this._checkTokenValidity();
            const token = localStorage.getItem(appConfig.token.name);
            
            const response = await fetch(`${appConfig.apiBaseUrl}${appConfig.endpoints.updateUsers}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar perfil');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en actualización de perfil:', error);
            this._handleAuthError(error);
            throw error;
        }
    }

    /**
     * Elimina la cuenta del usuario actual
     * @returns {Promise<boolean>} - True si se eliminó correctamente
     */
    static async deleteAccount() {
        try {
            await this._checkTokenValidity();
            const token = localStorage.getItem(appConfig.token.name);
            
            const response = await fetch(`${appConfig.apiBaseUrl}${appConfig.endpoints.deleteUser}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar cuenta');
            }

            this.logout();
            return true;
        } catch (error) {
            console.error('Error en eliminación de cuenta:', error);
            this._handleAuthError(error);
            throw error;
        }
    }

    /**
     * Obtiene la lista de usuarios disponibles
     * @returns {Promise<Array>} - Lista de usuarios
     */
    static async getUsers() {
        try {
            await this._checkTokenValidity();
            const token = localStorage.getItem(appConfig.token.name);
            
            const response = await fetch(`${appConfig.apiBaseUrl}${appConfig.endpoints.getUsers}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener usuarios');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            this._handleAuthError(error);
            throw error;
        }
    }

    /**
     * Obtiene información de un usuario por su ID
     * @param {string|number} userId - ID del usuario
     * @returns {Promise<Object>} - Datos del usuario
     */
    static async getUserById(userId) {
        try {
            await this._checkTokenValidity();
            const token = localStorage.getItem(appConfig.token.name);
            
            const endpoint = appConfig.endpoints.getUserById.replace('{id}', userId);
            const response = await fetch(`${appConfig.apiBaseUrl}${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener usuario');
            }

            return await response.json();
        } catch (error) {
            console.error(`Error al obtener usuario ${userId}:`, error);
            this._handleAuthError(error);
            throw error;
        }
    }

    /**
     * Cierra la sesión del usuario actual
     */
    static logout() {
        localStorage.removeItem(appConfig.token.name);
        localStorage.removeItem(`${appConfig.token.name}_expiry`);
        window.location.href = 'login.html';
    }

    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} - True si hay un token válido
     */
    static isAuthenticated() {
        const token = localStorage.getItem(appConfig.token.name);
        if (!token) return false;
        
        // Verificar si el token ha expirado
        const expiry = localStorage.getItem(`${appConfig.token.name}_expiry`);
        if (expiry && parseInt(expiry) < Date.now()) {
            this.logout(); // Token expirado, cerrar sesión
            return false;
        }
        
        return true;
    }

    /**
     * Obtiene el token actual
     * @returns {string|null} - Token o null si no existe
     */
    static getToken() {
        return localStorage.getItem(appConfig.token.name);
    }

    // Métodos privados (auxiliares)

    /**
     * Guarda el token y su fecha de expiración
     * @param {string} token - Token JWT
     * @param {number|null} expiry - Tiempo de expiración (opcional)
     * @private
     */
    static _saveToken(token, expiry = null) {
        localStorage.setItem(appConfig.token.name, token);
        
        // Si no viene expiración, usar la configuración predeterminada
        const expiryTime = expiry || (Date.now() + appConfig.token.expiry);
        localStorage.setItem(`${appConfig.token.name}_expiry`, expiryTime.toString());
    }

    /**
     * Verifica si el token está próximo a expirar y lo renueva si es necesario
     * @returns {Promise<void>}
     * @private
     */
    static async _checkTokenValidity() {
        if (!this.isAuthenticated()) {
            throw new Error('Usuario no autenticado');
        }

        const expiry = parseInt(localStorage.getItem(`${appConfig.token.name}_expiry`));
        const now = Date.now();
        
        // Si el token expira pronto, intentar renovarlo
        if (expiry - now < appConfig.token.refreshThreshold) {
            try {
                // Aquí se implementaría la lógica para renovar el token
                // Depende de cómo esté configurada tu API
                // Por ahora solo mostramos un log
                console.log('El token está próximo a expirar, sería ideal renovarlo');
            } catch (error) {
                console.error('Error al renovar token:', error);
            }
        }
    }

    /**
     * Maneja errores de autenticación específicos
     * @param {Error} error - Error capturado
     * @private
     */
    static _handleAuthError(error) {
        // Si es un error de autenticación, cerrar sesión
        if (error.message.includes('no autenticado') || 
            error.message.includes('token') || 
            error.message.includes('no autorizado')) {
            this.logout();
        }
    }
}