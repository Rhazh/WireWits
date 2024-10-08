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

//============================================
//      Bread Crumbs
//============================================

document.addEventListener('DOMContentLoaded', function() {
    // Define the page paths and titles (derived path structure)
    const breadcrumbMap = {
        'index.html': 'Dashboard',
        'view.html': 'View NCRs',
        'create.html': 'Create NCR',
        'details.html': 'NCR Details',
        'faqs.html' : 'FAQs',
        'login.html' : 'Login',
        'reports.html' : 'Reports',
        'settings.html' : 'Settings',
        'underdevelopment.html' : 'Under Development',
        // Add more paths as necessary
    };

    // Get the current page path
    const currentPage = window.location.pathname.split('/').pop();

    // Define derived paths (e.g., index -> view -> details)
    const derivedPath = [];
    if (currentPage === 'details.html') {
        derivedPath.push('index.html', 'view.html', 'details.html');
    } else if (currentPage === 'create.html') {
        derivedPath.push('index.html', 'create.html');
    } else if (currentPage === 'view.html') {
        derivedPath.push('index.html', 'view.html');
    } else {
        derivedPath.push('index.html'); // Default case for the homepage
    }

    // Get the breadcrumb list container
    const breadcrumbList = document.querySelector('.breadcrumb-list');

    // Populate the breadcrumb based on the derived path
    derivedPath.forEach((page, index) => {
        const listItem = document.createElement('li');

        if (index === derivedPath.length - 1) {
            // For the last item (current page), just display the name without a link
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
