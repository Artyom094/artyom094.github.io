document.addEventListener("DOMContentLoaded", async function () {
    const userId = getCookie("userId");
    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    const userNameElement = document.getElementById("userName");
    const userAvatarElement = document.getElementById("userAvatar");
    const reviewCountElement = document.getElementById("reviewCount");
    const userReviewsContainer = document.getElementById("userReviewsContainer");

    try {
        // Obtener lista de usuarios y encontrar el usuario actual
        const usersResponse = await fetch(`https://cityvibess.bsite.net/api/Users`);
        if (!usersResponse.ok) throw new Error("Error al obtener los usuarios.");
        const usersData = await usersResponse.json();

        const currentUser = usersData.find(user => user.Id_User === parseInt(userId));
        if (!currentUser) throw new Error("Usuario no encontrado.");

        // Mostrar los datos del usuario
        userNameElement.textContent = currentUser.Username;  // Asegurando que se refleje en el HTML
        userAvatarElement.src = currentUser.ImagePath || "/api/placeholder/120/120";

        // Obtener reseñas del usuario
        const reviewsResponse = await fetch(`https://cityvibess.bsite.net/api/Reviews`);
        if (!reviewsResponse.ok) throw new Error("Error al obtener las reseñas.");
        const reviewsData = await reviewsResponse.json();

        const userReviews = reviewsData.filter(review => review.Id_User === parseInt(userId));
        reviewCountElement.textContent = `Has escrito ${userReviews.length} reseñas`;

        // Mostrar las reseñas del usuario
        userReviewsContainer.innerHTML = "";
        if (userReviews.length === 0) {
            userReviewsContainer.innerHTML = "<p>No has escrito ninguna reseña aún.</p>";
        } else {
            userReviews.forEach(review => {
                const reviewElement = document.createElement("div");
                reviewElement.classList.add("review-item");
                reviewElement.innerHTML = `
                    <div class="review-header">
                        <span class="review-rating">⭐ ${review.Rating}</span>
                        <a href="place.html?id=${review.Id_Place}" class="review-place-link">${review.PlaceName || "Ver Lugar"}</a>
                    </div>
                    <p class="review-comment">${review.Comment}</p>
                `;
                userReviewsContainer.appendChild(reviewElement);
            });
        }
    } catch (error) {
        console.error(error);
        reviewCountElement.textContent = "Error al cargar reseñas";
        userReviewsContainer.innerHTML = "<p>Error al cargar reseñas</p>";
    }
});

// Función para obtener cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}
