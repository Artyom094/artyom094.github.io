document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get("id");
    const API_PLACES = "https://cityvibess.bsite.net/api/Places/api/places";
    const API_REVIEWS = "https://cityvibess.bsite.net/api/Reviews";
    const placeNameHeader = document.getElementById("placeNameHeader");
    const placeContent = document.getElementById("placeContent");
    const reviewsContainer = document.getElementById("reviewsContainer");

    if (!placeId) {
        showError("No se especificó un lugar para mostrar");
        return;
    }

    loadPlaceById(placeId);
    loadReviews(placeId);

    async function loadPlaceById(id) {
        try {
            const response = await fetch(`${API_PLACES}/${id}`);
            if (!response.ok) throw new Error("No se encontró el lugar");
            const place = await response.json();
            displayPlaceDetails(place);
        } catch (error) {
            console.error(error);
            showError("No se pudo cargar la información del lugar");
        }
    }

    function displayPlaceDetails(place) {
        placeNameHeader.textContent = place.Name;
        placeContent.innerHTML = `
            <div class="place-container">
                <h2>${place.Name}</h2>
                <p><strong>Categoría:</strong> ${place.Category}</p>
                <p><strong>Ciudad:</strong> ${place.City}</p>
                <p><strong>Valoración:</strong> ${place.Rating} ⭐</p>
                <div class="map-container">
                    <iframe src="https://maps.google.com/maps?q=${place.Latitude},${place.Longitude}&z=15&output=embed" allowfullscreen></iframe>
                </div>
            </div>
        `;
    }

    async function loadReviews(placeId) {
        try {
            const response = await fetch(`${API_REVIEWS}/place/${placeId}`);
            if (!response.ok) throw new Error("No se encontraron reseñas");
            const reviews = await response.json();
            displayReviews(reviews);
        } catch (error) {
            console.error(error);
            reviewsContainer.innerHTML = "<p>No hay reseñas disponibles.</p>";
        }
    }

    function displayReviews(reviews) {
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = "<p>No hay reseñas aún. Sé el primero en escribir una.</p>";
            return;
        }

        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-item">
                <p><strong>Usuario:</strong> ${review.Id_User}</p>
                <p><strong>Valoración:</strong> ${review.Rating} ⭐</p>
                <p>${review.Comment}</p>
            </div>
        `).join("");
    }

    document.getElementById("reviewForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        const userId = document.getElementById("userId").value;
        const rating = document.getElementById("rating").value;
        const comment = document.getElementById("comment").value;

        const reviewData = {
            Id_User: parseInt(userId),
            Id_Place: parseInt(placeId),
            Rating: parseInt(rating),
            Comment: comment,
            Creation_Date: new Date().toISOString(),
        };

        try {
            const response = await fetch(API_REVIEWS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) throw new Error("Error al enviar la reseña");

            document.getElementById("reviewForm").reset();
            loadReviews(placeId);
        } catch (error) {
            console.error(error);
            alert("No se pudo enviar la reseña");
        }
    });

    function showError(message) {
        placeContent.innerHTML = `<div class="error-message">${message}</div>`;
    }
});
