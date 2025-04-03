document.addEventListener('DOMContentLoaded', function() {
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            // Confirm account deletion
            const confirmDelete = confirm("¿Estás seguro de que quieres eliminar permanentemente tu cuenta? Esta acción no se puede deshacer.");
            
            if (!confirmDelete) return;

            // Get the user ID from localStorage
            const userId = localStorage.getItem('userId');
            const authToken = localStorage.getItem('authToken');

            if (!userId || !authToken) {
                alert('No se encontró una sesión activa. Por favor, inicia sesión.');
                window.location.href = 'login.html';
                return;
            }

            // API endpoint for deleting user
            const DELETE_ACCOUNT_URL = `https://cityvibess.bsite.net/api/Users/${userId}`;

            // Send delete request
            fetch(DELETE_ACCOUNT_URL, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo eliminar la cuenta');
                }
                return response.json();
            })
            .then(data => {
                // Clear all local storage
                localStorage.removeItem('authToken');
                localStorage.removeItem('userId');
                
                // Optional: clear any other stored user data
                localStorage.removeItem('userEmail');
                localStorage.removeItem('username');

                // Show success message and redirect
                alert('Cuenta eliminada exitosamente');
                window.location.href = 'login.html';
            })
            .catch(error => {
                console.error('Error al eliminar la cuenta:', error);
                alert('Hubo un problema al eliminar tu cuenta. Por favor, intenta de nuevo.');
            });
        });
    }
});