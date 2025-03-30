// Configuración de la API
const API_BASE_URL = 'https://cityvibess.bsite.net/api';

// Servicio para manejar la información del perfil de usuario
const profileService = {
    // Verificar si hay un usuario autenticado
    isAuthenticated() {
        return localStorage.getItem('authToken') !== null;
    },

    // Obtener datos del perfil del localStorage
    getBasicProfileData() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            return JSON.parse(userData);
        }
        return null;
    },
    
    // Obtener específicamente el username del localStorage
    getUsername() {
        const userData = this.getBasicProfileData();
        // Intentamos obtener el username específico si existe
        if (userData && userData.username) {
            return userData.username;
        }
        // Si no hay username específico, intentamos usar el nombre
        if (userData && userData.name) {
            return userData.name;
        }
        // Como último recurso, verificamos si hay un username almacenado directamente
        const username = localStorage.getItem('username');
        if (username) {
            return username;
        }
        // Si todo falla, devolvemos un valor predeterminado
        return 'Usuario';
    },

    // Obtener datos completos del perfil (simulado)
    async getFullProfileData() {
        // Verificamos autenticación
        if (!this.isAuthenticated()) {
            throw new Error('Usuario no autenticado');
        }

        try {
            // Usamos los datos básicos como base
            const basicData = this.getBasicProfileData() || {};
            
            // Agregamos datos adicionales simulados
            // En una implementación real, aquí haríamos una llamada a la API
            // usando el token almacenado en localStorage
            
            return {
                ...basicData,
                username: this.getUsername(),
                bio: 'Amante de la buena comida y los lugares interesantes.',
                stats: {
                    visitCount: Math.floor(Math.random() * 50),
                    reviewCount: Math.floor(Math.random() * 20),
                    placeCount: Math.floor(Math.random() * 10),
                    badgeCount: Math.floor(Math.random() * 5)
                },
                categories: [
                    { id: 1, name: 'Restaurantes', icon: '🍽️' },
                    { id: 2, name: 'Bares', icon: '🍸' },
                    { id: 3, name: 'Cafeterías', icon: '☕' }
                ],
                favorites: [
                    { id: 1, name: 'La Cueva del Oso', category: 'Restaurantes' },
                    { id: 2, name: 'Café del Centro', category: 'Cafeterías' }
                ],
                recentActivity: [
                    { type: 'review', place: 'La Cueva del Oso', date: new Date(Date.now() - 86400000 * 2) },
                    { type: 'badge', badge: 'Explorador Nivel 1', date: new Date(Date.now() - 86400000 * 5) },
                    { type: 'place', place: 'Bar La Herradura', date: new Date(Date.now() - 86400000 * 7) }
                ]
            };
        } catch (error) {
            console.error('Error al obtener datos del perfil:', error);
            throw error;
        }
    },

    // Método para simular actualización de perfil
    async updateProfile(profileData) {
        // En una implementación real, enviaríamos estos datos a la API
        console.log('Actualizando perfil con:', profileData);
        
        // Actualizamos los datos en localStorage para mantener la simulación
        const currentData = this.getBasicProfileData() || {};
        const updatedData = { ...currentData, ...profileData };
        
        localStorage.setItem('userData', JSON.stringify(updatedData));
        return updatedData;
    },

    // Cerrar sesión
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('rememberSession');
        window.location.href = 'login.html';
    }
};  