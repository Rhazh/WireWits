// Declare ncrLog and quality in the global scope so other scripts can access them
let ncrLog = [];
let quality = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Load data from sessionStorage or default to empty arrays
    ncrLog = JSON.parse(sessionStorage.getItem('ncrLog')) || [];
    quality = JSON.parse(sessionStorage.getItem('quality')) || [];

    const path = window.location.pathname;
    const pageName = path.substring(path.lastIndexOf('/') + 1);

    const loadingIndicator = document.getElementById('loading');
    if (loadingIndicator) loadingIndicator.style.display = 'block';

    // Fetch seed data from JSON files
    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    try {
        // If session data is not available, fetch seed data and store it in sessionStorage
        if (!ncrLog.length || !quality.length) {
            const [qualityData, ncrData] = await Promise.all([
                fetchData('seed-data/Quality.json'),
                fetchData('seed-data/NCRLog.json')
            ]);

            quality = qualityData;
            ncrLog = ncrData;

            // Store seed data in sessionStorage for use in the current session
            sessionStorage.setItem('quality', JSON.stringify(quality));
            sessionStorage.setItem('ncrLog', JSON.stringify(ncrLog));
        }

        if (loadingIndicator) loadingIndicator.style.display = 'none';

        // Populate notifications or handle errors
        populateNotifications();

        const urlParams = new URLSearchParams(window.location.search);
        const ncrNumber = urlParams.get('ncr');

        // Handle different pages based on the current page name
        if (pageName === 'index.html') {
            recentNCRs();
            setupNavigationButtons();
        } else if (pageName === 'view.html') {
            performSearch();
        } else if (ncrNumber && pageName === 'create.html') {
            toggleCreateEditModal(ncrNumber, true);
            setupSaveNCR();
            setupSubmitNCR();
           
        } else if (pageName === 'create.html') {
            toggleCreateEditModal(null, false);
            setupCreateNCRButton();
            setupSaveNCR();
            setupSubmitNCR();
           
            
        } else if (ncrNumber && pageName === 'details.html') {
            populateDetailsPage(ncrNumber);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        alert("An error occurred while loading data. Please try again later.");
    }
});

// Set up navigation buttons on index.html
function setupNavigationButtons() {
    document.getElementById('btnView').addEventListener('click', () => {
        window.location.href = 'view.html';
    });

    document.getElementById('btnCreate').addEventListener('click', () => {
        window.location.href = 'create.html';
    });

    document.getElementById('btnReports').addEventListener('click', () => {
        window.location.href = 'reports.html';
    });
}

// Toggle between create and edit modals
function toggleCreateEditModal(ncrNumber, isEditMode) {
    const createNCRModal = document.getElementById('createNCRModal');
    const createEditModal = document.getElementById('create-edit-modal');

    if (isEditMode) {
        createNCRModal.style.visibility = 'hidden';
        createEditModal.style.visibility = 'visible';
        populateEditPage(ncrNumber);
    } else {
        createEditModal.style.visibility = 'hidden';
        createNCRModal.style.visibility = 'visible';
    }
}

// Setup button to create a new NCR
function setupCreateNCRButton() {
    document.getElementById('btnCreateNCR').addEventListener('click', () => {
        CreateNCR();
        addNewNCRToRecent();
    });
}

// Add the most recent NCR to the list of recent NCRs
function addNewNCRToRecent() {
    const lastNCR = ncrLog[ncrLog.length - 1];
    quality.unshift(lastNCR);
    sessionStorage.setItem('quality', JSON.stringify(quality));
    recentNCRs();
}

function setupSaveNCR(){
    document.getElementById('btnSave').addEventListener('click', () =>{
        saveNCR()
    });
}

function setupSubmitNCR(){
    document.getElementById('btnSubmit').addEventListener('click', () =>{
        submitNCR()
    });
}

//Going back to last page
function goBack() {
    window.history.back();
}

// login codes
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const fullNameElement = document.getElementById('userFullname');
    const roleElement = document.getElementById('userRole');

    if (user && fullNameElement && roleElement) {
        fullNameElement.textContent = `${user.user_Firstname} ${user.user_Lastname}`;
        roleElement.textContent = user.Department_Name;

        // Logout codes
        document.getElementById('logout').addEventListener('click', function() {
            
            localStorage.removeItem('loggedInUser');

            // Redirect to the login page
            window.location.href = 'login.html'; 
        });

    } else {
        console.error("Profile elements not found or no user logged in.");
    }
});
