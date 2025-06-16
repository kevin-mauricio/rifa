import { getTickets, saveTickets } from "../services/ticket.service.js";

let selectedTickets = [];
export let info = null;

export function printNumbers() {
    const divNumbers = document.getElementById('div_numbers');
    if (!divNumbers) return;

    getTickets().then(tickets => {
        console.log("Tickets:", tickets);
        divNumbers.innerHTML = '';

        let row = null;

        tickets.forEach((ticket, index) => {
            // Cada 10 botones, crea una nueva fila
            if (index % 10 === 0) {
                row = document.createElement('div');
                row.className = 'row mb-md-2 d-flex justify-content-center';
                divNumbers.appendChild(row);
            }

            const col = document.createElement('div');
            col.className = 'col-auto mb-2';

            const button = createButton(ticket);

            col.appendChild(button);
            row.appendChild(col);
        });
    });
}

function createButton(ticket) {
    const button = document.createElement('button');
    button.textContent = ticket.number;
    button.id = `ticket-${ticket.number}`;
    button.disabled = !ticket.available;
    button.className = 'btn btn-outline-primary w-100';
    button.disabled = ticket.available !== 'true';

    if (button.disabled) {
        button.classList.add('unavailable')
    }

    if (selectedTickets.length && selectedTickets.some(t => t.id === ticket.id)) {
        button.classList.add('selected')
    }

    button.addEventListener('click', () => {
        button.classList.toggle('selected');

        if (button.classList.contains('selected')) {
            selectedTickets.push(ticket);
        } else {
            /* eliminarlo de la lista */
            selectedTickets = selectedTickets.filter(t => t.number !== ticket.number);
        }

        const confirmar = document.getElementById('confirmar-btn');
        confirmar.disabled = !selectedTickets.length;

        console.log('boletas seleccionadas', selectedTickets)
    });

    return button;
}

export function setConfirmInfo() {
    const selectedNumbers = document.getElementById('selectedNumbers');

    selectedNumbers.innerHTML = 'Números seleccionados: ';
    /* let resum = '';
    selectedTickets.forEach((ticket, index) => {
        resum += `${ticket.number} ${index !== selectedTickets.length - 1 ? ' - ' : ''}`
    }); */
    selectedNumbers.innerHTML += setNumbers(selectedTickets);

    resetForm();
}

function resetForm() {
    const form = document.getElementById('formulario');

    form.reset(); // Limpia los campos
    form.classList.remove('was-validated');
}

export function save(e) {
    e.preventDefault(); // <- evita recarga

    const form = document.getElementById('formulario');

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    const body = {
        name: nombre,
        phone: telefono,
        tickets: JSON.stringify(selectedTickets)
    };

    console.log('body', body);
    saveTickets(body).then(response => {
        console.log("Respuesta del servidor:", response);
        const { status, unavailable, message } = response;

        if (status === 'error' && unavailable) {
            const alert = document.getElementById('confirmAlert');
            alert.hidden = false;
            alert.innerHTML = `${message} ${setNumbers(unavailable)} \n Por favor, acepta o selecciona otros números`;

            selectedTickets = selectedTickets.filter(ticket => {
                return !unavailable.some(un => un.id === ticket.id);
            });

            setConfirmInfo();
            printNumbers();
        }

        if (status === 'success') {
            resetForm();
            closeConfirmModal();
            showTickets(body);
        }
    });
}

function setNumbers(list) {
    let resum = '';
    list.forEach((ticket, index) => {
        resum += `${ticket.number} ${index !== list.length - 1 ? ' - ' : ''}`
    });

    return `( ${resum})`;
}

function closeConfirmModal() {
    const modalElement = document.getElementById('confirmModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    // Si no hay instancia aún (por ejemplo, si abriste con HTML)
    const modal = modalInstance || new bootstrap.Modal(modalElement);
    modal.hide();
}

/* function showTickets(ticketsInfo) {
    console.log('boletas compradas', ticketsInfo);

    setTimeout(() => {
        location.reload();
    },);
} */

export function showTickets(ticketsInfo) {
    const container = document.getElementById("boletas-container");
    container.innerHTML = ""; // limpia anteriores

    const { name, phone, tickets } = ticketsInfo;
    const parsedTickets = JSON.parse(tickets);

    const infoContainer = document.createElement('div');
    infoContainer.className = 'container'
    infoContainer.innerHTML = `
                        <div class="field"><strong>Premio:</strong> $5.000.000</div>
                        <div class="field"><strong>Valor boleta:</strong> $100.000</div>
                        <div class="field"><strong>Juega:</strong> Viernes, 19 de dic 2025 con las dos últimas cifras de la lotería de Risaralda</div>
                        <div class="info">Número invertido recupera la boleta</div>
                        <div class="field responsables">Responsables: Catalina Castillo (3157023755) - Kevin Mejía (3202152617)</div>
                    `;
    container.appendChild(infoContainer);

    parsedTickets.forEach(ticket => {
        const boleta = document.createElement("div");
        boleta.className = "boleta";

        boleta.innerHTML = `
            <h3>GRAN RIFA</h3>
            <div class="number">#${ticket.number}</div>
            <div class="field"><strong>Nombre:</strong> ${name}</div>
            <div class="field"><strong>Teléfono:</strong> ${phone}</div>
            <small>Nota: Boleta sin cancelar no juega</small>
        `;

        container.appendChild(boleta);
    });
    info = { clientName: name };
    openModalBoletas();
}

function openModalBoletas() {
    const modalElement = document.getElementById('boletas');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    // Si no hay instancia aún, créala
    const modal = modalInstance || new bootstrap.Modal(modalElement);
    modal.show(); // ← Mostrar el modal
}

export function formatDateDMY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque enero es 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
