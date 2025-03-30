// profileEdit.js

document.addEventListener('DOMContentLoaded', () => {
    const userId = getCookie('userId') || getCookie('userID');
    if (!userId) {
        alert('No se encontró sesión activa. Por favor, inicia sesión.');
        window.location.href = 'login.html';
        return;
    }

    cargarPerfil(userId);

    // Elementos del DOM
    const userName = document.getElementById('userName');
    const userBio = document.getElementById('userBio');
    const userAvatar = document.getElementById('userAvatar');
    const avatarInput = document.getElementById('avatarInput');
    const savePersonalBtn = document.getElementById('savePersonalBtn');

    // Cambiar Avatar
    function changeAvatar() {
        avatarInput.click();
    }

    avatarInput.addEventListener('change', async function () {
        const file = avatarInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);

            try {
                const response = await fetch(`${API_BASE_URL}/Users/${userId}/Avatar`, {
                    method: 'PUT',
                    body: formData
                });

                if (!response.ok) throw new Error('Error al subir la imagen');

                const data = await response.json();
                userAvatar.src = data.newAvatarUrl || userAvatar.src;
                alert('Imagen de perfil actualizada');
            } catch (error) {
                console.error('Error al actualizar avatar:', error);
            }
        }
    });

    // Guardar cambios en perfil
    savePersonalBtn.addEventListener('click', async function () {
        const updatedData = {
            Username: userName.textContent.trim(),
            Bio: userBio.textContent.trim(),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/Users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('Error al actualizar perfil');

            alert('Perfil actualizado correctamente');
            savePersonalBtn.style.display = 'none'; // Oculta el botón después de guardar
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            alert('Hubo un error al guardar los cambios');
        }
    });

    // Función para obtener las cookies
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Cargar perfil (datos de ejemplo o API)
    async function cargarPerfil(id) {
        const response = await fetch(`${API_BASE_URL}/Users/${id}`);
        const data = await response.json();
        userName.textContent = data.username;
        userBio.textContent = data.bio;
        userAvatar.src = data.avatarUrl || '/api/placeholder/120/120';
    }
});
