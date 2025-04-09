// Variables de la paginación y filtros
let currentPage = 1;
const itemsPerPage = 5;
let places = []; // Aquí irán los lugares filtrados

// Función para cargar lugares
async function fetchPlaces() {
    const response = await fetch('https://cityvibess.bsite.net/api/Places/');
    if (!response.ok) {
        console.error('Error al obtener lugares');
        return;
    }

    places = await response.json();
    fetchRecommendations(); // Llamamos a las recomendaciones cuando cargamos los lugares
    fetchFilteredPlaces();   // Llamamos a la función de filtrado
}

// Función para cargar las recomendaciones de la semana
async function fetchRecommendations() {
    const recommendedIds = [3, 4, 5, 6, 7]; // IDs de lugares recomendados (fijos)
    const recommendedPlaces = [];

    for (const id of recommendedIds) {
        const response = await fetch(`https://cityvibess.bsite.net/api/Places/${id}`);
        if (response.ok) {
            const place = await response.json();
            recommendedPlaces.push(place);
        }
    }

    displayRecommendations(recommendedPlaces); // Mostrar las recomendaciones
}

// Función para mostrar las recomendaciones
function displayRecommendations(places) {
    const recommendationsSection = document.getElementById('recommendedPlaces');
    recommendationsSection.innerHTML = '';

    if (places.length === 0) {
        recommendationsSection.innerHTML = '<p>No hay recomendaciones disponibles.</p>';
        return;
    }

    places.forEach(async (place) => {
        // Obtener promedio de reseñas
        const averageRating = await fetchAverageRating(place.Id_Place);

        const placeElement = document.createElement('div');
        placeElement.classList.add('recommendation-item');
        placeElement.innerHTML = `
            <h3 class="place-name">${place.Name}</h3>
            <p class="place-category">Categoría: ${place.Category}</p>
            <p class="place-city">Ciudad: ${place.City}</p>
            <p class="place-rating">Calificación: ${averageRating.toFixed(2)}</p>
            <p class="place-created">Fecha de creación: ${new Date(place.Creation_Date).toLocaleDateString()}</p>
        `;

        placeElement.addEventListener('click', () => {
            window.location.href = `lugar.html?id=${place.Id_Place}`;
        });

        recommendationsSection.appendChild(placeElement);
    });
}

// Función para obtener el promedio de reseñas
async function fetchAverageRating(placeId) {
    try {
        const response = await fetch(`https://cityvibess.bsite.net/api/Reviews/AverageRating/${placeId}`);
        if (!response.ok) {
            console.error(`Error al obtener el promedio de reseñas para el lugar con ID ${placeId}`);
            return 0; // Si hay un error, retornar 0
        }
        const data = await response.json();
        return data.averageRating; // Regresar el promedio de reseñas
    } catch (error) {
        console.error(`Error al obtener el promedio de reseñas para el lugar con ID ${placeId}:`, error);
        return 0;
    }
}

// Función para aplicar filtros y búsqueda
async function fetchFilteredPlaces() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;
    const ratingFilter = document.getElementById('ratingFilter').value;
    const sortBy = document.getElementById('sortBy').value;

    let filteredPlaces = places;

    // Filtrar por búsqueda de nombre
    if (searchQuery) {
        filteredPlaces = filteredPlaces.filter(place => place.Name.toLowerCase().includes(searchQuery));
    }

    // Filtrar por categoría
    if (categoryFilter) {
        filteredPlaces = filteredPlaces.filter(place => place.Category === categoryFilter);
    }

    // Filtrar por ciudad
    if (cityFilter) {
        filteredPlaces = filteredPlaces.filter(place => place.City === cityFilter);
    }

    // Filtrar por rating
    if (ratingFilter) {
        filteredPlaces = filteredPlaces.filter(place => place.Rating >= ratingFilter);
    }

    // Ordenar por fecha
    if (sortBy === 'newest') {
        filteredPlaces.sort((a, b) => new Date(b.Creation_Date) - new Date(a.Creation_Date));
    } else if (sortBy === 'oldest') {
        filteredPlaces.sort((a, b) => new Date(a.Creation_Date) - new Date(b.Creation_Date));
    }

    // Paginación
    const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
    const paginatedPlaces = filteredPlaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    displayPlaces(paginatedPlaces);

    // Actualizar paginación
    document.getElementById('pageNumber').textContent = `Página ${currentPage} de ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Mostrar los lugares filtrados
async function displayPlaces(places) {
    const placesList = document.getElementById('categoryResults');
    placesList.innerHTML = '';

    if (places.length === 0) {
        placesList.innerHTML = '<p>No hay lugares disponibles.</p>';
        return;
    }

    for (const place of places) {
        // Obtener promedio de reseñas
        const averageRating = await fetchAverageRating(place.Id_Place);

        const placeElement = document.createElement('div');
        placeElement.classList.add('place-item');
        placeElement.innerHTML = `
            <h3 class="place-name">${place.Name}</h3>
            <p class="place-category">Categoría: ${place.Category}</p>
            <p class="place-city">Ciudad: ${place.City}</p>
            <p class="place-rating">Calificación: ${averageRating.toFixed(2)}</p>
            <p class="place-created">Fecha de creación: ${new Date(place.Creation_Date).toLocaleDateString()}</p>
        `;

        placeElement.addEventListener('click', () => {
            window.location.href = `lugar.html?id=${place.Id_Place}`;
        });

        placesList.appendChild(placeElement);
    }
}

// Función para la paginación
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchFilteredPlaces();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    fetchFilteredPlaces();
});

// Activar búsqueda y filtros
document.getElementById('searchInput').addEventListener('input', fetchFilteredPlaces);
document.getElementById('categoryFilter').addEventListener('change', fetchFilteredPlaces);
document.getElementById('cityFilter').addEventListener('change', fetchFilteredPlaces);
document.getElementById('ratingFilter').addEventListener('change', fetchFilteredPlaces);
document.getElementById('sortBy').addEventListener('change', fetchFilteredPlaces);

// Cargar lugares al inicio
document.addEventListener('DOMContentLoaded', fetchPlaces);
