// Configuración de la API
const API_BASE_URL = 'https://cityvibess.bsite.net/api';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginStatus = document.getElementById('loginStatus');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                mostrarEstado('Por favor complete todos los campos', 'error');
                return;
            }

            mostrarEstado('Iniciando sesión...', 'info');

            try {
                // 🔹 Paso 1: Enviar login a la API
                const response = await fetch(`${API_BASE_URL}/Users/Login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Email: email,
                        Password: password
                    })
                });

                console.log('Código de respuesta:', response.status);
                const userData = await response.json();
                console.log('Respuesta de la API:', userData);

                if (!userData.Success) {
                    throw new Error(userData.Message || 'Credenciales incorrectas');
                }

                // 🔹 Paso 2: Obtener todos los usuarios y el ID del usuario
                const userId = await obtenerIdUsuarioPorEmail(email);
                if (!userId) {
                    throw new Error('No se pudo obtener el ID del usuario.');
                }

                // 🔹 Paso 3: Guardar el token de sesión y el ID del usuario en LocalStorage
                localStorage.setItem('authToken', userData.Value); // Guardar el token de autenticación
                localStorage.setItem('userId', userId); // Guardar el ID del usuario

                mostrarEstado('Inicio de sesión exitoso', 'success');

                // 🔹 Paso 4: Redirigir a la página principal
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);

            } catch (error) {
                mostrarEstado(error.message || 'Error al iniciar sesión', 'error');
                console.error('Error de login:', error);
                // Si hay algún error, eliminar cualquier dato previo
                limpiarLocalStorage();
            }
        });
    }

    async function obtenerIdUsuarioPorEmail(emailBuscado) {
        try {
            const response = await fetch(`${API_BASE_URL}/Users`);
            if (!response.ok) throw new Error("Error al obtener usuarios");

            const usuarios = await response.json(); // Suponiendo que devuelve un array de usuarios
            const usuario = usuarios.find(user => user.Email === emailBuscado);

            return usuario ? usuario.Id_User : null;
        } catch (error) {
            console.error("Error al obtener el ID del usuario:", error);
            return null;
        }
    }

    function mostrarEstado(mensaje, tipo) {
        if (!loginStatus) return;
        loginStatus.textContent = mensaje;
        loginStatus.className = tipo + '-message';
        loginStatus.style.display = 'block';
        if (tipo !== 'info') {
            setTimeout(() => {
                loginStatus.style.display = 'none';
            }, 3000);
        }
    }

    // Función para limpiar LocalStorage (por ejemplo, en el logout)
    function limpiarLocalStorage() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
    }
});
