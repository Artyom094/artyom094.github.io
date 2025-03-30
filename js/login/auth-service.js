class AuthService {
    static async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
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

            return await response.json();
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    static async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al iniciar sesión');
            }

            const userData = await response.json();
            localStorage.setItem('userToken', userData.token);
            return userData;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    static async updateProfile(userData) {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
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
            throw error;
        }
    }

    static async deleteAccount() {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/users/delete`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar cuenta');
            }

            localStorage.removeItem('userToken');
            return true;
        } catch (error) {
            console.error('Error en eliminación de cuenta:', error);
            throw error;
        }
    }

    static logout() {
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    }

    static isAuthenticated() {
        return !!localStorage.getItem('userToken');
    }
}
