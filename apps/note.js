import { addUserLog, loadUserLogs, activeUser, updateActiveUser } from './commons.js';

const newNoteBtn = document.getElementById('nuevaNotaBtn');
const notesContainer = document.getElementById('notasContainer');
const noteModal = document.getElementById('notaModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelarModalBtn');
const saveNoteBtn = document.getElementById('guardarNotaBtn');
const modalTitle = document.getElementById('modalTitle');

const noteTitleInput = document.getElementById('notaTitulo');
const noteContentTextarea = document.getElementById('notaContenido');
const noteTagInput = document.getElementById('notaEtiqueta');
const noteTagTypeSelect = document.getElementById('notaTipoEtiqueta');

// Variable global para almacenar las notas del usuario actual
let notes = [];

let userLogs = {};

// Variable para saber si estamos editando una nota existente o creando una nueva
let editingNoteId = null;

// Función para obtener la clave de notas del usuario actual
function getNotesKey() {
    if (!activeUser || !activeUser.username) {
        console.error('No hay usuario activo');
        return null;
    }
    return `notas_${activeUser.username}`;
}

// Función para limpiar y validar datos corruptos
function cleanCorruptedData() {
    try {
        const notesKey = getNotesKey();
        if (!notesKey) return [];
        
        const savedNotes = localStorage.getItem(notesKey);
        if (savedNotes) {
            const parsedNotes = JSON.parse(savedNotes);
            // Si las notas no son un array, limpiar y crear uno nuevo
            if (!Array.isArray(parsedNotes)) {
                console.warn('Datos de notas corruptos detectados, limpiando...');
                localStorage.removeItem(notesKey);
                return [];
            }
            return parsedNotes;
        }
    } catch (error) {
        console.error('Error al cargar notas:', error);
        const notesKey = getNotesKey();
        if (notesKey) {
            localStorage.removeItem(notesKey);
        }
        return [];
    }
    return [];
}

// --- Funciones de Utilidad ---

// Función para generar un ID único (simple para este ejemplo)
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Función para obtener la fecha actual en formato dd/mm/yyyy
function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

// --- Gestión de Local Storage ---

// Cargar notas desde Local Storage
function loadNotes() {
    if (!activeUser || !activeUser.username) {
        console.warn('No hay usuario activo, no se pueden cargar notas');
        notes = [];
        renderNotes();
        return;
    }
    
    notes = cleanCorruptedData();
    renderNotes(); // Una vez cargadas, renderizarlas en la UI
}

// Guardar notas en Local Storage
function saveNotes() {
    const notesKey = getNotesKey();
    if (notesKey) {
        localStorage.setItem(notesKey, JSON.stringify(notes));
    }
}

// --- Renderizado de Notas ---

// Función para crear el HTML de una nota
function createNoteHtml(note) {
    const noteCardDiv = document.createElement('div');
    noteCardDiv.classList.add('note-card');
    noteCardDiv.dataset.id = note.id; // Guarda el ID de la nota en el dataset

    const tagHtml = note.etiqueta ? 
        `<div class="card-header-icon">
            <span class="tag ${note.tipoEtiqueta}">${note.etiqueta}</span>
        </div>` : '';

    noteCardDiv.innerHTML = `
        <div class="card">
            <header class="card-header">
                <p class="card-header-title">
                    ${note.titulo}
                </p>
                ${tagHtml}
            </header>
            <div class="card-content">
                <div class="content">
                    ${note.contenido.replace(/\n/g, '<br>')} <br>
                    <small class="has-text-grey">Creada: ${note.fechaCreacion}</small>
                </div>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item edit-note-btn" data-id="${note.id}">
                    <span class="icon">
                        <i class="fa fa-edit"></i>
                    </span>
                    Editar
                </a>
                <a href="#" class="card-footer-item delete-note-btn" data-id="${note.id}">
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
function renderNotes() {
    notesContainer.innerHTML = ''; // Limpiar el contenedor actual
    
    if (!activeUser || !activeUser.username) {
        notesContainer.innerHTML = '<p class="has-text-centered has-text-grey">Debe iniciar sesión para ver sus notas.</p>';
        return;
    }
    
    if (notes.length === 0) {
        notesContainer.innerHTML = '<p class="has-text-centered has-text-grey">No hay notas. ¡Cree una nueva!</p>';
        return;
    }
    notes.forEach(note => {
        notesContainer.appendChild(createNoteHtml(note));
    });

    // AñadirEventListeners después de renderizar para los nuevos botones
    addNoteEventListeners();
}

// --- Manejadores de Eventos ---

// Abre el modal para una nueva nota
newNoteBtn.addEventListener('click', () => {
    if (!activeUser || !activeUser.username) {
        alert('Debe iniciar sesión para crear notas.');
        return;
    }
    
    modalTitle.textContent = "Nueva Nota";
    noteTitleInput.value = '';
    noteContentTextarea.value = '';
    noteTagInput.value = '';
    noteTagTypeSelect.value = 'is-info'; // Valor por defecto
    editingNoteId = null; // No estamos editando
    noteModal.classList.add('is-active');
});

// Cierra el modal
closeModalBtn.addEventListener('click', () => {
    noteModal.classList.remove('is-active');
});

cancelModalBtn.addEventListener('click', () => {
    noteModal.classList.remove('is-active');
});

// Guarda la nota (nueva o editada)
saveNoteBtn.addEventListener('click', () => {
    if (!activeUser || !activeUser.username) {
        alert('Debe iniciar sesión para guardar notas.');
        return;
    }
    
    const title = noteTitleInput.value.trim();
    const content = noteContentTextarea.value.trim();
    const tag = noteTagInput.value.trim();
    const tagType = noteTagTypeSelect.value;

    if (!title || !content) {
        alert('Por favor, ingrese un título y contenido para la nota.');
        return;
    }

    if (editingNoteId) {
        // Editar nota existente
        const noteIndex = notes.findIndex(n => n.id === editingNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex].titulo = title;
            notes[noteIndex].contenido = content;
            notes[noteIndex].etiqueta = tag;
            notes[noteIndex].tipoEtiqueta = tagType;

            addUserLog(activeUser, 'Edición de nota', new Date().toISOString());
        }
    } else {
        // Crear nueva nota
        const newNote = {
            id: generateUniqueId(),
            titulo: title,
            contenido: content,
            etiqueta: tag,
            tipoEtiqueta: tagType,
            fechaCreacion: getCurrentDate(),
            usuario: activeUser.username // Agregar información del usuario
        };
        notes.push(newNote);
        addUserLog(activeUser, 'Creación de nota', new Date().toISOString());
    }

    saveNotes(); // Guardar en Local Storage
    renderNotes(); // Actualizar la UI
    noteModal.classList.remove('is-active'); // Cerrar modal
});

// Función para agregar EventListeners a los botones de editar/eliminar (se llama después de cada renderizado)
function addNoteEventListeners() {
    document.querySelectorAll('.edit-note-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.currentTarget.dataset.id;
            const noteToEdit = notes.find(n => n.id === id);

            if (noteToEdit) {
                modalTitle.textContent = "Editar Nota";
                noteTitleInput.value = noteToEdit.titulo;
                noteContentTextarea.value = noteToEdit.contenido;
                noteTagInput.value = noteToEdit.etiqueta || ''; // Si no hay etiqueta, poner vacío
                noteTagTypeSelect.value = noteToEdit.tipoEtiqueta || ''; // Si no hay tipo, poner vacío
                editingNoteId = id; // Guardar el ID de la nota que se está editando
                noteModal.classList.add('is-active');
            }
        });
    });

    document.querySelectorAll('.delete-note-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.currentTarget.dataset.id;
            if (confirm('¿Está seguro de que desea eliminar esta nota?')) {
                notes = notes.filter(note => note.id !== id);
                saveNotes(); // Guardar en Local Storage
                renderNotes(); // Actualizar la UI
                addUserLog(activeUser, 'Eliminación de nota', new Date().toISOString());
            }
        });
    });
}

// --- Inicialización ---
// Cargar notas al iniciar la aplicación
document.addEventListener('DOMContentLoaded', () =>{ 
    console.log('Inicializando sistema de notas...');
    loadUserLogs();
    updateActiveUser(); // Actualizar el usuario activo
    loadNotes();
    console.log('Sistema de notas inicializado. Usuario:', activeUser?.username, 'Notas cargadas:', notes.length);
});

// Función para recargar notas cuando cambie el usuario (puede ser llamada desde otros archivos)
export function reloadUserNotes() {
    updateActiveUser(); // Actualizar el usuario activo antes de recargar
    loadNotes();
}