/**
 * Servicio para manejar la información detallada de un lugar específico
 * Obtiene los datos de un lugar por su ID desde la API
 */
document.addEventListener('DOMContentLoaded', function() {
    // URL de la API
    const API_URL = 'https://cityvibesplaces.d1.mockoon.app/api/places';
    
    // Elementos del DOM
    const placeName = document.getElementById('placeName');
    const placeTitle = document.getElementById('placeTitle');
    const placeAddress = document.getElementById('placeAddress');
    const placeHours = document.getElementById('placeHours');
    const categoryName = document.getElementById('categoryName');
    const categoryIcon = document.getElementById('categoryIcon');
    const priceRange = document.getElementById('priceRange');
    const mainImage = document.getElementById('mainImage');
    const mapFrame = document.getElementById('mapFrame');
    const placeDescription = document.getElementById('placeDescription');
    const directionsButton = document.getElementById('directionsButton');
    
    // Iconos por categoría
    const categoryIcons = {
        'Restaurante': '🍽️',
        'Bar': '🍸',
        'Cafetería': '☕',
        'Antro': '🎵'
    };
    
    // Obtener ID del lugar de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');
    
    // Si no hay ID, mostrar mensaje de error
    if (!placeId) {
        console.error('No se ha especificado un ID de lugar');
        showErrorMessage('No se ha especificado un ID de lugar');
        return;
    }
    
    // Cargar los detalles del lugar
    loadPlaceDetails(placeId);
    
    /**
     * Función para cargar los detalles de un lugar específico
     * @param {string|number} id - ID del lugar a consultar
     */
    async function loadPlaceDetails(id) {
        try {
            console.log(`Cargando lugar con ID: ${id}`);
            
            // Realizar la petición a la API
            const response = await fetch(`${API_URL}/${id}`);
            
            // Si la respuesta no es exitosa, lanzar error
            if (!response.ok) {
                throw new Error(`Error al cargar los detalles: ${response.status}`);
            }
            
            // Convertir respuesta a JSON
            const placeData = await response.json();
            console.log('Datos del lugar:', placeData);
            
            // Actualizar la interfaz con los datos del lugar
            updatePlaceUI(placeData);
            
        } catch (error) {
            console.error('Error al cargar los detalles del lugar:', error);
            
            // Mostrar mensaje de error al usuario
            showErrorMessage('No se pudo cargar la información del lugar. Intentando usar datos de respaldo...');
            
            // Obtener datos de demostración si la API falla
            const demoPlace = await getDemoPlace(id);
            if (demoPlace) {
                console.log('Usando datos de demostración:', demoPlace);
                updatePlaceUI(demoPlace);
            } else {
                showErrorMessage('No se encontró información para este lugar.');
            }
        }
    }
    
    /**
     * Actualiza la interfaz con los datos del lugar
     * @param {Object} place - Datos del lugar
     */
    function updatePlaceUI(place) {
        // Actualizar título y nombre
        document.title = `CityVibes - ${place.Name}`;
        if (placeName) placeName.textContent = place.Name;
        if (placeTitle) placeTitle.textContent = place.Name;
        
        // Actualizar dirección
        if (placeAddress) placeAddress.textContent = place.Address || 'Dirección no disponible';
        
        // Actualizar horarios
        if (placeHours) placeHours.textContent = `${place.Days || 'Todos los días'} · ${place.Hours || 'Horario no disponible'}`;
        
        // Actualizar categoría
        if (categoryName) categoryName.textContent = place.Category || 'Sin categoría';
        if (categoryIcon) {
            categoryIcon.textContent = categoryIcons[place.Category] || '📍';
        }
        
        // Actualizar rango de precios
        if (priceRange) priceRange.textContent = place.Price_Range || 'Precio no disponible';
        
        // Actualizar imagen principal
        if (mainImage) {
            mainImage.src = place.Image_URL || '/api/placeholder/600/300';
            mainImage.alt = `Imagen de ${place.Name}`;
        }
        
        // Actualizar mapa
        if (mapFrame && place.Maps_URL) {
            mapFrame.src = place.Maps_URL;
        }
        
        // Actualizar descripción (generada a partir de los datos disponibles)
        if (placeDescription) {
            placeDescription.innerHTML = `
                <p>Este local de categoría "${place.Category}" está ubicado en ${place.Address}.</p>
                <p>Horario de servicio: ${place.Days || 'Todos los días'} de ${place.Hours || 'horario no disponible'}.</p>
                <p>Rango de precios aproximado: ${place.Price_Range || 'No disponible'}</p>
                <p>Añadido el: ${formatDate(place.Added_Timestamp) || 'Fecha no disponible'}</p>
            `;
        }
        
        // Configurar botón de direcciones
        if (directionsButton && place.Maps_URL) {
            directionsButton.addEventListener('click', () => {
                window.open(place.Maps_URL, '_blank');
            });
        }
        
        // Ocultar secciones no aplicables (ya que no tenemos estos datos en la API)
        hideUnsupportedSections();
    }
    
    /**
     * Oculta secciones que dependen de datos no disponibles en la API
     */
    function hideUnsupportedSections() {
        // Ocultar secciones que no aplican por no tener los datos en la API
        const unsupportedSections = [
            '.reviews-section',      // No tenemos reseñas en la API
            '.similar-places-section' // No tenemos endpoint para lugares similares
        ];
        
        unsupportedSections.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) {
                section.style.display = 'none';
            }
        });
    }
    
    /**
     * Formatea una fecha ISO a formato legible
     * @param {string} isoDate - Fecha en formato ISO
     * @returns {string} Fecha formateada
     */
    function formatDate(isoDate) {
        if (!isoDate) return '';
        
        try {
            const date = new Date(isoDate);
            return date.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return isoDate;
        }
    }
    
    /**
     * Muestra un mensaje de error en la página
     * @param {string} message - Mensaje de error a mostrar
     */
    function showErrorMessage(message) {
        // Verificar si ya existe un mensaje de error
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.textContent = message;
            return;
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insertar al principio del contenido
        const content = document.querySelector('.content');
        if (content) {
            content.prepend(errorDiv);
        }
    }
    
    /**
     * Obtiene datos de demostración para un lugar específico
     * @param {string|number} id - ID del lugar
     * @returns {Object|null} Datos de demostración o null si no existe
     */
    async function getDemoPlace(id) {
        const demoPlaces = await getAllDemoPlaces();
        return demoPlaces.find(place => place.Id_Place == id) || null;
    }
    
    /**
     * Obtiene todos los lugares de demostración
     * @returns {Array} Arreglo con datos de demostración
     */
    async function getAllDemoPlaces() {
        // Datos de demostración (se usan si la API falla)
        return [
            {
                "Id_Place": 1,
                "Name": "Taquería Barrón",
                "Latitude": 26.0615833,
                "Longitude": -98.3366322,
                "Category": "Restaurante",
                "Address": "Av San José 407, Villas de San José, 88748 Reynosa, Tamps.",
                "Days": "Lunes - Domingo",
                "Hours": "06:00 PM - 12:00 AM",
                "Price_Range": "$60 - $150",
                "Image_URL": "",
                "Added_Timestamp": "2025-03-29T04:05:14",
                "Maps_URL": "https://www.google.com/maps?q=26.0615833,-98.3366322"
            },
            {
                "Id_Place": 2,
                "Name": "Café del Centro",
                "Latitude": 26.0625833,
                "Longitude": -98.3366322,
                "Category": "Cafetería",
                "Address": "Calle Madero 45, Centro, 88700 Reynosa, Tamps.",
                "Days": "Lunes - Sábado",
                "Hours": "08:00 AM - 08:00 PM",
                "Price_Range": "$30 - $80",
                "Image_URL": "",
                "Added_Timestamp": "2025-03-29T05:15:21",
                "Maps_URL": "https://www.google.com/maps?q=26.0625833,-98.3366322"
            },
            {
                "Id_Place": 3,
                "Name": "Bar La Antigua",
                "Latitude": 26.0635833,
                "Longitude": -98.3376322,
                "Category": "Bar",
                "Address": "Calle Hidalgo 120, Centro, 88700 Reynosa, Tamps.",
                "Days": "Miércoles - Domingo",
                "Hours": "06:00 PM - 02:00 AM",
                "Price_Range": "$80 - $200",
                "Image_URL": "",
                "Added_Timestamp": "2025-03-28T14:30:00",
                "Maps_URL": "https://www.google.com/maps?q=26.0635833,-98.3376322"
            },
            {
                "Id_Place": 4,
                "Name": "Club Nocturno Metrópolis",
                "Latitude": 26.0645833,
                "Longitude": -98.3386322,
                "Category": "Antro",
                "Address": "Av. Tecnológico 500, Las Fuentes, 88740 Reynosa, Tamps.",
                "Days": "Jueves - Sábado",
                "Hours": "10:00 PM - 05:00 AM",
                "Price_Range": "$150 - $400",
                "Image_URL": "",
                "Added_Timestamp": "2025-03-28T10:45:12",
                "Maps_URL": "https://www.google.com/maps?q=26.0645833,-98.3386322"
            },
            {
                "Id_Place": 5,
                "Name": "Mariscos El Puerto",
                "Latitude": 26.0655833,
                "Longitude": -98.3396322,
                "Category": "Restaurante",
                "Address": "Blvd. Morelos 1200, Rodriguez, 88630 Reynosa, Tamps.",
                "Days": "Lunes - Domingo",
                "Hours": "11:00 AM - 08:00 PM",
                "Price_Range": "$120 - $300",
                "Image_URL": "",
                "Added_Timestamp": "2025-03-27T09:20:35",
                "Maps_URL": "https://www.google.com/maps?q=26.0655833,-98.3396322"
            }
        ];
    }
});