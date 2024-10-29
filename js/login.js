function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch('../php/login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.role === 'admin') {
                window.location.href = 'admin_dashboard.html';
            } else if (data.role === 'customer') {
                window.location.href = 'customer_dashboard.html';
            } else {
                window.location.href = 'staff_dashboard.html';
            }
        } else {
            alert('Invalid username or password');
        }
    })
    .catch(error => console.error('Error:', error));
}

function togglePassword() {
    const passwordField = document.getElementById('password');
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}
