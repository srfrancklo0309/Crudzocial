let userLogs = {};

export let activeUser = null;

// Función para actualizar el usuario activo desde sessionStorage
export function updateActiveUser() {
    const activeUserData = sessionStorage.getItem('activeUser');
    if (activeUserData) {
        try {
            activeUser = JSON.parse(activeUserData);
        } catch (error) {
            console.error('Error al parsear usuario activo:', error);
            activeUser = null;
        }
    } else {
        activeUser = null;
    }
    return activeUser;
}

// Inicializar el usuario activo al cargar el módulo
updateActiveUser();

function saveUserLogs() {
    localStorage.setItem('userLogs', JSON.stringify(userLogs));
}

export function addUserLog(activeUser, action, date) {
    if (!userLogs[activeUser.username]) {
        userLogs[activeUser.username] = [];
    }
    userLogs[activeUser.username].push({
        'action': action,
        'date': date,
    });
    saveUserLogs();
}

export function loadUserLogs() {
    const userLogsInfo = JSON.parse(localStorage.getItem('userLogs'));
    if (userLogsInfo !== null) {
        userLogs = userLogsInfo;
    }
    return userLogs;
}

export function getUserLogs(activeUser) {
    return userLogs[activeUser.username] || [];
}

//





