document.addEventListener("DOMContentLoaded", async function () {
    // Obtener la ID del usuario desde la cookie
    const userId = getCookie("userid");

    // Verificar si se obtuvo el userId
    if (!userId) {
        console.log("No se encontró la cookie de usuario.");
        return;
    }

    try {
        // Realizar la solicitud GET a la API para obtener los datos de los usuarios
        const response = await fetch("https://cityvibess.bsite.net/api/Users");
        if (!response.ok) throw new Error("Error al obtener los datos del usuario");

        // Obtener la lista de usuarios
        const usersData = await response.json();
        console.log("Datos de usuarios:", usersData);

        // Buscar el usuario correspondiente con el userId de la cookie
        const user = usersData.find(u => u.Id_User === parseInt(userId));

        if (user) {
            // Si el usuario existe, obtener el nombre de usuario
            const username = user.Username || "Invitado";  // Si no tiene username, asignamos "Invitado"

            // Mostrar el nombre del usuario en el DOM
            document.getElementById("userName").textContent = username;

            // Generar URL de DiceBear utilizando el username y el estilo Pixel Art
            const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(username)}`;

            // Asignar la URL generada al <img> con id "userAvatar"
            document.getElementById("userAvatar").src = avatarUrl;
        } else {
            console.log("No se encontró un usuario con ese ID.");
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        alert("No se pudieron cargar los datos del usuario.");
    }
});

// Función para obtener el valor de una cookie por su nombre
function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
}
