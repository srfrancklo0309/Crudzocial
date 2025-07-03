import { activeUser, addUserLog, loadUserLogs } from './commons.js';

document.addEventListener('DOMContentLoaded', () => {
    let user = null;
    let users = {};

    loadUserLogs();
    
    // Cargar usuario activo
    if (sessionStorage.getItem('activeUser')) {
        user = JSON.parse(sessionStorage.getItem('activeUser'));
    } else if (localStorage.getItem('activeUser')) {
        user = JSON.parse(localStorage.getItem('activeUser'));
    }
    
    // Cargar todos los usuarios
    const usersInfo = JSON.parse(localStorage.getItem('users'));
    if (usersInfo !== null) {
        users = usersInfo;
    }

    // Mapeo de campos del formulario con claves del usuario
    const fields = [
        { id: 0, key: 'nombres', default: 'Ingresa tus nombres' },
        { id: 1, key: 'apellidos', default: 'Ingresa tus apellidos' },
        { id: 2, key: 'email', default: 'Ingresa tu correo electrónico' },
        { id: 3, key: 'telefono', default: 'Ingresa tu teléfono' },
        { id: 4, key: 'pais', default: 'Ingresa tu país' },
        { id: 5, key: 'ciudad', default: 'Ingresa tu ciudad' },
        { id: 6, key: 'direccion', default: 'Ingresa tu dirección' },
        { id: 7, key: 'codigoPostal', default: 'Ingresa tu código postal' },
    ];

    const inputs = document.querySelectorAll('.box input.input');

    fields.forEach((field, index) => {
        if (inputs[index]){
            if (user && user[field.key]) {
                inputs[index].placeholder = user[field.key];
            } else {
                inputs[index].placeholder = field.default;
            }
        }
    });

    // Función para guardar los cambios en localStorage
    function saveProfileChanges() {
        if (!user || !user.username) {
            alert('Error: No se encontró información del usuario');
            return;
        }
        
        // Actualizar la información del usuario específico
        fields.forEach((field, index) => {
            if (inputs[index]) {
                const value = inputs[index].value.trim();
                if (value) {
                    // Actualizar en el objeto users
                    if (users[user.username]) {
                        users[user.username][field.key] = value;
                    }
                    // Actualizar en el usuario activo
                    user[field.key] = value;
                }
            }
        });

        // Guardar el objeto users actualizado
        localStorage.setItem('users', JSON.stringify(users));
        
        // Actualizar el usuario activo en sessionStorage
        sessionStorage.setItem('activeUser', JSON.stringify(user));
        
        alert('Perfil actualizado correctamente');
        window.location.reload();
    }

    // Agregar evento al botón 'Actualizar'
    const updateButton = document.querySelector('button[type="submit"]');
    if (updateButton) {
        updateButton.addEventListener('click', (element) => {
            element.preventDefault(); // Prevenir envío del formulario
            saveProfileChanges();
            addUserLog(activeUser, 'Actualización de perfil', new Date().toISOString());
        });
    }
});
