// Controlador para la página de perfil
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!profileService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Referencias a elementos del DOM
    const userNameElement = document.getElementById('userName');
    const userBioElement = document.getElementById('userBio');
    const userAvatarElement = document.getElementById('userAvatar');
    const visitCountElement = document.getElementById('visitCount');
    const reviewCountElement = document.getElementById('reviewCount');
    const placeCountElement = document.getElementById('placeCount');
    const badgeCountElement = document.getElementById('badgeCount');
    const favoriteCategoriesContainer = document.getElementById('favoriteCategories');
    const userPlacesContainer = document.getElementById('userPlaces');
    const recentActivityContainer = document.getElementById('recentActivity');
    const backButton = document.querySelector('.back-button');
    const editProfileBtn = document.getElementById('editProfileBtn');

    // Botón para volver atrás
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.back();
        });
    }

    // Botón para editar perfil
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            window.location.href = 'settings.html';
        });
    }

    // Cargar datos del perfil
    try {
        const profileData = await profileService.getFullProfileData();
        updateProfileUI(profileData);
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        showError('No se pudo cargar la información del perfil');
    }

    // Función para actualizar la UI con los datos del perfil
    function updateProfileUI(data) {
        // Información básica - Usamos el método específico para obtener el username
        if (userNameElement) userNameElement.textContent = profileService.getUsername();
        if (userBioElement) userBioElement.textContent = data.bio || 'Sin biografía';
        if (userAvatarElement && data.avatar) userAvatarElement.src = data.avatar;

        // Estadísticas
        if (visitCountElement) visitCountElement.textContent = data.stats?.visitCount || 0;
        if (reviewCountElement) reviewCountElement.textContent = data.stats?.reviewCount || 0;
        if (placeCountElement) placeCountElement.textContent = data.stats?.placeCount || 0;
        if (badgeCountElement) badgeCountElement.textContent = data.stats?.badgeCount || 0;

        // Categorías favoritas
        if (favoriteCategoriesContainer) {
            if (data.categories && data.categories.length > 0) {
                favoriteCategoriesContainer.innerHTML = data.categories.map(category => `
                    <div class="category-item">
                        <div class="category-icon">${category.icon}</div>
                        <span class="category-name">${category.name}</span>
                    </div>
                `).join('');
            } else {
                favoriteCategoriesContainer.innerHTML = '<div class="no-data">No hay categorías favoritas</div>';
            }
        }

        // Lugares del usuario
        if (userPlacesContainer) {
            if (data.favorites && data.favorites.length > 0) {
                userPlacesContainer.innerHTML = data.favorites.map(place => `
                    <div class="place-card">
                        <h4>${place.name}</h4>
                        <div class="place-meta">
                            <span class="place-category">${place.category}</span>
                        </div>
                    </div>
                `).join('');
            } else {
                userPlacesContainer.innerHTML = '<div class="no-data">No has agregado lugares</div>';
            }
        }

        // Actividad reciente
        if (recentActivityContainer) {
            if (data.recentActivity && data.recentActivity.length > 0) {
                recentActivityContainer.innerHTML = data.recentActivity.map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon">${getActivityIcon(activity.type)}</div>
                        <div class="activity-content">
                            <p>${getActivityMessage(activity)}</p>
                            <span class="activity-date">${formatDate(activity.date)}</span>
                        </div>
                    </div>
                `).join('');
            } else {
                recentActivityContainer.innerHTML = '<div class="no-data">No hay actividad reciente</div>';
            }
        }
    }

    // Utilidades
    function getActivityIcon(type) {
        const icons = {
            review: '📝',
            badge: '🏅',
            place: '📍',
            like: '❤️'
        };
        return icons[type] || '📌';
    }

    function getActivityMessage(activity) {
        switch (activity.type) {
            case 'review':
                return `Reseñó ${activity.place}`;
            case 'badge':
                return `Desbloqueó la insignia ${activity.badge}`;
            case 'place':
                return `Agregó ${activity.place}`;
            case 'like':
                return `Le gustó ${activity.place}`;
            default:
                return activity.message || 'Actividad desconocida';
        }
    }

    function formatDate(date) {
        // Si es una fecha válida, formatearla
        if (date && (date instanceof Date || typeof date === 'string')) {
            return new Date(date).toLocaleDateString();
        }
        return 'Fecha desconocida';
    }

    function showError(message) {
        // Crear un elemento para mostrar el error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        // Agregarlo al DOM
        const content = document.querySelector('.content');
        if (content) {
            content.prepend(errorDiv);
        }
    }
});