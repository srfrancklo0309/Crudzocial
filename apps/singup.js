const usernameTag = document.getElementById('username');
const passwordTag = document.getElementById('password');
const emailTag = document.getElementById('email');
const singupButton = document.getElementById('singupButton');

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
    console.log(username, password, email);
    if (username === '' ) {
        console.log('El nombre de usuario es requerido');
        usernameTag.focus();
        return false;
    }
    if (email === '' || !email.includes('@') || !email.includes('.')) {
        console.log('El email es requerido');
        emailTag.value = '';
        emailTag.focus();
        return false;
    }
    if (password === '') {
        console.log('La contraseña es requerida');
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
        alert('El usuario ya existe');
        return;
    }

    users[user.username] = user;    
    saveUsers();
    setTimeout(() => {
        window.location.href = './home.html';
    }, 1000);
});

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});







