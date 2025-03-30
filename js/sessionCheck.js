/**
 * Script para verificar autenticación
 * Comprueba si existe la cookie authToken y redirige a login si no existe
 */
document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener el valor de una cookie por su nombre
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    // Obtener el token de autenticación de la cookie
    const authToken = getCookie('authToken');

    // Verificar también en localStorage por si el token está almacenado allí
    const localToken = localStorage.getItem('authToken') || localStorage.getItem('userToken');

    // Verificar si estamos en la página de login o registro (para evitar loops de redirección)
    const currentPage = window.location.pathname.split('/').pop();
    const authPages = ['login.html', 'register.html'];
    
    // Si no existe el token y no estamos en una página de autenticación, redirigir a login
    if (!authToken && !localToken && !authPages.includes(currentPage)) {
        console.log('No se encontró token de autenticación. Redirigiendo a login...');
        window.location.href = 'login.html';
    }
});