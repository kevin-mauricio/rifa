import { formatDateDMY, info, printNumbers, save, setConfirmInfo } from './ticket.js';

document.addEventListener('DOMContentLoaded', () => {
    printNumbers();
    const confirmar = document.getElementById('confirmar-btn');
    confirmar.disabled = true;
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

document.getElementById('confirmModal').addEventListener('hidden.bs.modal', () => {
    console.log('El modal se cerró');
    // Aquí puedes limpiar el formulario, resetear estados, etc.
    const alert = document.getElementById('confirmAlert');
    alert.hidden = true;
});

document.querySelector('#boletas .btn.btn-primary').addEventListener('click', () => {
    const element = document.getElementById('boletas-container');
    const { clientName } = info;
    const date = formatDateDMY(new Date());
    const opt = {
        margin: 0.2,
        filename: `boletas-${clientName}-${date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            scrollY: 0,
            scrollX: 0,
            useCORS: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
});
