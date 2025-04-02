// Configuración API base
const API_BASE_URL = 'https://cityvibess.bsite.net/api';

// Servicio para manejo de registro
const registerService = {
    // Register - función para registrar nuevos usuarios
    async register(userData) {
        try {
            console.log("Intentando registro con:", userData.username, userData.email);
            
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Username: userData.username,
                    Email: userData.email,
                    Password: userData.password
                })
            });

            console.log("Respuesta registro:", response.status, response.statusText);

            if (!response.ok) {
                let errorMessage = 'Registro Exitoso*';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    const errorText = await response.text();
                    if (errorText) errorMessage = errorText;
                }
                console.error("Error en registro:", errorMessage);
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            console.log("Registro exitoso:", responseData);
            
            // Si el registro devuelve un token (login automático), guardarlo
            if (responseData.token) {
                localStorage.setItem('userToken', responseData.token);
                if (responseData.id) localStorage.setItem('userId', responseData.id);
                if (responseData.email) localStorage.setItem('userEmail', responseData.email);
                if (responseData.username) localStorage.setItem('username', responseData.username);
            }

            return responseData;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    },
    
    // Verificación de disponibilidad de nombre de usuario
    async checkUsernameAvailability(username) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/usernames`, {
                method: 'GET'
            });
            
            if (!response.ok) {
                throw new Error('Error al verificar disponibilidad');
            }
            
            const usernames = await response.json();
            return !usernames.includes(username);
        } catch (error) {
            console.error('Error al verificar username:', error);
            // Si hay error, asumimos que está disponible para no bloquear el registro
            return true;
        }
    },
    
    // Verificación de disponibilidad de email
    async checkEmailAvailability(email) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/emails`, {
                method: 'GET'
            });
            
            if (!response.ok) {
                throw new Error('Error al verificar disponibilidad');
            }
            
            const emails = await response.json();
            return !emails.includes(email);
        } catch (error) {
            console.error('Error al verificar email:', error);
            // Si hay error, asumimos que está disponible para no bloquear el registro
            return true;
        }
    }
};

// Controlador para la página de registro
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.querySelector('.auth-message');
    
    // Verificar si hay un servicio de login disponible para la autenticación
    const isAuthenticated = typeof loginService !== 'undefined' ? 
        loginService.isAuthenticated() : 
        !!localStorage.getItem('userToken');
        
    // Si ya está autenticado, redirigir
    if (isAuthenticated) {
        window.location.href = 'index.html';
        return;
    }

    // Manejo del formulario de registro
    if (registerForm) {
        // Elementos de formulario
        const passwordInput = document.getElementById('registerPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('registerEmail');
        
        // Validación de nombre de usuario (si existe el campo)
        if (usernameInput) {
            usernameInput.addEventListener('blur', async (e) => {
                const username = e.target.value.trim();
                if (username.length >= 3) {
                    try {
                        const isAvailable = await registerService.checkUsernameAvailability(username);
                        if (!isAvailable) {
                            usernameInput.setCustomValidity('Este nombre de usuario ya está en uso');
                            showMessage('Este nombre de usuario ya está en uso', 'error');
                        } else {
                            usernameInput.setCustomValidity('');
                        }
                    } catch (error) {
                        console.error('Error al verificar username:', error);
                    }
                }
            });

            // Validación del formato del nombre de usuario
            usernameInput.addEventListener('input', (e) => {
                const username = e.target.value;
                const isValid = /^[a-zA-Z0-9_]{3,15}$/.test(username);
                
                if (isValid) {
                    usernameInput.setCustomValidity('');
                } else {
                    usernameInput.setCustomValidity('El nombre de usuario debe tener entre 3 y 15 caracteres y solo puede contener letras, números y guiones bajos');
                }
            });
        }
        
        // Validación de email (si existe el campo)
        if (emailInput) {
            emailInput.addEventListener('blur', async (e) => {
                const email = e.target.value.trim();
                if (email && email.includes('@')) {
                    try {
                        const isAvailable = await registerService.checkEmailAvailability(email);
                        if (!isAvailable) {
                            emailInput.setCustomValidity('Este email ya está registrado');
                            showMessage('Este email ya está registrado', 'error');
                        } else {
                            emailInput.setCustomValidity('');
                        }
                    } catch (error) {
                        console.error('Error al verificar email:', error);
                    }
                }
            });
        }
        
        // Validación de contraseñas
        function validatePasswords() {
            if (!passwordInput || !confirmPasswordInput) return true;
            
            if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.setCustomValidity('Las contraseñas no coinciden');
                return false;
            }
            confirmPasswordInput.setCustomValidity('');
            return true;
        }
        
        if (passwordInput && confirmPasswordInput) {
            passwordInput.addEventListener('input', validatePasswords);
            confirmPasswordInput.addEventListener('input', validatePasswords);
        }

        // Envío del formulario
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validar contraseñas
            if (!validatePasswords()) {
                showMessage('Las contraseñas no coinciden', 'error');
                return;
            }

            // Verificar términos y condiciones si existe el checkbox
            const termsCheckbox = registerForm.querySelector('[name="terms"]');
            if (termsCheckbox && !termsCheckbox.checked) {
                showMessage('Debes aceptar los términos y condiciones', 'error');
                return;
            }

            // Recopilar datos del formulario
            const formData = new FormData(registerForm);
            try {
                showMessage('Creando cuenta...', 'info');
                await registerService.register(Object.fromEntries(formData));
                showMessage('Cuenta creada exitosamente', 'success');
                
                // Redirigir después de un breve retardo
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                showMessage(error.message || 'Error al crear la cuenta', 'error');
            }
        });
    }

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            button.textContent = input.type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });

    // Función para mostrar mensajes
    function showMessage(message, type = 'info') {
        if (!messageDiv) return;
        
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    }
});