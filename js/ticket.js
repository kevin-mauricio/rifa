import { getTickets, saveTickets } from "../services/ticket.service.js";

let selectedTickets = [];

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
    let resum = '';
    selectedTickets.forEach((ticket, index) => {
        resum += `${ticket.number} ${index !== selectedTickets.length - 1 ? ' - ' : ''}`
    });
    selectedNumbers.innerHTML += resum;

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
        if (response.status === 'success') {
            form.reset();
            form.classList.remove('was-validated');

            setTimeout(() => {
                location.reload();
            },);
        }
    });

}
