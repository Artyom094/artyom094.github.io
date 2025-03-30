/**
 * Controlador para la página de login/registro
 * Maneja la lógica de la interfaz de usuario para autenticación
 */
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    const messageDiv = document.querySelector('.auth-message');
    
    // Verificar si ya hay una sesión activa
    if (AuthService.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Manejo de pestañas (login/registro)
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector(`.auth-form#${tab.dataset.tab}Form`).classList.add('active');
            
            // Limpiar mensajes al cambiar de pestaña
            hideMessage();
        });
    });

    // Manejar envío del formulario de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener datos del formulario
        const email = loginForm.email.value.trim();
        const password = loginForm.password.value;
        const remember = loginForm.remember?.checked || false;

        // Validaciones básicas
        if (!email || !password) {
            showMessage('Por favor completa todos los campos', 'error');
            return;
        }

        try {
            showMessage('Iniciando sesión...', 'info');
            
            // Llamar al servicio de autenticación
            const userData = await AuthService.login(email, password);
            
            // Si el login es exitoso, redirigir
            showMessage('Inicio de sesión exitoso', 'success');
            
            // Si el usuario marcó "recordar sesión", podríamos aumentar el tiempo de expiración
            // Esta funcionalidad dependerá de cómo esté implementada tu API
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            console.error('Error de login:', error);
            showMessage(error.message || 'Error al iniciar sesión', 'error');
        }
    });

    // Manejar envío del formulario de registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar contraseñas
        if (!validatePasswords()) {
            showMessage('Las contraseñas no coinciden', 'error');
            return;
        }

        // Validar términos y condiciones
        if (!registerForm.terms.checked) {
            showMessage('Debes aceptar los términos y condiciones', 'error');
            return;
        }

        // Recopilar datos del formulario
        const userData = {
            username: registerForm.username.value.trim(),
            email: registerForm.email.value.trim(),
            password: registerForm.password.value
        };

        try {
            showMessage('Creando cuenta...', 'info');
            
            // Llamar al servicio de registro
            await AuthService.register(userData);
            
            showMessage('Cuenta creada exitosamente', 'success');
            
            // Redirigir después de un breve retardo
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } catch (error) {
            console.error('Error de registro:', error);
            showMessage(error.message || 'Error al crear la cuenta', 'error');
        }
    });

    // Validación de contraseñas en tiempo real
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    function validatePasswords() {
        if (!password.value || !confirmPassword.value) return false;
        
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity('Las contraseñas no coinciden');
            return false;
        }
        
        confirmPassword.setCustomValidity('');
        return true;
    }

    // Eventos para validar contraseñas en tiempo real
    password.addEventListener('input', validatePasswords);
    confirmPassword.addEventListener('input', validatePasswords);

    // Toggle para mostrar/ocultar contraseñas
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            button.textContent = input.type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });

    // Validación del nombre de usuario en tiempo real
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('input', (e) => {
            const username = e.target.value;
            const isValid = /^[a-zA-Z0-9_]{3,15}$/.test(username);
            
            if (isValid) {
                usernameInput.setCustomValidity('');
                usernameInput.classList.remove('invalid');
                usernameInput.classList.add('valid');
            } else {
                usernameInput.setCustomValidity('El nombre de usuario debe tener entre 3 y 15 caracteres y solo puede contener letras, números y guiones bajos');
                usernameInput.classList.remove('valid');
                usernameInput.classList.add('invalid');
            }
        });
    }

    // Función para mostrar mensajes
    function showMessage(message, type = 'info') {
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto ocultar mensajes de éxito o error después de un tiempo
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                hideMessage();
            }, 5000);
        }
    }

    // Función para ocultar mensajes
    function hideMessage() {
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
    }

    // Redirigir al inicio si hay una sesión activa
    if (AuthService.isAuthenticated()) {
        window.location.href = 'index.html';
    }
    
    // Iniciar en la pestaña de login por defecto
    authTabs[0].click();
});