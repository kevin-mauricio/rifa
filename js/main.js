import { sendBoletasByEmail } from './email.js';
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

document.querySelector('#boletas .btn.btn-primary').addEventListener('click', async () => {
    const element = document.getElementById('boletas-container');
    const { clientName } = info;
    const date = formatDateDMY(new Date());
    const filename = `boletas-${clientName}-${date}.pdf`

    const opt = {
        margin: 0.2,
        filename: filename,
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


    try {
        // Generar PDF como blob
        const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
        // Descargar el PDF
        html2pdf().set(opt).from(element).save();
        // Enviar por correo
        sendBoletasByEmail(pdfBlob, filename, clientName, 'andrealancastillo@gmail.com');
        // Recargar solo después de un pequeño retraso para permitir descarga y envío
        setTimeout(() => location.reload(), 3000);

    } catch (error) {
        console.error("Error al generar o descargar el PDF:", error);
    }
});

