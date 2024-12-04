
fetch('seed-data/login.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(userData => {
        // Get the password toggle element outside the submit handler
        const togglePassword = document.getElementById("togglePassword");
        const passwordField = document.getElementById("password");

        // Event listener for password toggle visibility
        togglePassword.addEventListener('click', function () {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.style.color = (type === 'text') ? 'black' : 'gray';

            

        });

        document.getElementById("loginForm").addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form submission

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            //const department = document.getElementById("department").value;

            const storedUsers = JSON.parse(localStorage.getItem('users')) || userData.users;

            // Validate the user
            const user = storedUsers.find(user =>
                user.user_name === username &&
                user.password === password
            );

            if (user) {
                // Store user details in localStorage
                localStorage.setItem('loggedInUser', JSON.stringify(user));

                localStorage.setItem('users', JSON.stringify(storedUsers));


                window.location.href = 'index.html'; // Redirect to index.html
            } else {
                showToast("Invalid credentials or department.", "error");
            }
        });

        document.getElementById("btncancel").addEventListener("click", function () {
            document.getElementById("loginForm").reset(); // Clear the form
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });






