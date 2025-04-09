document.addEventListener('DOMContentLoaded', function() {
    // Obtener ID del lugar de la URL
    const urlParams = new URLSearchParams(window.location.search);
    let placeId = urlParams.get('id');

    // Guardar la ID en localStorage por si se necesita más adelante
    if (placeId) {
        localStorage.setItem('lastPlaceId', placeId);
    }

    // Elementos DOM
    const placeNameHeader = document.getElementById('placeNameHeader');
    const placeContent = document.getElementById('placeContent');

    // URL de la API con el ID del lugar
    const API_URL = `https://cityvibess.bsite.net/api/places/${placeId}`;

    // Verificar si hay ID de lugar
    if (!placeId) {
        showError('No se especificó un lugar para mostrar');
        return;
    }

    // Cargar lugar por ID
    loadPlaceById(placeId);

    /**
     * Carga un lugar específico por su ID
     * @param {string|number} id - ID del lugar a cargar
     */
    async function loadPlaceById(id) {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const place = await response.json();
            console.log('Lugar encontrado:', place);

            // Mostrar detalles del lugar
            displayPlaceDetails(place);
        } catch (error) {
            console.error('Error al cargar información del lugar:', error);
            showError('No se pudo cargar la información del lugar');
        }
    }

    /**
     * Muestra los detalles del lugar en la página
     * @param {Object} place - Datos del lugar
     */
    function displayPlaceDetails(place) {
        const name = place.Name || 'Nombre no disponible';
        const category = place.Category || 'Categoría no disponible';
        const city = place.City || 'Ciudad no disponible';
        const rating = place.Rating || 'Calificación no disponible';
        const latitude = place.Latitude || 0;
        const longitude = place.Longitude || 0;
        const createdDate = place.Creation_Date || '';

        // Actualizar título
        document.title = `CityVibes - ${name}`;
        placeNameHeader.textContent = name;

        const placeHTML = `
            <div class="place-container">
                <div class="place-header">
                    <h2 class="place-title">${name}</h2>
                    <div class="place-category">${category}</div>
                    <div class="place-city">${city}</div>
                    <div class="place-rating">Calificación: ${rating}</div>
                </div>

                <div class="place-details">
                    ${createdDate ? `
                    <div class="detail-item">
                        <span class="detail-icon">📅</span>
                        <span class="detail-text">Fecha de creación: ${formatDate(createdDate)}</span>
                    </div>
                    ` : ''}
                    ${latitude && longitude ? `
                    <div class="detail-item">
                        <span class="detail-icon">📍</span>
                        <span class="detail-text" id="placeAddress">Cargando dirección...</span>
                    </div>
                    ` : ''}
                </div>

            </div>
        `;

        placeContent.innerHTML = placeHTML;

        // Mostrar dirección si hay coordenadas
        if (latitude && longitude) {
            getAddressFromCoordinates(latitude, longitude)
                .then(address => {
                    const addressElement = document.getElementById('placeAddress');
                    if (addressElement) {
                        addressElement.textContent = address;
                    }
                });
        }

        // Agregar redirección al botón de reportar
        const reportButton = document.getElementById('reportButton');
        if (reportButton) {
            reportButton.addEventListener('click', () => {
                // Redirige a la página del formulario de reporte
                window.location.href = `reportplace.html?id=${placeId}`;
            });
        }
    }

    /**
     * Obtiene la dirección a partir de coordenadas usando OpenCage
     */
    async function getAddressFromCoordinates(lat, lng) {
        const API_KEY = 'e85379f29adc48a7abdc67d1119871e0';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}&language=es`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                return data.results[0].formatted;
            }
            return 'Dirección no disponible';
        } catch (error) {
            console.error('Error al obtener la dirección:', error);
            return 'Error al obtener la dirección';
        }
    }

    /**
     * Formatea una fecha ISO a un formato legible
     */
    function formatDate(dateString) {
        if (!dateString) return 'Fecha no disponible';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;

            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return dateString;
        }
    }

    /**
     * Muestra un mensaje de error
     */
    function showError(message) {
        placeContent.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <p>Vuelve a la página principal para ver otros lugares.</p>
            </div>
        `;
    }
});
