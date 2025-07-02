let userLogs = {};

export let activeUser = sessionStorage.getItem('activeUser');
    activeUser = JSON.parse(activeUser);
    activeUser = activeUser.username;

function saveUserLogs() {
    localStorage.setItem('userLogs', JSON.stringify(userLogs));
}

export function addUserLog(activeUser, action, date) {
    if (!userLogs[activeUser]) {
        userLogs[activeUser] = [];
    }
    userLogs[activeUser].push({
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
    return userLogs[activeUser] || [];
}