let NCRLog = [];
let Quality = [];


document.addEventListener('DOMContentLoaded', () => {
    // Get the full path from the URL
    const path = window.location.pathname; // This will give you the path, e.g., '/create.html'
    const pageName = path.substring(path.lastIndexOf('/') + 1); // This retrieves the part after the last '/'
    

    


    // Fetch data from Quality.json
    fetch('seed-data/Quality.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Quality data: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            Quality = data; // Store the fetched Quality data
            return fetch('seed-data/NCRLog.json'); // Fetch data from NCRLog.json
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch NCRLog data: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            NCRLog = data; // Store the fetched NCRLog data

            // Call functions based on the page name
            populateNotifications(); // For all pages


            //for home page related items
            if (pageName === 'index.html') { // Check for the specific page name
                recentNCRs(); // Call recentNCRs function
            }
            if (pageName === 'view.html') {
                performSearch(); //ensure page loads up with all NCRs that are still within the Quality Department
            }

            //to grab NCR number when an NCR is clicked
            const urlParams = new URLSearchParams(window.location.search);
            const ncrNumber = urlParams.get('ncr');

            //if NCR number present and the page the user is headed to
            if (ncrNumber) {
                if (pageName === 'create.html') {
                    populateEditPage(ncrNumber);
                } else if (pageName === 'details.html') {
                    populateDetailsPage(ncrNumber);
                }
            }
            //performSearch(); 
            /* Add event listener for the NCR creation form
            document.getElementById('createNCRForm').addEventListener('submit', function (event) {
                event.preventDefault(); // Prevent default form submission
                CreateNCR(); // Call the CreateNCR function
            });*/



        })
        .catch(error => {
            console.error('Error:', error); // Log any errors encountered during fetch
        });
});

