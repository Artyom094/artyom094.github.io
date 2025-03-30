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

                // 🔹 Paso 3: Guardar el token de sesión en una cookie sin expiración
                document.cookie = `authToken=${userData.Value}; path=/;`;// Guardar el token de autenticación

                // También guardar el ID del usuario en una cookie
                document.cookie = `userId=${userId}; path=/;`;

                mostrarEstado('Inicio de sesión exitoso', 'success');

                // 🔹 Paso 4: Mostrar el ID en un alert

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);

            } catch (error) {
                mostrarEstado(error.message || 'Error al iniciar sesión', 'error');
                console.error('Error de login:', error);
                // Si hay algún error, eliminar cualquier cookie previa
                eliminarCookies();
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

    // Función para eliminar las cookies (por ejemplo, en el logout)
    function eliminarCookies() {
        document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
});
