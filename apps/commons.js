let userLogs = {};

export let activeUser = sessionStorage.getItem('activeUser');
    activeUser = JSON.parse(activeUser);
    
console.log("Usuario activo:", activeUser.username);
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