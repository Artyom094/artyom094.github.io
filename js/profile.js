// Configuración de la API
const API_BASE_URL = 'https://cityvibess.bsite.net/api';

document.addEventListener('DOMContentLoaded', function() {
    // Obtener ID del usuario desde la cookie (prioriza userId o userID)
    const userId = getCookie('userId') || getCookie('userID');

    if (!userId) {
        alert('No se encontró sesión activa. Por favor, inicia sesión.');
        window.location.href = 'login.html'; // Redirigir a login si no hay sesión
        return;
    }

    // Cargar datos del usuario
    cargarPerfil(userId);

    async function cargarPerfil(userId) {
        try {
            // Solicitar los datos del usuario con el ID obtenido
            const userResponse = await fetch(`${API_BASE_URL}/Users/${userId}`);
            const userData = await userResponse.json();

            if (!userData || !userData.Id_User) {
                alert('No se pudo obtener los datos del usuario');
                return;
            }

            // Actualizar la interfaz con los datos del usuario
            document.getElementById('userName').textContent = userData.Username || 'Sin nombre';
            document.getElementById('userBio').textContent = userData.Bio || 'Sin biografía';
            document.getElementById('userAvatar').src = userData.Avatar || '/api/placeholder/120/120';

            // Actualizar las estadísticas
            document.getElementById('visitCount').textContent = userData.VisitCount || 0;
            document.getElementById('reviewCount').textContent = userData.Reviews.length || 0;
            document.getElementById('placeCount').textContent = userData.Places.length || 0;
            document.getElementById('badgeCount').textContent = userData.Badges.length || 0;

            // Cargar categorías favoritas
            cargarCategorias(userData.Favorites);

            // Cargar lugares agregados
            cargarLugares(userData.Places);

            // Cargar actividad reciente
            cargarActividad(userData.Activity);

        } catch (error) {
            console.error('Error al cargar el perfil:', error);
            alert('Ocurrió un error al cargar los datos del perfil');
        }
    }

    // Función para cargar categorías favoritas
    function cargarCategorias(favorites) {
        const favoriteCategoriesContainer = document.getElementById('favoriteCategories');
        favoriteCategoriesContainer.innerHTML = ''; // Limpiar contenido anterior

        if (favorites.length === 0) {
            favoriteCategoriesContainer.innerHTML = '<p>No tienes categorías favoritas.</p>';
        } else {
            favorites.forEach(category => {
                const categoryElement = document.createElement('div');
                categoryElement.classList.add('category-item');
                categoryElement.textContent = category.name;
                favoriteCategoriesContainer.appendChild(categoryElement);
            });
        }
    }

    // Función para cargar lugares agregados
    function cargarLugares(places) {
        const userPlacesContainer = document.getElementById('userPlaces');
        userPlacesContainer.innerHTML = ''; // Limpiar contenido anterior

        if (places.length === 0) {
            userPlacesContainer.innerHTML = '<p>No has agregado lugares aún.</p>';
        } else {
            places.forEach(place => {
                const placeElement = document.createElement('div');
                placeElement.classList.add('place-item');
                placeElement.textContent = place.name;
                userPlacesContainer.appendChild(placeElement);
            });
        }
    }

    // Función para cargar actividad reciente
    function cargarActividad(activity) {
        const recentActivityContainer = document.getElementById('recentActivity');
        recentActivityContainer.innerHTML = ''; // Limpiar contenido anterior

        if (activity.length === 0) {
            recentActivityContainer.innerHTML = '<p>No hay actividad reciente.</p>';
        } else {
            activity.forEach(act => {
                const activityElement = document.createElement('div');
                activityElement.classList.add('activity-item');
                activityElement.textContent = `${act.date}: ${act.action}`;
                recentActivityContainer.appendChild(activityElement);
            });
        }
    }

    // Función para obtener valor de cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
});
