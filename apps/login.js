import { addUserLog, loadUserLogs, activeUser } from './commons.js';

const usernameTag = document.getElementById('username');
const passwordTag = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const bottomRightNotificationLogin = document.getElementById('bottomRightNotificationLogin');
const bottomRightNotificationTextLogin = document.getElementById('bottomRightNotificationTextLogin');

const userLog = usernameTag.value

let users = {};
let userLogs = {};

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadUserLogs();
});

function loadUsers() {
    const usersInfo = JSON.parse(localStorage.getItem('users'));
    if (usersInfo !== null) {
        users = usersInfo;
    }

}

function loadExistingUser(username) {
    if (users[username] !== undefined) {    
        return users[username];
    }
    return null;
}

function isFilledFields(username, password) {
    if (username === '' || password === '') {
        bottomRightNotificationTextLogin.textContent = 'El nombre de usuario y la contraseña son requeridos';
        bottomRightNotificationLogin.style.display = 'block';
        console.log('El nombre de usuario y la contraseña son requeridos');
        setTimeout(() => {
            bottomRightNotificationLogin.style.display = 'none';
        }, 4000);
        usernameTag.focus();
        return false;
    }
    return true;
}

function isUserValid(username) {
    const user = loadExistingUser(username);
    if (user === null) {
        bottomRightNotificationTextLogin.textContent = 'El nombre de usuario no existe';
        bottomRightNotificationLogin.style.display = 'block';
        usernameTag.value= '';
        console.log('El nombre de usuario no existe');
        setTimeout(() => {
            bottomRightNotificationLogin.style.display = 'none';
        }, 4000);
        usernameTag.focus();
        return false;
    }
    return true;
}

function isPasswordValid(username, password) {
    const user = loadExistingUser(username);
    if (user.password !== password) {
        bottomRightNotificationTextLogin.textContent= 'La contraseña es incorrecta'
        bottomRightNotificationLogin.style.display= 'block';
        passwordTag.value= '';
        setTimeout(() => {
            bottomRightNotificationLogin.style.display = 'none';
        }, 4000);
        passwordTag.focus();
        return false;
    }
    return true;
}

loginButton.addEventListener('click', () => {
    const username = usernameTag.value;
    const password = passwordTag.value;
    if (isFilledFields(username, password) && isUserValid(username) && isPasswordValid(username, password)) {
        console.log('Inicio de sesion exitoso');

        addUserLog(username, 'Inicio de sesión exitoso', new Date().toISOString());

        sessionStorage.setItem('activeUser', JSON.stringify(users[username]));

        window.location.href = '../HTML/welcome.html';
    }
});



