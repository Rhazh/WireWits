
fetch('seed-data/login.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(userData => {
        document.getElementById("loginForm").addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent form submission

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const department = document.getElementById("department").value;

            // Validate the user
            const user = userData.users.find(user => 
                user.user_name === username &&
                user.password === password &&
                user.Department_Name === department
            );

            if (user) {
                // Store user details in localStorage
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                
                alert(`Welcome ${user.user_Firstname}!`);
                window.location.href = 'index.html'; // Redirect to index.html
            } else {
                alert("Invalid credentials or department.");
            }
        });

        document.getElementById("btncancel").addEventListener("click", function() {
            document.getElementById("loginForm").reset(); // Clear the form
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });





    
