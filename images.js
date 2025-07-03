import {addUserLog, loadUserLogs} from "./commons.js";

// Funcionalidad para manejar imágenes
class ImageManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.images = this.loadImages();
        this.init();
    }

    // Obtener el usuario actual desde sessionStorage
    getCurrentUser() {
        const activeUser = sessionStorage.getItem('activeUser');
        console.log('Usuario activo en sessionStorage:', activeUser);
        
        if (!activeUser) {
            // Si no hay usuario activo, redirigir al login
            console.log('No hay usuario activo, redirigiendo al login...');
            window.location.href = '../HTML/singup.html';
            return null;
        }
        
        const userData = JSON.parse(activeUser);
        console.log('Usuario cargado:', userData);
        return userData;
    }

    // Cargar imágenes desde localStorage (solo del usuario actual)
    loadImages() {
        const savedImages = localStorage.getItem('userImages');
        const allImages = savedImages ? JSON.parse(savedImages) : [];
        
        // Filtrar solo las imágenes del usuario actual
        if (this.currentUser) {
            return allImages.filter(image => image.username === this.currentUser.username);
        }
        return [];
    }

    // Guardar imágenes en localStorage
    saveImages() {
        // Obtener todas las imágenes existentes
        const activeUser = sessionStorage.getItem('activeUser');
        const savedImages = localStorage.getItem('userImages');
        const allImages = savedImages ? JSON.parse(savedImages) : [];
        
        // Filtrar las imágenes de otros usuarios
        const otherUsersImages = allImages.filter(image => image.username !== this.currentUser.username);
        
        // Combinar las imágenes de otros usuarios con las del usuario actual
        const updatedImages = [...otherUsersImages, ...this.images];
        
        if (activeUser) {
            const userData = JSON.parse(activeUser);
            addUserLog(userData, "Imagen guardada", new Date().toISOString());
        }

        localStorage.setItem('userImages', JSON.stringify(updatedImages));
    }

    // Inicializar la aplicación
    init() {
        if (!this.currentUser) {
            return; // No inicializar si no hay usuario
        }
        this.renderImages();
        this.setupEventListeners();
    }

    // Configurar event listeners
    setupEventListeners() {
        console.log('Configurando event listeners...');
        const uploadButton = document.getElementById('uploadButton');
        const fileInput = document.getElementById('fileInput');
        
        console.log('uploadButton encontrado:', !!uploadButton);
        console.log('fileInput encontrado:', !!fileInput);
        
        if (uploadButton) {
            uploadButton.addEventListener('click', () => {
                console.log('Botón de subida clickeado');
                fileInput.click();
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                console.log('Archivos seleccionados:', e.target.files);
                this.handleFileUpload(e.target.files);
            });
        }
    }

    // Manejar la subida de archivos
    handleFileUpload(files) {
        console.log('handleFileUpload llamado con archivos:', files);
        Array.from(files).forEach(file => {
            console.log('Procesando archivo:', file.name, 'Tipo:', file.type);
            if (file.type.startsWith('image/')) {
                console.log('Archivo es imagen, llamando addImage...');
                this.addImage(file);
            } else {
                console.log('Archivo no es imagen, mostrando error...');
                this.showNotification('Por favor, selecciona solo archivos de imagen.', 'is-danger');
            }
        });
    }

    // Añadir una nueva imagen
    addImage(file) {
        console.log('Iniciando addImage con archivo:', file.name);
        const activeUser = sessionStorage.getItem('activeUser');
        const reader = new FileReader();
        
        reader.onload = (e) => {
            console.log('Archivo leído correctamente');
            const imageData = {
                id: Date.now() + Math.random(),
                name: file.name,
                size: this.formatFileSize(file.size),
                date: new Date().toLocaleDateString('es-ES'),
                dataUrl: e.target.result,
                type: file.type,
                username: this.currentUser.username // Agregar el username del usuario
            };

            console.log('Datos de imagen creados:', imageData);
            this.images.unshift(imageData);
            console.log('Imagen añadida al array, total de imágenes:', this.images.length);
            
            this.saveImages();
            this.renderImages();
            this.showNotification(`Imagen "${file.name}" añadida exitosamente.`, 'is-success');
            
            // Registrar en logs después de añadir la imagen
            if (activeUser) {
                const userData = JSON.parse(activeUser);
                addUserLog(userData, "Imagen Añadida", new Date().toISOString());
            }
        };
        
        reader.onerror = (error) => {
            console.error('Error al leer el archivo:', error);
            this.showNotification('Error al procesar la imagen.', 'is-danger');
        };
        
        reader.readAsDataURL(file);
    }

    // Eliminar una imagen
    removeImage(imageId) {
        const activeUser = sessionStorage.getItem('activeUser');
        const imageIndex = this.images.findIndex(img => img.id === imageId);
        if (imageIndex !== -1) {
            const imageName = this.images[imageIndex].name;
            this.images.splice(imageIndex, 1);
            this.saveImages();
            this.renderImages();
            this.showNotification(`Imagen "${imageName}" eliminada exitosamente.`, 'is-info');
            
            // Registrar en logs después de eliminar la imagen
            if (activeUser) {
                const userData = JSON.parse(activeUser);
                addUserLog(userData, "Imagen eliminada", new Date().toISOString());
            }
        }
    }

    // Renderizar las imágenes en la interfaz
    renderImages() {
        const imageGrid = document.getElementById('imageGrid');
        if (!imageGrid) return;

        if (this.images.length === 0) {
            imageGrid.innerHTML = `
                <div class="has-text-centered" style="grid-column: 1 / -1; padding: 40px;">
                    <p class="has-text-grey">No hay imágenes en tu galería</p>
                    <p class="has-text-grey is-size-7">Haz clic en "Subir Nueva Imagen" para comenzar</p>
                </div>
            `;
            return;
        }

        imageGrid.innerHTML = this.images.map((image, index) => `
            <div class="image-card" data-image-id="${image.id}" onclick="imageManager.openModal(${index})">
                <div class="image-container">
                    <img src="${image.dataUrl}" alt="${image.name}" class="image-preview">
                    <div class="image-overlay">
                        <button class="button is-danger is-small remove-btn" onclick="event.stopPropagation(); imageManager.removeImage(${image.id})">
                            <span class="icon">
                                <i class="fas fa-trash"></i>
                            </span>
                        </button>
                    </div>
                </div>
                <div class="image-info">
                    <p class="has-text-weight-semibold">${image.name}</p>
                    <p class="has-text-grey is-size-7">${image.size} • ${image.date}</p>
                </div>
            </div>
        `).join('');
    }

    // Formatear el tamaño del archivo
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Mostrar notificaciones
    showNotification(message, type = 'is-info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} is-light`;
        notification.innerHTML = `
            <button class="delete" onclick="this.parentElement.remove()"></button>
            ${message}
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(notification, container.firstChild);
        
        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Abrir modal de imagen
    openModal(imageIndex) {
        this.currentImageIndex = imageIndex;
        this.createModal();
        this.showModal();
    }

    // Crear modal
    createModal() {
        // Eliminar modal existente si hay uno
        const existingModal = document.getElementById('imageModal');
        if (existingModal) {
            existingModal.remove();
        }

        const image = this.images[this.currentImageIndex];
        const modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'image-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="imageManager.closeModal()">&times;</button>
                ${this.images.length > 1 ? `
                    <button class="modal-nav modal-prev" onclick="imageManager.prevImage()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="modal-nav modal-next" onclick="imageManager.nextImage()">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                ` : ''}
                <img src="${image.dataUrl}" alt="${image.name}" class="modal-image">
                <div class="modal-info">
                    <h3>${image.name}</h3>
                    <p>Tamaño: ${image.size}</p>
                    <p>Fecha: ${image.date}</p>
                    <p>Imagen ${this.currentImageIndex + 1} de ${this.images.length}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Cerrar modal con ESC
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Cerrar modal haciendo clic fuera de la imagen
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    // Mostrar modal
    showModal() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    // Cerrar modal
    closeModal() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    // Imagen anterior
    prevImage() {
        if (this.images.length > 1) {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
            this.createModal();
            this.showModal();
        }
    }

    // Imagen siguiente
    nextImage() {
        if (this.images.length > 1) {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            this.createModal();
            this.showModal();
        }
    }

    // Manejar teclas
    handleKeyDown(e) {
        switch(e.key) {
            case 'Escape':
                this.closeModal();
                break;
            case 'ArrowLeft':
                this.prevImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }
}

// Exportar la clase para uso como módulo
export { ImageManager };

// Inicializar el gestor de imágenes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.imageManager = new ImageManager();
    
    // Configurar drag and drop
    const dragArea = document.getElementById('dragArea');
    const fileInput = document.getElementById('fileInput');

    if (dragArea && fileInput) {
        // Prevenir comportamiento por defecto del navegador
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dragArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Resaltar área de drop
        ['dragenter', 'dragover'].forEach(eventName => {
            dragArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dragArea.addEventListener(eventName, unhighlight, false);
        });

        // Manejar archivos soltados
        dragArea.addEventListener('drop', handleDrop, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight(e) {
            dragArea.classList.add('dragover');
        }

        function unhighlight(e) {
            dragArea.classList.remove('dragover');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (window.imageManager) {
                window.imageManager.handleFileUpload(files);
            }
        }
    }
    
    // Cargar logs de usuario
    const userLogs = loadUserLogs();
}); 