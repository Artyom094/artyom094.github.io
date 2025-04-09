document.addEventListener('DOMContentLoaded', function () {
    // Obtener la ID del lugar desde localStorage o la URL
    const placeId = localStorage.getItem('lastPlaceId') || new URLSearchParams(window.location.search).get('id');
    
    // Elementos DOM
    const reportButton = document.getElementById('reportButton');
    const reasonTextarea = document.getElementById('reasonTextarea');

    // Si no hay ID de lugar, redirige al inicio
    if (!placeId) {
        window.location.href = '/index.html';
    }

    // Cargar los detalles del lugar
    loadPlaceDetails(placeId);

    /**
     * Carga los detalles del lugar por su ID y los muestra en el formulario
     */
    async function loadPlaceDetails(placeId) {
        const API_URL = `https://cityvibess.bsite.net/api/places/${placeId}`;
        try {
            const response = await fetch(API_URL);
            const place = await response.json();

            if (!response.ok) {
                throw new Error('No se pudo obtener los datos del lugar');
            }

            // Mostrar detalles en el formulario
            document.getElementById('placeName').textContent = place.Name || 'Nombre no disponible';
            document.getElementById('placeCategory').textContent = place.Category || 'Categoría no disponible';
            document.getElementById('placeCoordinates').textContent = `Lat: ${place.Latitude}, Lng: ${place.Longitude}`;

            // Al enviar el reporte, guarda la ID y la información relevante
            reportButton.addEventListener('click', () => {
                const reason = reasonTextarea.value;
                if (reason) {
                    sendReportEmail(place, reason);
                } else {
                    alert('Por favor, escribe un motivo para el reporte.');
                }
            });
        } catch (error) {
            console.error('Error al cargar los detalles del lugar:', error);
            showError('No se pudo cargar los detalles del lugar.');
        }
    }

    /**
     * Envía el reporte de un lugar usando EmailJS
     * @param {Object} place - Los datos del lugar
     * @param {string} reason - El motivo del reporte
     */
    function sendReportEmail(place, reason) {
        emailjs.init('h6Gu3dwXE4AjuiRjF');

        const templateParams = {
            place_name: place.Name,
            category: place.Category,
            latitude: place.Latitude,
            longitude: place.Longitude,
            reason: reason,
            place_id: placeId,  // Enviar la ID del lugar
            email: 'artyom@theboxchannel.ru'  // Este es un email de ejemplo, se debe capturar desde el usuario si es necesario
        };

        // Enviar el reporte a través de EmailJS
        emailjs.send('service_1ygomhc', 'template_t5487os', templateParams)
            .then(() => {
                Swal.fire('¡Reporte enviado!', 'Gracias por ayudarnos a mejorar.', 'success');
            }, (error) => {
                Swal.fire('Error', 'Ocurrió un error al enviar el reporte.', 'error');
                console.error('Error al enviar reporte:', error);
            });
    }

    /**
     * Muestra un mensaje de error en la página
     * @param {string} message - El mensaje de error
     */
    function showError(message) {
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
});
