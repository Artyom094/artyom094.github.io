document.addEventListener("DOMContentLoaded", () => {
    emailjs.init('h6Gu3dwXE4AjuiRjF'); // Tu public key

    const urlParams = new URLSearchParams(window.location.search);
    const reviewId = urlParams.get('id');
    const commentContent = document.getElementById("commentContent");
    const reportForm = document.getElementById("reportForm");

    let reviewData = null;
    let userData = null;
    let placeData = null;

    // Obtener detalles de la reseña
    fetch(`https://cityvibess.bsite.net/api/Reviews/${reviewId}`)
        .then(response => response.json())
        .then(data => {
            reviewData = data;
            commentContent.textContent = data.Comment || "Comentario no disponible";

            // Obtener detalles del usuario
            fetch(`https://cityvibess.bsite.net/api/Users/${data.Id_User}`)
                .then(response => response.json())
                .then(user => {
                    userData = user;
                })
                .catch(error => {
                    console.error("Error al obtener el usuario:", error);
                });

            // Obtener detalles del lugar
            fetch(`https://cityvibess.bsite.net/api/Places/${data.Id_Place}`)
                .then(response => response.json())
                .then(place => {
                    placeData = place;
                })
                .catch(error => {
                    console.error("Error al obtener el lugar:", error);
                });
        })
        .catch(error => {
            commentContent.textContent = "Error al cargar el comentario.";
            console.error("Error al obtener la reseña:", error);
        });

    // Enviar reporte
    reportForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const reason = document.getElementById("reason").value.trim();
        if (!reason) {
            Swal.fire('Error', 'Debes ingresar un motivo para el reporte.', 'warning');
            return;
        }

        if (!reviewData || !userData || !placeData) {
            Swal.fire('Error', 'No se ha podido cargar la reseña, usuario o lugar.', 'error');
            return;
        }

        const templateParams = {
            review_id: reviewData.Id_Review,
            user_name: userData.Username || "Desconocido",
            place_name: placeData.Name || "Desconocido",
            rating: reviewData.Rating,
            comment: reviewData.Comment,
            reason: reason,
            email: "artyom@theboxchannel.ru"
        };

        emailjs.send("service_1ygomhc", "template_ruteu1k", templateParams)
            .then(() => {
                Swal.fire('¡Reporte enviado!', 'Gracias por ayudarnos a mantener la comunidad segura.', 'success');
                reportForm.reset();
            })
            .catch(error => {
                Swal.fire('Error', 'Ocurrió un problema al enviar el reporte.', 'error');
                console.error("EmailJS error:", error);
            });
    });
});
