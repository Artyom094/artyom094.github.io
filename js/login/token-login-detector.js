// Script de detección de autenticación basado en token
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verificar si hay token de autenticación
        if (!authService.isAuthenticated()) {
            // No hay token válido, redirigir al login
            window.location.href = 'login.html';
            return;
        }

        // Intentar obtener la información del usuario actual
        try {
            const userData = await authService.getCurrentUser();
            
            // Actualizar interfaz con información del usuario
            updateUserInterface(userData);
        } catch (error) {
            console.error('Error al obtener información del usuario:', error);
            // Si falla la obtención de datos, hacer logout
            authService.logout();
        }
    } catch (error) {
        console.error('Error de autenticación:', error);
        // Cualquier otro error de autenticación
        window.location.href = 'login.html';
    }
});

// Función para actualizar la interfaz de usuario
function updateUserInterface(userData) {
    // Actualizar nombre de usuario
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = userData.username || 'Usuario';
    });

    // Actualizar email
    const userEmailElements = document.querySelectorAll('.user-email');
    userEmailElements.forEach(el => {
        el.textContent = userData.email || 'usuario@example.com';
    });

    // Actualizar avatar si existe
    const avatarElements = document.querySelectorAll('.avatar img, .user-avatar img');
    avatarElements.forEach(el => {
        el.src = userData.avatarUrl || '/api/placeholder/40/40';
    });

    // Puedes agregar más actualizaciones según los datos del usuario
}

// Botón de logout
document.querySelectorAll('.logout-btn, .logout').forEach(logoutElement => {
    logoutElement.addEventListener('click', (e) => {
        e.preventDefault();
        authService.logout();
    });
});
