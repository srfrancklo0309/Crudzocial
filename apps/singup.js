const usernameTag = document.getElementById('username');
const passwordTag = document.getElementById('password');
const emailTag = document.getElementById('email');
const singupButton = document.getElementById('singupButton');
const bottomRightNotification = document.getElementById('bottomRightNotification');
const bottomRightNotificationText = document.getElementById('bottomRightNotificationText');

// const existingUser = JSON.parse(localStorage.getItem('user'));
let users = {};

function loadUsers() {
    const usersInfo = JSON.parse(localStorage.getItem('users'));
    if (usersInfo !== null) {
        users = usersInfo;
    }
}

function loadExistingUser(username) {
    return JSON.parse(localStorage.getItem(`${username}`));
}

function isFilledFields(username, password, email) {
    if (username === '' ) {
        bottomRightNotificationText.textContent = 'El nombre de usuario es requerido';
        bottomRightNotification.style.display = 'block';
        setTimeout(() => {
            bottomRightNotification.style.display = 'none';
        }, 4000);
        usernameTag.focus();
        return false;
    }
    if (email === '' || !email.includes('@') || !email.includes('.')) {
        bottomRightNotificationText.textContent = 'El email es requerido';
        bottomRightNotification.style.display = 'block';
        setTimeout(() => {
            bottomRightNotification.style.display = 'none';
        }, 4000);
        emailTag.value = '';
        emailTag.focus();
        return false;
    }
    if (password === '') {
        bottomRightNotificationText.textContent = 'La contraseña es requerida';
        bottomRightNotification.style.display = 'block';
        setTimeout(() => {
            bottomRightNotification.style.display = 'none';
        }, 4000);
        passwordTag.focus();
        return false;
    }
    return true;
}

function saveUsers() {
    localStorage.setItem(`users`, JSON.stringify(users));
}

function cleanFields() {
    usernameTag.value = '';
    passwordTag.value = '';
    emailTag.value = '';
}

singupButton.addEventListener('click', () => {
    const username = usernameTag.value.trim().toLowerCase() ;
    const password = passwordTag.value.trim().toLowerCase();
    const email = emailTag.value.trim().toLowerCase();

    const user ={
        'username': username,
        'password': password,
        'email': email,
    }

    if (!isFilledFields(username, password, email)) {
        return;
    }
    
    if (users.hasOwnProperty(user.username)) {
        bottomRightNotificationText.textContent = 'El usuario ya existe';
        bottomRightNotification.style.display = 'block';
        setTimeout(() => {
            bottomRightNotification.style.display = 'none';
        }, 4000);
        usernameTag.focus();
        return;
    }

    users[user.username] = user;    
    saveUsers();
    setTimeout(() => {
        window.location.href = '../HTML/welcome.html';
    }, 1000);
});

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});







