document.addEventListener("DOMContentLoaded", function () {
    const placesList = document.getElementById("placesList");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const searchInput = document.getElementById("searchInput");
    
    let places = []; // Almacenará los lugares obtenidos de la API
    
    async function fetchPlaces() {
        try {
            const response = await fetch("https://cityvibess.bsite.net/api/Places/");
            if (!response.ok) throw new Error("Error al obtener los lugares");
            
            places = await response.json();
            renderPlaces("all");
        } catch (error) {
            console.error("Error:", error);
            placesList.innerHTML = "<p>No se pudieron cargar los lugares.</p>";
        }
    }
    
    async function searchPlaces(query) {
        try {
            const response = await fetch(`https://cityvibess.bsite.net/api/Places/Search?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("Error al buscar lugares");
            
            const searchResults = await response.json();
            renderSearchedPlaces(searchResults);
        } catch (error) {
            console.error("Error:", error);
            placesList.innerHTML = "<p>No se encontraron lugares.</p>";
        }
    }
    
    function renderPlaces(categoryId) {
        placesList.innerHTML = "";
        
        let filteredPlaces = categoryId === "all" ? places : places.filter(place => place.Category.toLowerCase() === getCategoryName(categoryId));
        
        if (filteredPlaces.length === 0) {
            placesList.innerHTML = "<p>No hay lugares disponibles en esta categoría.</p>";
            return;
        }
        
        filteredPlaces.forEach(place => {
            const placeItem = document.createElement("div");
            placeItem.classList.add("place-item");
            placeItem.innerHTML = `
                <h4>${place.Name}</h4>
                <p>${place.City}</p>
                <p>⭐ ${place.Rating}</p>
                <p>📍 ${place.Latitude}, ${place.Longitude}</p>
            `;
            placesList.appendChild(placeItem);
        });
    }
    
    function renderSearchedPlaces(results) {
        placesList.innerHTML = "";
        
        if (results.length === 0) {
            placesList.innerHTML = "<p>No se encontraron lugares.</p>";
            return;
        }
        
        results.forEach(place => {
            const placeItem = document.createElement("div");
            placeItem.classList.add("place-item");
            placeItem.innerHTML = `
                <h4>${place.Name}</h4>
                <p>${place.City}</p>
                <p>⭐ ${place.Rating}</p>
                <p>📍 ${place.Latitude}, ${place.Longitude}</p>
            `;
            placesList.appendChild(placeItem);
        });
    }
    
    function getCategoryName(categoryId) {
        const categories = {
            "1": "parques",
            "2": "restaurantes",
            "5": "museos",
            "6": "centros comerciales",
            "7": "bares",
            "8": "cafeterías"
        };
        return categories[categoryId] || "";
    }
    
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            document.querySelector(".filter-btn.active").classList.remove("active");
            this.classList.add("active");
            renderPlaces(this.dataset.categoryId);
        });
    });
    
    searchInput.addEventListener("input", function () {
        const query = this.value.trim();
        if (query.length > 0) {
            searchPlaces(query);
        } else {
            renderPlaces("all");
        }
    });
    
    fetchPlaces();
});