// Función para obtener las recomendaciones de la semana
async function fetchRecommendedPlaces() {
    try {
        const recommendedIds = [3, 4, 5, 6, 7]; // IDs entre 3 y 13 seleccionados al azar
        const recommendedPlaces = await Promise.all(recommendedIds.map(async (id) => {
            const response = await fetch(`https://cityvibess.bsite.net/api/Places/${id}`);
            if (!response.ok) throw new Error('Error al obtener lugar recomendado');
            return await response.json();
        }));

        const recommendedPlacesList = document.getElementById('recommendedPlaces');
        recommendedPlacesList.innerHTML = ''; // Limpiar lista anterior

        recommendedPlaces.forEach(place => {
            const placeElement = document.createElement('div');
            placeElement.classList.add('place-item');
            placeElement.innerHTML = `
                <img src="img/category-${place.Category}.jpg" alt="${place.Category}" class="place-image">
                <h3 class="place-name">${place.Name}</h3>
                <p class="place-category">Categoría: ${place.Category}</p>
                <p class="place-city">Ciudad: ${place.City}</p>
                <p class="place-rating">Calificación: ${place.Rating}</p>
                <p class="place-created">Fecha de creación: ${new Date(place.Creation_Date).toLocaleDateString()}</p>
            `;
            recommendedPlacesList.appendChild(placeElement);
        });
    } catch (error) {
        console.error('Error al cargar las recomendaciones:', error);
    }
}

// Llamada para cargar las recomendaciones cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    fetchRecommendedPlaces(); // Cargar recomendaciones
    document.getElementById('loadingIndicator').style.display = 'block';
    fetchPlaces(); // Cargar los lugares principales
});
