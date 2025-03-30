document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (let cookie of cookies) {
            let [key, value] = cookie.split('=');
            if (key === name) {
                return value;
            }
        }
        return null;
    }

    const userId = getCookie('userId');
    
    if (!userId) {
        // No hay sesión activa, redirigir al login
        window.location.href = 'login.html';
    }
});