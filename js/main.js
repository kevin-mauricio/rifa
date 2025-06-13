import { printNumbers, save, setConfirmInfo } from './ticket.js';

document.addEventListener('DOMContentLoaded', () => {
    printNumbers();
});

// Validación al enviar el formulario
document.getElementById('formulario').addEventListener('submit', function (e) {
    if (!this.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
    }
    this.classList.add('was-validated');
});

document.getElementById('confirmar-btn').addEventListener('click', function () {
    setConfirmInfo();
});

document.getElementById('formulario').addEventListener('submit', save);