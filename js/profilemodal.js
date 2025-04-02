document.addEventListener('DOMContentLoaded', () => {
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsDropdown = document.getElementById('settingsDropdown');
    const profileSettingsForm = document.getElementById('profileSettingsForm');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');

    // Alternar visibilidad del menú de configuración
    settingsToggle.addEventListener('click', () => {
        settingsDropdown.style.display = 
            settingsDropdown.style.display === 'none' ? 'block' : 'none';
    });

    // Cerrar menú si se hace clic fuera
    document.addEventListener('click', (e) => {
        if (!settingsToggle.contains(e.target) && 
            !settingsDropdown.contains(e.target)) {
            settingsDropdown.style.display = 'none';
        }
    });

    // Manejar envío del formulario de configuración
    profileSettingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validaciones
        const username = document.getElementById('settingsUsername').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        // Validar nombre de usuario
        if (username.length < 3 || username.length > 15) {
            alert('El nombre de usuario debe tener entre 3 y 15 caracteres');
            return;
        }

        // Validar contraseñas si se intenta cambiar
        if (newPassword) {
            if (newPassword !== confirmNewPassword) {
                alert('Las nuevas contraseñas no coinciden');
                return;
            }

            if (newPassword.length < 8) {
                alert('La nueva contraseña debe tener al menos 8 caracteres');
                return;
            }
        }

        try {
            // Aquí iría la lógica de actualización del perfil
            // Por ahora, solo un mensaje de prueba
            alert('Cambios guardados correctamente');
            settingsDropdown.style.display = 'none';
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            alert('Hubo un error al guardar los cambios');
        }
    });

    // Botón de eliminar cuenta
    deleteAccountBtn.addEventListener('click', () => {
        const confirmDelete = confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
        
        if (confirmDelete) {
            try {
                // Aquí iría la lógica de eliminación de cuenta
                alert('Cuenta eliminada');
                // Redirigir a página de inicio o login
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error al eliminar cuenta:', error);
                alert('Hubo un error al eliminar la cuenta');
            }
        }
    });

    // Toggle para mostrar/ocultar contraseñas
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            button.textContent = input.type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });
});