document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const categoriesMenu = document.getElementById('categoriesMenu');
    const initialMessage = document.getElementById('initialMessage');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContainer = document.getElementById('categoryResults');
    const activeCategoryEl = document.getElementById('activeCategory');
    const categoryLabelEl = document.getElementById('categoryLabel');
    const clearCategoryBtn = document.getElementById('clearCategoryBtn');
    const debugInfo = document.getElementById('debugInfo');
    
    // URL de la API
    const API_URL = 'https://cityvibesplaces.d1.mockoon.app/api/places';
    
    // Configuración de Debug (establece en true para ver info detallada)
    const DEBUG = false;
    
    // Datos de ejemplo para mostrar cuando la API no esté disponible
    // La estructura coincide exactamente con el ejemplo proporcionado
    const demoPlaces = [
        {
            "Id_Place": 1,
            "Name": "Taqueríerea Barrón",
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
    
    // Cargar lugares populares al inicio
    loadPopularPlaces();
    
    // Función para cargar lugares de la API o usar datos de demostración
    async function fetchPlaces() {
        try {
            showLoading(true);
            
            // Intentar obtener datos de la API con método GET explícito
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors' // Intentar con CORS
            });
            
            if (DEBUG) {
                logDebug(`Status: ${response.status}`);
                logDebug(`OK: ${response.ok}`);
                logDebug(`Status Text: ${response.statusText}`);
                logDebug(`Headers: ${JSON.stringify([...response.headers])}`);
            }
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (DEBUG) {
                logDebug(`Datos recibidos: ${data.length} elementos`);
                if (data.length > 0) {
                    logDebug(`Primer elemento: ${JSON.stringify(data[0], null, 2)}`);
                }
            }
            
            showLoading(false);
            return data;
        } catch (error) {
            console.warn('No se pudo conectar a la API, usando datos de demostración', error);
            if (DEBUG) {
                logDebug(`Error: ${error.message}`);
            }
            showLoading(false);
            
            // Devolver datos de demostración
            return demoPlaces;
        }
    }
    
    // Función para cargar lugares populares
    async function loadPopularPlaces() {
        try {
            // Obtener datos (de API o demo)
            const places = await fetchPlaces();
            
            // Mostrar los 5 primeros
            displayPlaces(places.slice(0, 5));
        } catch (error) {
            console.error('Error:', error);
            resultsContainer.innerHTML = `
                <div class="error-message">
                    Error al cargar los lugares. Por favor intenta de nuevo.
                </div>
            `;
        }
    }
    
    // Función para obtener lugares por categoría
    async function getPlacesByCategory(category) {
        loadingIndicator.style.display = 'block';
        initialMessage.style.display = 'none';
        
        try {
            // Obtener todos los lugares
            const places = await fetchPlaces();
            
            let filteredPlaces = places;
            
            // Filtrar por categoría si no es 'all'
            if (category !== 'all') {
                filteredPlaces = places.filter(place => 
                    place.Category === category
                );
            }
            
            // Actualizar el título de la sección según la categoría
            updateSectionTitle(category);
            
            // Mostrar los resultados (máximo 5)
            displayPlaces(filteredPlaces.slice(0, 5));
        } catch (error) {
            console.error('Error:', error);
            resultsContainer.innerHTML = `
                <div class="error-message">
                    Error al cargar los lugares. Por favor intenta de nuevo.
                </div>
            `;
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }
    
    // Actualiza el título de la sección según la categoría
    function updateSectionTitle(category) {
        const sectionTitle = document.querySelector('.section-title');
        if (!sectionTitle) return;
        
        if (category === 'all') {
            sectionTitle.innerHTML = '<span class="icon">🔥</span> Lo popular de la semana';
        } else {
            let icon = '📍';
            switch(category) {
                case 'Restaurante': icon = '🍽️'; break;
                case 'Bar': icon = '🍸'; break;
                case 'Cafetería': icon = '☕'; break;
                case 'Antro': icon = '🎵'; break;
            }
            
            // Añadir "s" al final para plural, excepto "Cafetería" que es especial
            const displayName = category === 'Cafetería' ? 'Cafeterías' : category + 's';
            sectionTitle.innerHTML = `<span class="icon">${icon}</span> ${displayName} destacados`;
        }
    }
    
    // Función para mostrar los lugares en el DOM
    function displayPlaces(places) {
        if (places.length === 0) {
            resultsContainer.innerHTML = `
                <div class="error-message">
                    No se encontraron lugares en esta categoría.
                </div>
            `;
            return;
        }
        
        resultsContainer.innerHTML = '';
        
        places.forEach(place => {
            const placeElement = document.createElement('div');
            placeElement.classList.add('place-item');
            
            // Crear el elemento HTML para el lugar
            placeElement.innerHTML = `
                <img src="${place.Image_URL || '/api/placeholder/400/180'}" alt="${place.Name}" class="place-image">
                <div class="place-details">
                    <h3 class="place-title">${place.Name}</h3>
                    <p class="place-address">${place.Address}</p>
                    <div class="place-hours">${place.Days || 'Todos los días'} · ${place.Hours || 'Horario no disponible'}</div>
                    <div class="place-meta">
                        <span class="place-category">${place.Category}</span>
                        <span class="place-price">${place.Price_Range}</span>
                    </div>
                    ${place.Maps_URL ? `<a href="${place.Maps_URL}" target="_blank" class="view-on-maps">Ver en Google Maps</a>` : ''}
                </div>
            `;
            
            // Agregar evento para ver detalles
            placeElement.addEventListener('click', function(e) {
                // No navegar si se hace clic en el botón de Google Maps
                if (e.target.classList.contains('view-on-maps')) {
                    e.stopPropagation();
                    return;
                }
                
                // Aquí redirigir a la página de detalles
                window.location.href = `lugar.html?id=${place.Id_Place}`;
            });
            
            resultsContainer.appendChild(placeElement);
        });
    }
    
    // Función para limpiar categoría
    function clearCategory() {
        activeCategoryEl.style.display = 'none';
        
        // Desactivar todos los items del menú
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Cargar lugares populares
        loadPopularPlaces();
    }

    // Manejador de categorías
    document.querySelectorAll('.menu-item[data-category]').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            const category = item.dataset.category;

            // Si ya está activa esta categoría, la desactivamos
            if (item.classList.contains('active')) {
                clearCategory();
                return;
            }

            // Desactivar categorías anteriores
            document.querySelectorAll('.menu-item').forEach(menuItem => {
                menuItem.classList.remove('active');
            });

            // Activar categoría seleccionada
            item.classList.add('active');

            // Mostrar indicador de categoría activa
            categoryLabelEl.textContent = item.querySelector('.menu-text').textContent;
            activeCategoryEl.style.display = 'flex';
            initialMessage.style.display = 'none';

            // Cargar lugares de la categoría seleccionada
            getPlacesByCategory(category);
        });
    });

    // Evento para el botón de limpiar
    clearCategoryBtn.addEventListener('click', clearCategory);
    
    // Función para mostrar/ocultar loading
    function showLoading(show) {
        loadingIndicator.style.display = show ? 'block' : 'none';
        if (show) {
            initialMessage.style.display = 'none';
        }
    }
    
    // Función para registrar información de depuración
    function logDebug(message) {
        if (DEBUG && debugInfo) {
            debugInfo.style.display = 'block';
            debugInfo.textContent += message + '\n';
            console.log(message);
        }
    }
    
    // Función para manejar el cambio de tamaño de la pantalla
    function handleResize() {
        const width = window.innerWidth;
        document.body.classList.remove('mobile', 'tablet', 'desktop');

        if (width >= 1024) {
            document.body.classList.add('desktop');
        } else if (width >= 768) {
            document.body.classList.add('tablet');
        } else {
            document.body.classList.add('mobile');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Llamada inicial
});