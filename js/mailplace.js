document.addEventListener('DOMContentLoaded', async () => {
    const placeId = new URLSearchParams(window.location.search).get('id') || localStorage.getItem('lastPlaceId');

    if (!placeId) {
        Swal.fire('Error', 'No se encontró el ID del lugar para reportar.', 'error');
        return;
    }

    // Cargar detalles del lugar
    try {
        const response = await fetch(`https://cityvibess.bsite.net/api/places/${placeId}`);
        if (!response.ok) throw new Error("Error al obtener el lugar");

        const placeData = await response.json();

        // Mostrar ventana de reporte
        Swal.fire({
            title: `Reportar lugar: ${placeData.Name}`,
            html: `<textarea id="reportReason" class="swal2-textarea" placeholder="Escribe el motivo del reporte"></textarea>`,
            showCancelButton: true,
            confirmButtonText: 'Enviar reporte',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const reason = document.getElementById('reportReason').value;
                if (!reason) {
                    Swal.showValidationMessage('Por favor, escribe un motivo.');
                }
                return reason;
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                sendReportEmail(placeData, result.value);
            }
        });

    } catch (error) {
        console.error('Error al obtener los datos del lugar:', error);
        Swal.fire('Error', 'No se pudo cargar la información del lugar.', 'error');
    }

    function sendReportEmail(placeData, reason) {
        emailjs.init('h6Gu3dwXE4AjuiRjF');

        const templateParams = {
            place_name: placeData.Name,
            category: placeData.Category || 'No disponible',
            city: placeData.City || 'No disponible',
            reason: reason
        };

        emailjs.send('service_po2xndk', 'template_ruteu1k', templateParams)
            .then(() => {
                Swal.fire('¡Reporte enviado!', 'Gracias por ayudarnos a mantener la calidad del contenido.', 'success');
            }, (error) => {
                console.error('Error al enviar reporte:', error);
                Swal.fire('Error', 'Ocurrió un error al enviar el reporte.', 'error');
            });
    }
});
