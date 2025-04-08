async function fetchPlaces() {
    try {
        const response = await fetch('https://cityvibess.bsite.net/api/Places/');
        if (!response.ok) {
            throw new Error('Error al obtener los lugares');
        }

        const places = await response.json();

        // Obtener averageRating por cada lugar y reemplazar Rating original
        const placesWithRatings = await Promise.all(
            places.map(async place => {
                try {
                    const ratingResponse = await fetch(`https://cityvibess.bsite.net/api/Reviews/AverageRating/${place.Id_Place}`);
                    if (!ratingResponse.ok) {
                        throw new Error(`Error al obtener el rating del lugar ${place.Id_Place}`);
                    }

                    const averageRatingData = await ratingResponse.json();
                    return {
                        ...place,
                        Rating: averageRatingData.averageRating ?? 'N/A'
                    };
                } catch (err) {
                    console.warn(`Fallo al obtener rating para el lugar ${place.Id_Place}:`, err);
                    return {
                        ...place,
                        Rating: 'N/A'
                    };
                }
            })
        );

        displayPlaces(placesWithRatings);
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
