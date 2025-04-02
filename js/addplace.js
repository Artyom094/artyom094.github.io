document.getElementById("addPlaceForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const placeName = document.getElementById("placeName").value;
    const city = document.getElementById("city").value;
    const category = document.getElementById("category").value;
    const address = document.getElementById("address").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    try {
        let coordinates;

        // Verificar si el usuario ingresó latitud y longitud
        if (latitude && longitude) {
            coordinates = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
        } else {
            // Si no hay latitud y longitud, obtenemos las coordenadas por dirección o Plus Code
            const isPlusCode = address.includes("+");
            coordinates = isPlusCode ? await getCoordinatesFromPlusCode(address) : await getCoordinatesFromAddress(address);
        }

        if (!coordinates) {
            alert("No se pudieron obtener las coordenadas. Verifica la dirección, Plus Code o las coordenadas e intenta de nuevo.");
            return;
        }

        const placeData = {
            Name: placeName,
            City: city,
            Category: category,
            Latitude: coordinates.lat,
            Longitude: coordinates.lng
        };

        // Hacer la solicitud POST a la API para agregar el lugar
        const response = await fetch("https://cityvibess.bsite.net/api/Places/874", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(placeData)
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("Error de API:", responseData);
            throw new Error("Error al agregar el lugar");
        }

        alert("Lugar agregado correctamente");
        window.location.href = "profile.html"; // Redirigir al perfil

    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al agregar el lugar");
    }
});

// Función para obtener las coordenadas usando OpenCage API
async function getCoordinatesFromAddress(address) {
    const apiKey = "e85379f29adc48a7abdc67d1119871e0"; // Reemplaza con tu clave de OpenCage
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&language=es&pretty=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            console.error("No se encontraron coordenadas para la dirección proporcionada.");
            return null;
        }
    } catch (error) {
        console.error("Error al obtener coordenadas:", error);
        return null;
    }
}

// Función para obtener las coordenadas usando Plus Code con OpenCage
async function getCoordinatesFromPlusCode(plusCode) {
    const apiKey = "e85379f29adc48a7abdc67d1119871e0"; // Reemplaza con tu clave de OpenCage
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(plusCode)}&key=${apiKey}&language=es&pretty=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            console.error("No se encontraron coordenadas para el Plus Code proporcionado.");
            return null;
        }
    } catch (error) {
        console.error("Error al obtener coordenadas:", error);
        return null;
    }
}
