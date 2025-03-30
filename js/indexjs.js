// Función para limpiar categoría
function clearCategory() {
    activeCategoryEl.style.display = 'none';
    initialMessage.style.display = 'block';
    resultsContainer.innerHTML = initialMessage.outerHTML;

    // Desactivar todos los items del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
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

        // Mostrar loading
        loadingIndicator.style.display = 'block';

        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Actualizar resultados
            resultsContainer.innerHTML = `
                <div class="place-item">Resultados de ${category}</div>
                <div class="place-item">Más resultados...</div>
            `;
        } catch (error) {
            console.error('Error:', error);
            resultsContainer.innerHTML = '<div class="error-message">Error al cargar resultados</div>';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    });
});

// Evento para el botón de limpiar
clearCategoryBtn.addEventListener('click', clearCategory);

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

// Manejador del menú del avatar
const avatarBtn = document.getElementById('avatarBtn');
const avatarMenu = document.getElementById('avatarMenu');
let isMenuOpen = false;

function toggleAvatarMenu(event) {
    event.preventDefault();
    isMenuOpen = !isMenuOpen;
    avatarMenu.style.display = isMenuOpen ? 'block' : 'none';

    if (isMenuOpen) {
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', closeMenuOutside);
    } else {
        document.removeEventListener('click', closeMenuOutside);
    }
}

function closeMenuOutside(event) {
    if (!avatarMenu.contains(event.target) && !avatarBtn.contains(event.target)) {
        isMenuOpen = false;
        avatarMenu.style.display = 'none';
        document.removeEventListener('click', closeMenuOutside);
    }
}

avatarBtn.addEventListener('click', toggleAvatarMenu);

// Estado global de la aplicación
window.appState = {
    currentCategory: null,
    userData: null,
    places: [],
    categories: []
};

// Cargar lugares por categoría
async function loadPlaces(category) {
    try {
        showLoading(true);
        const places = await apiService.getPlacesByCategory(category);
        appState.places = places;
        renderPlaces();
    } catch (error) {
        showError('Error al cargar los lugares');
    } finally {
        showLoading(false);
    }
}

// Renderizar lugares
function renderPlaces() {
    const container = document.getElementById('categoryResults');
    if (!appState.places.length) {
        container.innerHTML = '<div class="no-results">No se encontraron lugares</div>';
        return;
    }

    container.innerHTML = appState.places.map(place => `
        <div class="place-item" data-id="${place.id}">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <div class="rating">${'⭐'.repeat(place.rating)}</div>
        </div>
    `).join('');
}

// Funciones auxiliares
function showLoading(show) {
    const loaders = document.querySelectorAll('.loading-indicator');
    loaders.forEach(loader => {
        loader.style.display = show ? 'block' : 'none';
    });
}

function showError(message) {
    const container = document.getElementById('categoryResults');
    container.innerHTML = `<div class="error-message">${message}</div>`;
}

function updateUserInterface() {
    if (appState.userData) {
        document.querySelector('.user-name').textContent = appState.userData.name;
        document.querySelector('.user-email').textContent = appState.userData.email;
        // Actualizar avatar si existe
        if (appState.userData.avatar) {
            document.querySelector('.avatar img').src = appState.userData.avatar;
        }
    }
}

// Event Listeners para categorías
document.querySelectorAll('.menu-item[data-category]').forEach(item => {
    item.addEventListener('click', async (e) => {
        e.preventDefault();
        const category = item.dataset.category;
        await loadPlaces(category);
    });
});

// Función para renderizar categorías mejorada
async function renderCategories(forceRefresh = false) {
    const menuContainer = document.getElementById('categoriesMenu');
    if (!menuContainer) return; // Verificación de seguridad

    try {
        showLoading(true);
        const categories = await placeService.getCategories(forceRefresh);
        appState.categories = categories; // Guardar en el estado global

        if (categories && categories.length > 0) {
            menuContainer.innerHTML = categories.map(category => `
                <a href="#" class="menu-item responsive-item" data-category="${category.id}">
                    <div class="menu-icon responsive-icon" style="--category-color: ${category.color}">${category.icon}</div>
                    <span class="menu-text">${category.name}</span>
                </a>
            `).join('');

            attachCategoryListeners();
        } else {
            menuContainer.innerHTML = '<div class="error-message">No hay categorías disponibles</div>';
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        menuContainer.innerHTML = '<div class="error-message">Error al cargar categorías</div>';
    } finally {
        showLoading(false);
    }
}

// Manejador de categorías adicionales
const moreCategoriesBtn = document.getElementById('moreCategoriesBtn');
const categoriesModal = document.getElementById('categoriesModal');
const closeCategoriesBtn = document.getElementById('closeCategoriesBtn');
const extraCategories = document.getElementById('extraCategories');

async function loadExtraCategories() {
    try {
        const categories = await placeService.getCustomCategories();
        extraCategories.innerHTML = categories.map(category => `
            <a href="#" class="category-item" data-category="${category.id}">
                <div class="category-icon" style="--category-color: ${category.color}">
                    ${category.icon}
                </div>
                <span class="category-name">${category.name}</span>
            </a>
        `).join('');

        // Agregar event listeners a las categorías adicionales
        extraCategories.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                const category = item.dataset.category;
                categoriesModal.style.display = 'none';
                await loadPlaces(category);
            });
        });
    } catch (error) {
        extraCategories.innerHTML = '<div class="error-message">Error al cargar categorías adicionales</div>';
    }
}

moreCategoriesBtn.addEventListener('click', () => {
    categoriesModal.style.display = 'block';
    loadExtraCategories();
});

closeCategoriesBtn.addEventListener('click', () => {
    categoriesModal.style.display = 'none';
});
