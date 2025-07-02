// Funcionalidad para manejar imágenes
class ImageManager {
    constructor() {
        this.images = this.loadImages();
        this.init();
    }

    // Cargar imágenes desde localStorage
    loadImages() {
        const savedImages = localStorage.getItem('userImages');
        return savedImages ? JSON.parse(savedImages) : [];
    }

    // Guardar imágenes en localStorage
    saveImages() {
        localStorage.setItem('userImages', JSON.stringify(this.images));
    }

    // Inicializar la aplicación
    init() {
        this.renderImages();
        this.setupEventListeners();
    }

    // Configurar event listeners
    setupEventListeners() {
        const uploadButton = document.getElementById('uploadButton');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadButton) {
            uploadButton.addEventListener('click', () => {
                fileInput.click();
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    // Manejar la subida de archivos
    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                this.addImage(file);
            } else {
                this.showNotification('Por favor, selecciona solo archivos de imagen.', 'is-danger');
            }
        });
    }

    // Añadir una nueva imagen
    addImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                id: Date.now() + Math.random(),
                name: file.name,
                size: this.formatFileSize(file.size),
                date: new Date().toLocaleDateString('es-ES'),
                dataUrl: e.target.result,
                type: file.type
            };

            this.images.unshift(imageData);
            this.saveImages();
            this.renderImages();
            this.showNotification(`Imagen "${file.name}" añadida exitosamente.`, 'is-success');
        };
        reader.readAsDataURL(file);
    }

    // Eliminar una imagen
    removeImage(imageId) {
        const imageIndex = this.images.findIndex(img => img.id === imageId);
        if (imageIndex !== -1) {
            const imageName = this.images[imageIndex].name;
            this.images.splice(imageIndex, 1);
            this.saveImages();
            this.renderImages();
            this.showNotification(`Imagen "${imageName}" eliminada exitosamente.`, 'is-info');
        }
    }

    // Renderizar las imágenes en la interfaz
    renderImages() {
        const imageGrid = document.getElementById('imageGrid');
        if (!imageGrid) return;

        if (this.images.length === 0) {
            imageGrid.innerHTML = `
                <div class="has-text-centered" style="grid-column: 1 / -1; padding: 40px;">
                    <p class="has-text-grey">No hay imágenes en la galería</p>
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

// Inicializar el gestor de imágenes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.imageManager = new ImageManager();
}); 