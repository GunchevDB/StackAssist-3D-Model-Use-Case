document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    var username = document.getElementById('username');
    var password = document.getElementById('password');
    var errorMessage = document.getElementById('error-message');

    username.classList.remove('input-error');
    password.classList.remove('input-error');
    errorMessage.style.display = 'none';

    if (username.value.trim() === '' || password.value.trim() === '') {
        errorMessage.style.display = 'block';

        if (username.value.trim() === '') {
            username.classList.add('input-error');
        }
        if (password.value.trim() === '') {
            password.classList.add('input-error');
        }
    } else {

        console.log('Username:', username.value, 'Password:', password.value);
        alert('Login successful for: ' + username.value);
    }
});
