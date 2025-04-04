document.addEventListener('DOMContentLoaded', function() {
    // Obtener ID del lugar de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');
    
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
            // 1. Intentamos obtener el lugar específico por ID
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
            
            // 2. Mostrar detalles del lugar
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
        // Para evitar "undefined", verificamos cada propiedad
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
        
        // Generar contenido HTML seguro (evitando undefined)
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
                </div>
            </div>
            
            ${latitude && longitude ? `
            <div class="map-section place-container">
                <h3>Ubicación</h3>
                <div class="map-container">
                    <iframe 
                        src="https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
            ` : ''}
        `;
        
        // Actualizar el contenido
        placeContent.innerHTML = placeHTML;
    }
    
    /**
     * Formatea una fecha ISO a un formato legible
     * @param {string} dateString - Fecha en formato ISO
     * @returns {string} - Fecha formateada
     */
    function formatDate(dateString) {
        if (!dateString) return 'Fecha no disponible';
        
        try {
            const date = new Date(dateString);
            
            // Verificar si es una fecha válida
            if (isNaN(date.getTime())) {
                return dateString;
            }
            
            // Formatear la fecha
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
     * @param {string} message - Mensaje de error
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
