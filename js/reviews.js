document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID del lugar desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');
    
    // Obtener el ID del usuario desde LocalStorage
    const userId = localStorage.getItem('userId');  // Obtener el userId desde localStorage
    
    // Elementos DOM
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewForm = document.getElementById('reviewForm');
    const ratingInput = document.getElementById('rating');
    const commentInput = document.getElementById('comment');
    const submitButton = document.getElementById('submitReview');

    // URL de las APIs
    const reviewsApiUrl = 'https://cityvibess.bsite.net/api/Reviews';
    const reviewsByPlaceApiUrl = `https://cityvibess.bsite.net/api/Reviews/ByPlace/${placeId}`;
    const usersApiUrl = 'https://cityvibess.bsite.net/api/Users';
    
    // Verificar si el usuario está logueado
    if (!userId) {
        showError('Por favor, inicie sesión para dejar una reseña');
        return;
    }

    // Cargar las reseñas existentes
    loadReviews(placeId);

    // Evento para agregar reseña
    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const rating = ratingInput.value;
        const comment = commentInput.value;

        if (!rating || !comment) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        addReview(userId, placeId, rating, comment);
    });

    // Función para cargar las reseñas del lugar
    async function loadReviews(placeId) {
        try {
            const reviewsResponse = await fetch(reviewsByPlaceApiUrl);
            const usersResponse = await fetch(usersApiUrl);
            
            if (!reviewsResponse.ok || !usersResponse.ok) {
                throw new Error('Error al cargar las reseñas o los usuarios.');
            }
            
            const reviews = await reviewsResponse.json();
            const users = await usersResponse.json();
            
            displayReviews(reviews, users);
            
            // Comprobar si el usuario ya ha dejado una reseña
            const userReview = reviews.find(review => review.Id_User === parseInt(userId));
            if (userReview) {
                disableReviewForm(userReview);
            }
        } catch (error) {
            console.error(error);
            showError('No hay reseñas para mostrar.');
        }
    }

    // Función para agregar una nueva reseña
    async function addReview(userId, placeId, rating, comment) {
        const reviewData = {
            Id_User: userId,
            Id_Place: placeId,
            Rating: rating,
            Comment: comment,
        };

        try {
            const response = await fetch(reviewsApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
            
            if (!response.ok) {
                throw new Error('Error al publicar la reseña.');
            }

            // Limpiar el formulario
            ratingInput.value = '';
            commentInput.value = '';

            // Recargar las reseñas
            loadReviews(placeId);
        } catch (error) {
            console.error(error);
            alert('Error al publicar la reseña');
        }
    }

    // Función para eliminar la reseña
    async function deleteReview(reviewId) {
        try {
            const response = await fetch(`${reviewsApiUrl}/${reviewId}`, { method: 'DELETE' });
            
            if (!response.ok) {
                throw new Error('Error al eliminar la reseña');
            }

            // Recargar las reseñas después de eliminar
            loadReviews(placeId);
        } catch (error) {
            console.error(error);
            alert('Error al eliminar la reseña');
        }
    }

    // Función para mostrar las reseñas en la interfaz
    function displayReviews(reviews, users) {
        reviewsContainer.innerHTML = '';
        
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>No hay reseñas para este lugar.</p>';
            return;
        }

        reviews.forEach(review => {
            const user = users.find(u => u.Id_User === review.Id_User);
            const username = user ? user.Username : 'Usuario desconocido';

            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review-item');
            
            reviewElement.innerHTML = `
                <div class="review-header">
                    <span class="review-rating">⭐ ${review.Rating}</span>
                    <span class="review-user">Usuario: ${username}</span>
                </div>
                <p class="review-comment">${review.Comment}</p>
                <p class="review-image">
                </p>
                <div class="review-actions">
                    ${review.Id_User === parseInt(userId) ? ` 
                        <button class="delete-review-btn" data-review-id="${review.Id_Review}">Eliminar</button>
                    ` : ''}
                </div>
            `;

            // Si el usuario publicó la reseña, agregar la opción de eliminar
            const deleteButton = reviewElement.querySelector('.delete-review-btn');
            if (deleteButton) {
                deleteButton.addEventListener('click', () => {
                    const reviewId = deleteButton.getAttribute('data-review-id');
                    deleteReview(reviewId);
                });
            }

            reviewsContainer.appendChild(reviewElement);
        });
    }

    // Función para deshabilitar el formulario de reseña si el usuario ya dejó una reseña
    function disableReviewForm(userReview) {
        reviewForm.style.display = 'none';
        const reviewMessage = document.createElement('p');
        reviewMessage.innerHTML = 'Ya has publicado una reseña para este lugar.';
        reviewsContainer.prepend(reviewMessage);
    }

    // Función para mostrar un mensaje de error
    function showError(message) {
        reviewsContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
});
