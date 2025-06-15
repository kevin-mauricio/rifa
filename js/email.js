export function sendBoletasByEmail(pdfBlob, filename, clientName, clientEmail) {
    const reader = new FileReader();

    reader.onloadend = async () => {
        const base64PDF = reader.result.split(',')[1]; // eliminar encabezado data:

        const body = {
            name: clientName,
            email: clientEmail,
            filename: filename,
            pdfBase64: base64PDF
        };

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbw7GBk70Rmcce62Kyv6WxpUDVMpFgGcFXcMeI8paKg7oD1Gge3CYAqbCyvhsjrFW1jhqg/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams(body).toString()
            });

            const data = await response.json();
            console.log("Correo enviado:", data);
        } catch (err) {
            console.error("Error al enviar correo:", err);
        }
    };

    reader.readAsDataURL(pdfBlob);
}
