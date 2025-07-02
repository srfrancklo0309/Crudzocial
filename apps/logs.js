import {loadUserLogs } from './commons.js';

const logsContainer = document.getElementById('logsContainer');
let AllUsersLogs = loadUserLogs();

console.log("Todos los logs:", AllUsersLogs);

function UserLogVerification(activeUser ){
    console.log("Usuario activo:", activeUser);
    if(AllUsersLogs.hasOwnProperty(activeUser)){
        const UserLogs  = AllUsersLogs[activeUser];
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
                        <strong>${log.date}</strong> - ${activeUser}: ${log.action}
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
    activeUser = activeUser.username;
    UserLogVerification(activeUser);
});