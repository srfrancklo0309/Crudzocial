
function saveUserLogs(userLogs) {
    localStorage.setItem(`userLogs`, JSON.stringify(userLogs));
}

export function addUserLog(userLogs, username, action, date) {
    if (!userLogs[username]) {
        userLogs[username] = [];
    }
    userLogs[username].push({
        'action': action,
        'date': date,
    });
    saveUserLogs(userLogs);
}

export function loadUserLogs( userLogs ) {
    const userLogsInfo = JSON.parse(localStorage.getItem('userLogs'));
    if (userLogsInfo !== null) {
        userLogs = userLogsInfo;
    }
}