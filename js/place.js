async function fetchPlaces() {
    try {
        const response = await fetch('https://cityvibess.bsite.net/api/Places/api/places');
        if (!response.ok) {
            throw new Error('Error al obtener los lugares');
        }
        const places = await response.json();
        displayPlaces(places);
    } catch (error) {
        console.error('Error al cargar los lugares:', error);
        document.getElementById('initialMessage').innerText = 'Error al cargar lugares.';
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('categoryResults');
    placesList.innerHTML = '';

    if (places.length === 0) {
        placesList.innerHTML = '<p>No hay lugares disponibles.</p>';
        return;
    }

    places.forEach(place => {
        const placeElement = document.createElement('div');
        placeElement.classList.add('place-item');
        placeElement.innerHTML = `
            <h3 class="place-name">${place.Name}</h3>
            <p class="place-category">Categoría: ${place.Category}</p>
            <p class="place-city">Ciudad: ${place.City}</p>
            <p class="place-rating">Calificación: ${place.Rating}</p>
            <p class="place-address">Ubicación: <a href="https://www.google.com/maps?q=${place.Latitude},${place.Longitude}" target="_blank">Ver en el mapa</a></p>
            <p class="place-created">Fecha de creación: ${new Date(place.Creation_Date).toLocaleDateString()}</p>
        `;
        
        placeElement.addEventListener('click', () => {
            window.location.href = `lugar.html?id=${place.Id_Place}`;
        });
        
        placesList.appendChild(placeElement);
    });

    document.getElementById('loadingIndicator').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loadingIndicator').style.display = 'block';
    fetchPlaces();
});
