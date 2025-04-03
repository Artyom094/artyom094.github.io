/**
 * Script para verificar autenticación
 * Comprueba si existe la cookie authToken o en localStorage y redirige a login si no existe
 */
document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener el valor de una cookie por su nombre
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    // Obtener el token de autenticación de la cookie o localStorage
    const authToken = getCookie('authToken');
    const localToken = localStorage.getItem('authToken') || localStorage.getItem('userToken');

    // Páginas de autenticación para evitar loops de redirección
    const currentPage = window.location.pathname.split('/').pop();
    const authPages = ['login.html', 'register.html'];

    // Si no existe el token y no estamos en una página de autenticación, redirigir a login
    if (!authToken && !localToken && !authPages.includes(currentPage)) {
        console.log('No se encontró token de autenticación. Redirigiendo a login...');
        displayErrorMessage('Sesión no válida. Redirigiendo a login...');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000); // Espera 2 segundos antes de redirigir
    }

    /**
     * Muestra un mensaje de error en la interfaz
     */
    function displayErrorMessage(message) {
        let errorDiv = document.getElementById('authError');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'authError';
            errorDiv.style.position = 'fixed';
            errorDiv.style.top = '10px';
            errorDiv.style.left = '50%';
            errorDiv.style.transform = 'translateX(-50%)';
            errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            errorDiv.style.color = '#fff';
            errorDiv.style.padding = '10px 20px';
            errorDiv.style.borderRadius = '5px';
            errorDiv.style.zIndex = '1000';
            document.body.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        setTimeout(() => errorDiv.remove(), 3000); // Elimina el mensaje después de 3 segundos
    }
});
