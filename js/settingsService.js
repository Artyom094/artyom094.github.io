document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem("userId"); // Obtén el ID de usuario desde localStorage
    const settingsUsername = document.getElementById("settingsUsername");
    const settingsEmail = document.getElementById("settingsEmail");
    const userUsername = document.getElementById("userUsername");
    const userEmail = document.getElementById("userEmail");
    const personalInfoForm = document.getElementById("personalInfoForm");
    const passwordChangeForm = document.getElementById("passwordChangeForm");

    // Obtener los datos del usuario al cargar la página
    async function fetchUserData() {
        try {
            const response = await fetch('https://cityvibess.bsite.net/api/Users');
            if (!response.ok) throw new Error("Error al obtener los datos del usuario");

            const usersData = await response.json();
            console.log("Datos de usuarios:", usersData);

            const user = usersData.find(u => u.Id_User === parseInt(userId));
            if (!user) throw new Error("Usuario no encontrado.");

            document.getElementById("userUsername").textContent = user.Username;
            document.getElementById("userEmail").textContent = user.Email;

            document.getElementById("settingsUsername").value = user.Username;
            document.getElementById("settingsEmail").value = user.Email;

        } catch (error) {
            console.error("Error:", error);
            alert("No se pudieron cargar los datos del usuario.");
        }
    }

    fetchUserData();

    // Función para actualizar los datos del usuario (nombre de usuario y email)
    async function updateUser() {
        const username = settingsUsername.value.trim();
        const email = settingsEmail.value.trim();

        // Verificar que los campos no estén vacíos
        if (username === "" || email === "") {
            alert("El nombre de usuario y el correo electrónico son obligatorios.");
            return;
        }

        try {
            const response = await fetch(`https://cityvibess.bsite.net/api/Users/UpdateUser?id=${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "Username": username,
                    "Email": email,
                    "Password": ""  // Mantener vacío el campo de contraseña
                }),
            });

            if (response.ok) {
                alert("Datos actualizados correctamente.");
                userUsername.textContent = username;
                userEmail.textContent = email;
            } else {
                alert("Error al actualizar los datos. Intente de nuevo.");
            }
        } catch (error) {
            console.error("Error al actualizar los datos:", error);
            alert("Error al intentar actualizar los datos.");
        }
    }

    // Función para actualizar la contraseña
    async function updatePassword() {
        const currentPassword = document.getElementById("currentPassword").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim();

        // Verificar que las contraseñas no estén vacías
        if (currentPassword === "" || newPassword === "" || confirmNewPassword === "") {
            alert("Todos los campos de contraseña son obligatorios.");
            return;
        }

        // Verificar que las contraseñas coincidan
        if (newPassword !== confirmNewPassword) {
            alert("Las nuevas contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch(`https://cityvibess.bsite.net/api/Users/UpdateUser?id=${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "Username": "", // Mantener vacío el campo de nombre de usuario
                    "Email": "", // Mantener vacío el campo de email
                    "Password": newPassword  // Cambiar solo la contraseña
                }),
            });

            if (response.ok) {
                alert("Contraseña actualizada correctamente.");
            } else {
                alert("Error al actualizar la contraseña. Intente de nuevo.");
            }
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            alert("Error al intentar actualizar la contraseña.");
        }
    }

    // Escuchar el evento de envío del formulario de información personal
    personalInfoForm.addEventListener("submit", function (event) {
        event.preventDefault();
        updateUser(); // Llamar a la función para actualizar el usuario
    });

    // Escuchar el evento de envío del formulario de cambio de contraseña
    passwordChangeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        updatePassword(); // Llamar a la función para actualizar la contraseña
    });

    // Llamar a la función para cargar los datos del usuario al inicio
    fetchUserData();
});