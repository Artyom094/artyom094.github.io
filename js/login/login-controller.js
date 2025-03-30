document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    const messageDiv = document.querySelector('.auth-message');

    // Manejo de pestañas de autenticación
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector(`.auth-form#${tab.dataset.tab}Form`).classList.add('active');
        });
    });

    // Manejo del login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
            showMessage('Iniciando sesión...', 'info');
            await AuthService.login(email, password);
            window.location.href = 'index.html';
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    // Manejo del registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validatePasswords()) {
            showMessage('Las contraseñas no coinciden', 'error');
            return;
        }

        const formData = new FormData(registerForm);
        try {
            showMessage('Creando cuenta...', 'info');
            await AuthService.register(Object.fromEntries(formData));
            showMessage('Cuenta creada exitosamente', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    // Validación de contraseñas
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    function validatePasswords() {
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity('Las contraseñas no coinciden');
            return false;
        }
        confirmPassword.setCustomValidity('');
        return true;
    }

    password.addEventListener('change', validatePasswords);
    confirmPassword.addEventListener('change', validatePasswords);

    // Mostrar/ocultar contraseñas
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            button.textContent = input.type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });

    function showMessage(message, type = 'info') {
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    }

    // Validación del nombre de usuario
    const usernameInput = document.getElementById('username');
    usernameInput.addEventListener('input', (e) => {
        const username = e.target.value;
        const isValid = /^[a-zA-Z0-9_]{3,15}$/.test(username);

        if (isValid) {
            usernameInput.setCustomValidity('');
        } else {
            usernameInput.setCustomValidity('El nombre de usuario debe tener entre 3 y 15 caracteres y solo puede contener letras, números y guiones bajos');
        }
    });
});
// Fin del archivo
// Este archivo contiene el controlador para la autenticación de usuarios