export function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";
}

export function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
}

const api = 'https://script.google.com/macros/s/AKfycbwmUmDVGJSFV6rc7QoPFNIAM4zJ_0lGmOVA_x06_Y-KFDm0rJNlWMjGTOGa9aCLSXC5Qw/exec';

export async function getTickets() {
    showLoader();
    try {
        const response = await fetch(api);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return [];
    } finally {
        hideLoader();
    }
}

export async function saveTickets(body) {
    showLoader();
    const formData = new URLSearchParams(body);
    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error al guardar los datos:", error);
        return { status: "error", message: error.message };
    } finally {
        hideLoader();
    }
}

