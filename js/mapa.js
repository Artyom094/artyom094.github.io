document.addEventListener("DOMContentLoaded", async function () {
    const map = L.map("map").setView([26.0806, -98.2883], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    async function fetchPlaces() {
        try {
            const response = await fetch("https://cityvibess.bsite.net/api/Places/");
            if (!response.ok) throw new Error("Error al obtener los lugares");

            const places = await response.json();
            console.log("Lugares obtenidos:", places);

            places.forEach(place => {
                const lat = parseFloat(place.Latitude);
                const lng = parseFloat(place.Longitude);
                if (!isNaN(lat) && !isNaN(lng)) {
                    L.marker([lat, lng])
                        .addTo(map)
                        .bindPopup(`<b>${place.Name}</b><br>${place.Category}`);
                } else {
                    console.warn("Lugar con coordenadas inválidas:", place);
                }
            });
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudieron cargar los lugares.");
        }
    }

    fetchPlaces();
});
