document.addEventListener('DOMContentLoaded', function() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewsApiUrl = 'https://cityvibess.bsite.net/api/Reviews';
    const usersApiUrl = 'https://cityvibess.bsite.net/api/Users';
    const placesApiUrl = 'https://cityvibess.bsite.net/api/Places';  // Asumimos que esta API devuelve los lugares.

    // Cargar las últimas reseñas
    loadReviews();

    async function loadReviews() {
        try {
            const reviewsResponse = await fetch(reviewsApiUrl);
            const usersResponse = await fetch(usersApiUrl);
            const placesResponse = await fetch(placesApiUrl);

            if (!reviewsResponse.ok || !usersResponse.ok || !placesResponse.ok) {
                throw new Error('Error al cargar las reseñas, usuarios o lugares.');
            }

            const reviews = await reviewsResponse.json();
            const users = await usersResponse.json();
            const places = await placesResponse.json();

            displayReviews(reviews, users, places);
        } catch (error) {
            console.error(error);
            showError('No se pudieron cargar las reseñas');
        }
    }

    function displayReviews(reviews, users, places) {
        reviewsContainer.innerHTML = '';  // Limpiar el contenedor de reseñas

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>No hay reseñas disponibles.</p>';
            return;
        }

        reviews.forEach(review => {
            const user = users.find(u => u.Id_User === review.Id_User);
            const place = places.find(p => p.Id_Place === review.Id_Place);
            const username = user ? user.Username : 'Usuario desconocido';
            const placeName = place ? place.Name : 'Lugar no encontrado';
            const placeLink = place ? `lugar.html?id=${place.Id_Place}` : '#';

            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review-item');

            reviewElement.innerHTML = `
                <div class="review-header">
                    <span class="review-rating">⭐ ${review.Rating}</span>
                    <span class="review-user">${username}</span>
                </div>
                <p class="review-comment">${review.Comment}</p>
                <a href="${placeLink}" class="review-link">Ver lugar: ${placeName}</a>
            `;

            reviewsContainer.appendChild(reviewElement);
        });
    }

    function showError(message) {
        reviewsContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
});
