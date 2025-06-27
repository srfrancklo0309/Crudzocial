const usernameTag = document.getElementById('username');
const passwordTag = document.getElementById('password');

const username = usernameTag.value;
const password = passwordTag.value;
const email = emailTag.value;

let infousers ={
    'username': username,
    'password': password,
    'email': email,
}

localStorage.setItem('user', JSON.stringify(infousers));

