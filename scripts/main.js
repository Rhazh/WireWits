// Declare ncrLog and quality in the global scope so other scripts can access them
let ncrLog = [];
let quality = [];
let history = [];
//let login = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Load data from sessionStorage or default to empty arrays
    ncrLog = JSON.parse(sessionStorage.getItem('ncrLog')) || [];
    quality = JSON.parse(sessionStorage.getItem('quality')) || [];
    history = JSON.parse(sessionStorage.getItem('history')) || [];

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
        if (!ncrLog.length || !quality.length || !history.length) {
            const [qualityData, ncrData, historyData] = await Promise.all([
                fetchData('seed-data/Quality.json'),
                fetchData('seed-data/NCRLog.json'),
                fetchData('seed-data/History.json')
            ]);

            quality = qualityData;
            ncrLog = ncrData;
            history = historyData

            // Store seed data in sessionStorage for use in the current session
            sessionStorage.setItem('quality', JSON.stringify(quality));
            sessionStorage.setItem('ncrLog', JSON.stringify(ncrLog));
            sessionStorage.setItem('history', JSON.stringify(history));
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
        else if (pageName === 'reports.html') {
            performSearchReports();
            //fetchRecordsData();
            //document.querySelector('#reportTable').style.display = 'none';
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
    const createEditModal = document.getElementById('createEditModal');

    if (isEditMode) {
        createNCRModal.style.visibility = 'hidden';
        createEditModal.style.visibility = 'visible';
        populateEditPage(ncrNumber);
    }
}

// Setup button to create a new NCR
function setupCreateNCRButton() {
    document.getElementById('btnCreateNCR').addEventListener('click', () => {
        CreateNCR();
        //addNewNCRToRecent();
    });
}

// Add the most recent NCR to the list of recent NCRs
function addNewNCRToRecent() {
    const lastNCR = ncrLog[ncrLog.length - 1];
    quality.unshift(lastNCR);
    sessionStorage.setItem('quality', JSON.stringify(quality));
    recentNCRs();
}

function setupSaveNCR() {
    document.getElementById('btnSave').addEventListener('click', () => {
        saveNCR()
    });
}

function setupSubmitNCR() {
    document.getElementById('btnSubmit').addEventListener('click', () => {
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
    const profilePicElement = document.getElementById('profilePic');

    if (user && fullNameElement && roleElement) {
        fullNameElement.textContent = `${user.user_Firstname} ${user.user_Lastname}`;
        roleElement.textContent = user.Department_Name;

        // Set the profile picture based on gender
        if (user.gender === 'male') {

            profilePicElement.src = "images/user-profile_v1.png";
        } else if (user.gender === 'female') {

            profilePicElement.src = "images/user-profile.png";
        }



        // Logout codes
        document.getElementById('logout').addEventListener('click', function () {

            localStorage.removeItem('loggedInUser');
            alert("Successfully Logged out");

            window.location.href = 'login.html';
        });

    } else {
        console.error("Profile elements not found or no user logged in.");
    }
});

//============================================
//      Bread Crumbs
//============================================

document.addEventListener('DOMContentLoaded', function () {
    const breadcrumbMap = {
        'index.html': 'Dashboard',
        'view.html': 'View NCRs',
        'create.html': 'Create NCR',
        'details.html': 'NCR Details',
        'faqs.html': 'FAQs',
        'login.html': 'Login',
        'reports.html': 'Reports',
        'settings.html': 'Settings',
        'underdevelopment.html': 'Under Development',
    };

    // Get the current page path
    const currentPage = window.location.pathname.split('/').pop();

    const derivedPath = [];
    if (currentPage === 'details.html') {
        derivedPath.push('index.html', 'view.html', 'details.html');
    } else if (currentPage === 'create.html') {
        derivedPath.push('index.html', 'create.html');
    } else if (currentPage === 'view.html') {
        derivedPath.push('index.html', 'view.html');
    } else if (currentPage === 'reports.html') {
        derivedPath.push('index.html', 'reports.html');
    } else {
        derivedPath.push('index.html'); // Default case for the homepage
    }

    // Get the breadcrumb list container
    const breadcrumbList = document.querySelector('.breadcrumb-list');

    // Populate the breadcrumb based on the derived path
    derivedPath.forEach((page, index) => {
        const listItem = document.createElement('li');

        if (index === derivedPath.length - 1) {
            listItem.textContent = breadcrumbMap[page];
        } else {
            // For other items, create a link
            const link = document.createElement('a');
            link.href = page;
            link.textContent = breadcrumbMap[page];
            listItem.appendChild(link);
        }

        // Append the list item to the breadcrumb list
        breadcrumbList.appendChild(listItem);

        // Add separator except for the last item
        if (index < derivedPath.length - 1) {
            const separator = document.createElement('span');
            separator.textContent = ' > ';
            breadcrumbList.appendChild(separator);
        }
    });
}); 
