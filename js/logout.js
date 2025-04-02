document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');

    // Verificamos que el botón de "Cerrar sesión" esté presente
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Confirmar que el usuario quiere cerrar sesión
            const confirmLogout = confirm("¿Estás seguro de que quieres cerrar sesión?");
            if (!confirmLogout) return;

            // Eliminar el token de autenticación y el ID de usuario de LocalStorage
            localStorage.removeItem('authToken');  // Elimina el token de localStorage
            localStorage.removeItem('userId');  // Elimina el userId de localStorage

            // Redirigir al usuario a la página de inicio o login
            window.location.href = 'login.html';  // O redirige a la página de login que tengas
        });
    }
});
