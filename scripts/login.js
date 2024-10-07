document.getElementById('btnLogin').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulate successful login for a specific user
    if (username === 'testUser' && password === 'testPass') {
       
        // Simulate redirect
        window.location.href = 'index.html'; // Change this to your home page
    } else {
        alert('Login failed: Invalid username or password');
    }
});

// Optional: Handle the Cancel button click
document.getElementById('btncancel').addEventListener('click', function() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});
