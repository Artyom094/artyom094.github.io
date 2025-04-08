document.addEventListener("DOMContentLoaded", async function () {
    // Inicializar el mapa
    const map = L.map("map").setView([26.0806, -98.2883], 13); // Coordenadas iniciales (Reynosa)

    // Cargar los tiles de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Función para obtener lugares desde la API
    async function fetchPlaces() {
        try {
            const response = await fetch("https://cityvibess.bsite.net/api/Places/");
            if (!response.ok) throw new Error("Error al obtener los lugares");

            const places = await response.json();
            console.log("Lugares obtenidos:", places);

            places.forEach(place => {
                console.log("Procesando lugar:", place);
                if (place.Latitude != null && place.Longitude != null) {
                    addMarker(place);
                }
            });
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudieron cargar los lugares.");
        }
    }

    // Función para agregar un marcador en el mapa
    function addMarker(place) {
        console.log("Agregando marcador para:", place.Name);
        const marker = L.marker([parseFloat(place.Latitude), parseFloat(place.Longitude)])
            .addTo(map)
            .bindPopup(`<b>${place.Name}</b><br>${place.Category || "Sin categoría"}`);

        marker.on("click", () => {
            map.setView([parseFloat(place.Latitude), parseFloat(place.Longitude)], 15);
        });
    }

    // Botón para obtener la ubicación del usuario
    document.getElementById("locationBtn").addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 15);
                    L.marker([latitude, longitude])
                        .addTo(map)
                        .bindPopup("📍 Estás aquí")
                        .openPopup();
                },
                () => alert("No se pudo obtener la ubicación.")
            );
        } else {
            alert("Tu navegador no soporta geolocalización.");
        }
    });

    // Llamar a la función para cargar los lugares
    fetchPlaces();
});
