import { addUserLog, loadUserLogs, activeUser } from './commons.js';

const nuevaNotaBtn = document.getElementById('nuevaNotaBtn');
const notasContainer = document.getElementById('notasContainer');
const notaModal = document.getElementById('notaModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelarModalBtn = document.getElementById('cancelarModalBtn');
const guardarNotaBtn = document.getElementById('guardarNotaBtn');
const modalTitle = document.getElementById('modalTitle');

const notaTituloInput = document.getElementById('notaTitulo');
const notaContenidoTextarea = document.getElementById('notaContenido');
const notaEtiquetaInput = document.getElementById('notaEtiqueta');
const notaTipoEtiquetaSelect = document.getElementById('notaTipoEtiqueta');

// Variable global para almacenar las notas
let notas = [];

let userLogs = {};

// Variable para saber si estamos editando una nota existente o creando una nueva
let notaEditandoId = null;

// --- Funciones de Utilidad ---

// Función para generar un ID único (simple para este ejemplo)
function generarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Función para obtener la fecha actual en formato dd/mm/yyyy
function obtenerFechaActual() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

// --- Gestión de Local Storage ---

// Cargar notas desde Local Storage
function cargarNotas() {
    const notasGuardadas = localStorage.getItem('notas');
    if (notasGuardadas) {
        notas = JSON.parse(notasGuardadas);
    } else {
        notas = {}; // Si no hay notas, inicializar como array vacío
    }
    renderizarNotas(); // Una vez cargadas, renderizarlas en la UI
}

// Guardar notas en Local Storage
function guardarNotas() {
    localStorage.setItem('notas', JSON.stringify(notas));
}

// --- Renderizado de Notas ---

// Función para crear el HTML de una nota
function crearHtmlNota(nota) {
    const noteCardDiv = document.createElement('div');
    noteCardDiv.classList.add('note-card');
    noteCardDiv.dataset.id = nota.id; // Guarda el ID de la nota en el dataset

    const tagHtml = nota.etiqueta ? 
        `<div class="card-header-icon">
            <span class="tag ${nota.tipoEtiqueta}">${nota.etiqueta}</span>
        </div>` : '';

    noteCardDiv.innerHTML = `
        <div class="card">
            <header class="card-header">
                <p class="card-header-title">
                    ${nota.titulo}
                </p>
                ${tagHtml}
            </header>
            <div class="card-content">
                <div class="content">
                    ${nota.contenido.replace(/\n/g, '<br>')} <br>
                    <small class="has-text-grey">Creada: ${nota.fechaCreacion}</small>
                </div>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item editar-nota-btn" data-id="${nota.id}">
                    <span class="icon">
                        <i class="fa fa-edit"></i>
                    </span>
                    Editar
                </a>
                <a href="#" class="card-footer-item eliminar-nota-btn" data-id="${nota.id}">
                    <span class="icon">
                        <i class="fa fa-trash"></i>
                    </span>
                    Eliminar
                </a>
            </footer>
        </div>
    `;
    return noteCardDiv;
}

// Función para renderizar todas las notas
function renderizarNotas() {
    notasContainer.innerHTML = ''; // Limpiar el contenedor actual
    if (notas.length === 0) {
        notasContainer.innerHTML = '<p class="has-text-centered has-text-grey">No hay notas. ¡Cree una nueva!</p>';
        return;
    }
    notas.forEach(nota => {
        notasContainer.appendChild(crearHtmlNota(nota));
    });

    // AñadirEventListeners después de renderizar para los nuevos botones
    agregarEventListenersNotas();
}

// --- Manejadores de Eventos ---

// Abre el modal para una nueva nota
nuevaNotaBtn.addEventListener('click', () => {
    modalTitle.textContent = "Nueva Nota";
    notaTituloInput.value = '';
    notaContenidoTextarea.value = '';
    notaEtiquetaInput.value = '';
    notaTipoEtiquetaSelect.value = 'is-info'; // Valor por defecto
    notaEditandoId = null; // No estamos editando
    notaModal.classList.add('is-active');
});

// Cierra el modal
closeModalBtn.addEventListener('click', () => {
    notaModal.classList.remove('is-active');
});

cancelarModalBtn.addEventListener('click', () => {
    notaModal.classList.remove('is-active');
});

// Guarda la nota (nueva o editada)
guardarNotaBtn.addEventListener('click', () => {
    const titulo = notaTituloInput.value.trim();
    const contenido = notaContenidoTextarea.value.trim();
    const etiqueta = notaEtiquetaInput.value.trim();
    const tipoEtiqueta = notaTipoEtiquetaSelect.value;

    if (!titulo || !contenido) {
        alert('Por favor, ingrese un título y contenido para la nota.');
        return;
    }

    if (notaEditandoId) {
        // Editar nota existente
        const notaIndex = notas.findIndex(n => n.id === notaEditandoId);
        if (notaIndex !== -1) {
            notas[notaIndex].titulo = titulo;
            notas[notaIndex].contenido = contenido;
            notas[notaIndex].etiqueta = etiqueta;
            notas[notaIndex].tipoEtiqueta = tipoEtiqueta;

            addUserLog(activeUser, 'Edición de nota', new Date().toISOString());
        }
    } else {
        // Crear nueva nota
        const nuevaNota = {
            id: generarIdUnico(),
            titulo: titulo,
            contenido: contenido,
            etiqueta: etiqueta,
            tipoEtiqueta: tipoEtiqueta,
            fechaCreacion: obtenerFechaActual()
        };
        notas.push(nuevaNota);
        addUserLog(activeUser, 'Creación de nota', new Date().toISOString());
    }

    guardarNotas(); // Guardar en Local Storage
    renderizarNotas(); // Actualizar la UI
    notaModal.classList.remove('is-active'); // Cerrar modal
});

// Función para agregar EventListeners a los botones de editar/eliminar (se llama después de cada renderizado)
function agregarEventListenersNotas() {
    document.querySelectorAll('.editar-nota-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.currentTarget.dataset.id;
            const notaAEditar = notas.find(n => n.id === id);

            if (notaAEditar) {
                modalTitle.textContent = "Editar Nota";
                notaTituloInput.value = notaAEditar.titulo;
                notaContenidoTextarea.value = notaAEditar.contenido;
                notaEtiquetaInput.value = notaAEditar.etiqueta || ''; // Si no hay etiqueta, poner vacío
                notaTipoEtiquetaSelect.value = notaAEditar.tipoEtiqueta || ''; // Si no hay tipo, poner vacío
                notaEditandoId = id; // Guardar el ID de la nota que se está editando
                notaModal.classList.add('is-active');
            }
        });
    });

    document.querySelectorAll('.eliminar-nota-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.currentTarget.dataset.id;
            if (confirm('¿Está seguro de que desea eliminar esta nota?')) {
                notas = notas.filter(nota => nota.id !== id);
                guardarNotas(); // Guardar en Local Storage
                renderizarNotas(); // Actualizar la UI
                addUserLog(activeUser, 'Eliminación de nota', new Date().toISOString());
            }
        });
    });
}

// --- Inicialización ---
// Cargar notas al iniciar la aplicación
document.addEventListener('DOMContentLoaded', () =>{ 
    cargarNotas();
    loadUserLogs();
});