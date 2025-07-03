import {addUserLog, loadUserLogs} from "./commons.js";

// Image management functionality
class ImageManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.images = this.loadImages();
        this.init();
    }

    // Get current user from sessionStorage
    getCurrentUser() {
        const activeUser = sessionStorage.getItem('activeUser');
        console.log('Active user in sessionStorage:', activeUser);
        
        if (!activeUser) {
            // If no active user, redirect to login
            console.log('No active user, redirecting to login...');
            window.location.href = '../HTML/singup.html';
            return null;
        }
        
        const userData = JSON.parse(activeUser);
        console.log('User loaded:', userData);
        return userData;
    }

    // Load images from localStorage (only from current user)
    loadImages() {
        const savedImages = localStorage.getItem('userImages');
        const allImages = savedImages ? JSON.parse(savedImages) : [];
        
        // Filter only images from current user
        if (this.currentUser) {
            return allImages.filter(image => image.username === this.currentUser.username);
        }
        return [];
    }

    // Save images to localStorage
    saveImages() {
        // Get all existing images
        const activeUser = sessionStorage.getItem('activeUser');
        const savedImages = localStorage.getItem('userImages');
        const allImages = savedImages ? JSON.parse(savedImages) : [];
        
        // Filter images from other users
        const otherUsersImages = allImages.filter(image => image.username !== this.currentUser.username);
        
        // Combine other users' images with current user's images
        const updatedImages = [...otherUsersImages, ...this.images];
        
        if (activeUser) {
            const userData = JSON.parse(activeUser);
            addUserLog(userData, "Image saved", new Date().toISOString());
        }

        localStorage.setItem('userImages', JSON.stringify(updatedImages));
    }

    // Initialize the application
    init() {
        if (!this.currentUser) {
            return; // Don't initialize if no user
        }
        this.renderImages();
        this.setupEventListeners();
    }

    // Setup event listeners
    setupEventListeners() {
        console.log('Setting up event listeners...');
        const uploadButton = document.getElementById('uploadButton');
        const fileInput = document.getElementById('fileInput');
        
        console.log('uploadButton found:', !!uploadButton);
        console.log('fileInput found:', !!fileInput);
        
        if (uploadButton) {
            uploadButton.addEventListener('click', () => {
                console.log('Upload button clicked');
                fileInput.click();
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                console.log('Files selected:', e.target.files);
                this.handleFileUpload(e.target.files);
            });
        }
    }

    // Handle file upload
    handleFileUpload(files) {
        console.log('handleFileUpload called with files:', files);
        Array.from(files).forEach(file => {
            console.log('Processing file:', file.name, 'Type:', file.type);
            if (file.type.startsWith('image/')) {
                console.log('File is image, calling addImage...');
                this.addImage(file);
            } else {
                console.log('File is not image, showing error...');
                this.showNotification('Please select only image files.', 'is-danger');
            }
        });
    }

    // Add a new image
    addImage(file) {
        console.log('Starting addImage with file:', file.name);
        const activeUser = sessionStorage.getItem('activeUser');
        const reader = new FileReader();
        
        reader.onload = (e) => {
            console.log('File read successfully');
            const imageData = {
                id: Date.now() + Math.random(),
                name: file.name,
                size: this.formatFileSize(file.size),
                date: new Date().toLocaleDateString('en-US'),
                dataUrl: e.target.result,
                type: file.type,
                username: this.currentUser.username // Add user username
            };

            console.log('Image data created:', imageData);
            this.images.unshift(imageData);
            console.log('Image added to array, total images:', this.images.length);
            
            this.saveImages();
            this.renderImages();
            this.showNotification(`Image "${file.name}" added successfully.`, 'is-success');
            
            // Log after adding image
            if (activeUser) {
                const userData = JSON.parse(activeUser);
                addUserLog(userData, "Image Added", new Date().toISOString());
            }
        };
        
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            this.showNotification('Error processing image.', 'is-danger');
        };
        
        reader.readAsDataURL(file);
    }

    // Remove an image
    removeImage(imageId) {
        const activeUser = sessionStorage.getItem('activeUser');
        const imageIndex = this.images.findIndex(img => img.id === imageId);
        if (imageIndex !== -1) {
            const imageName = this.images[imageIndex].name;
            this.images.splice(imageIndex, 1);
            this.saveImages();
            this.renderImages();
            this.showNotification(`Image "${imageName}" removed successfully.`, 'is-info');
            
            // Log after removing image
            if (activeUser) {
                const userData = JSON.parse(activeUser);
                addUserLog(userData, "Image removed", new Date().toISOString());
            }
        }
    }

    // Render images in the interface
    renderImages() {
        const imageGrid = document.getElementById('imageGrid');
        if (!imageGrid) return;

        if (this.images.length === 0) {
            imageGrid.innerHTML = `
                <div class="has-text-centered" style="grid-column: 1 / -1; padding: 40px;">
                    <p class="has-text-grey">No images in your gallery</p>
                    <p class="has-text-grey is-size-7">Click on "Upload New Image" to start</p>
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

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Show notifications
    showNotification(message, type = 'is-info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} is-light`;
        notification.innerHTML = `
            <button class="delete" onclick="this.parentElement.remove()"></button>
            ${message}
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(notification, container.firstChild);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Open image modal
    openModal(imageIndex) {
        this.currentImageIndex = imageIndex;
        this.createModal();
        this.showModal();
    }

    // Create modal
    createModal() {
        // Remove existing modal if there is one
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
        
        // Close modal with ESC
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Close modal by clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    // Show modal
    showModal() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    // Close modal
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

    // Previous image
    prevImage() {
        if (this.images.length > 1) {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
            this.createModal();
            this.showModal();
        }
    }

    // Next image
    nextImage() {
        if (this.images.length > 1) {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            this.createModal();
            this.showModal();
        }
    }

    // Handle keys
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

// Export class for module use
export { ImageManager };

// Initialize image manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.imageManager = new ImageManager();
    
    // Setup drag and drop
    const dragArea = document.getElementById('dragArea');
    const fileInput = document.getElementById('fileInput');

    if (dragArea && fileInput) {
        // Prevent default browser behavior
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dragArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop area
        ['dragenter', 'dragover'].forEach(eventName => {
            dragArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dragArea.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
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
    
    // Load user logs
    const userLogs = loadUserLogs();
}); 