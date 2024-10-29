function registerUser(event) {
    event.preventDefault();
    const fullName = document.getElementById('full-name').value;
    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;

    const request = new XMLHttpRequest();
    request.open('POST', '../php/register.php', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(this.responseText);
            if (response.status === 'success') {
                alert('Registration successful!');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                alert('Registration failed: ' + response.message);
            }
        }
    };
    request.send(`fullName=${encodeURIComponent(fullName)}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
}

function togglePassword() {
    const passwordField = document.getElementById('new-password');
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}

function goBack() {
    window.history.back();
}