import {loadUserLogs } from './commons.js';

const logsContainer = document.getElementById('logsContainer');
let AllUsersLogs = loadUserLogs();

console.log("Todos los logs:", AllUsersLogs);

function UserLogVerification(activeUser ){
    console.log("Usuario activo:", activeUser.username);
    if(AllUsersLogs.hasOwnProperty(activeUser.username)){
        const UserLogs  = AllUsersLogs[activeUser.username];
        console.log("Logs del usuario:", UserLogs);
        renderLogs(UserLogs, activeUser);
    } else {
        console.log("No hay logs para este usuario.");
    }
}

function renderLogs(ActualUserLog, activeUser){
    logsContainer.innerHTML = '';
    ActualUserLog.forEach(log => {
        logsContainer.innerHTML += `<div class="log-card">
            <div class="card">
                <div class="card-content">
                    <div class="content">
                        <strong>${log.date}</strong> - ${activeUser.username}: ${log.action}
                        <br>
                    </div>
                </div>
            </div>
        </div>`
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let activeUser = sessionStorage.getItem('activeUser');
    activeUser = JSON.parse(activeUser);
    UserLogVerification(activeUser);
});