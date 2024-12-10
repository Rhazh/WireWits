// Declare global variables
let ncrLog = [];
let quality = [];
let history = [];
let engineering = [];
let purchasing = [];
let supplier = [];
let uploadedFiles = [];

document.addEventListener('DOMContentLoaded', async () => {
    
    // Check if the user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Redirect to login if the user is not logged in
    // Add later
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    // Populate user profile details in the UI (e.g., for the header)
    const fullNameElement = document.getElementById('userFullname');
    const roleElement = document.getElementById('userRole');
    const profilePicElement = document.getElementById('profilePic');
    const userRole = loggedInUser.Department_Name;
    //const profilePagePic = document.getElementById('profilePagePic');


    if (loggedInUser && fullNameElement && roleElement) {
        fullNameElement.textContent = `${loggedInUser.user_Firstname.substring(0, 1)}. ${loggedInUser.user_Lastname}`;
        roleElement.textContent = loggedInUser.Department_Name;

        profilePicElement.src = loggedInUser.profilePicture || (loggedInUser.gender === 'male' ? 'images/user-profile_v1.png' : 'images/user-profile.png');;
        // Set profile picture based on gender
        //profilePicElement.src = loggedInUser.gender === 'male' ? 'images/user-profile_v1.png' : 'images/user-profile.png';

        // Logout functionality
        function logout() {
            document.getElementById('logout').addEventListener('click', function () {
                //Uncomment the code below to start afresh
                const userConfirmed = confirm("Are you sure you want to Log out?");
                if (userConfirmed) {
                    localStorage.clear();
                    localStorage.removeItem('loggedInUser');
                    showToast("Successfully logged out.");      
                    window.location.href = 'login.html';
                } else {
                    //console.log("Logout cancelled.");
                    showToast("Logout cancelled.");
                    location.back();
                    // Redirect or perform other actions as needed
                    //return;
                }
            });
        }
        
       
    } else {
        console.error("Profile elements not found or no user logged in.");
    }

    logout();
    initializeNotificationToggle(); // Initialize notification toggle


    // Proceed if the user is logged in
    // Load data from localStorage or default to empty arrays
    ncrLog = JSON.parse(localStorage.getItem('ncrLog')) || [];
    quality = JSON.parse(localStorage.getItem('quality')) || [];
    history = JSON.parse(localStorage.getItem('history')) || [];
    engineering = JSON.parse(localStorage.getItem('engineering')) || [];
    purchasing = JSON.parse(localStorage.getItem('purchasing')) || [];
    supplier = JSON.parse(localStorage.getItem('supplier')) || [];

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
        // If local data is not available, fetch seed data and store it in localStorage
        if (!ncrLog.length || !quality.length || !history.length || !engineering.length) {
            const [qualityData, ncrData, historyData, engineeringData, purchasingData, supplierData] = await Promise.all([
                fetchData('seed-data/Quality.json'),
                fetchData('seed-data/NCRLog.json'),
                fetchData('seed-data/History.json'),
                fetchData('seed-data/Engineering.json'),
                fetchData('seed-data/Purchasing.json'),
                fetchData('seed-data/Supplier.json')
            ]);

            quality = qualityData;
            ncrLog = ncrData;
            history = historyData;
            engineering = engineeringData;
            purchasing = purchasingData;
            supplier = supplierData;

            // Store seed data in localStorage for use in the current local
            localStorage.setItem('quality', JSON.stringify(quality));
            localStorage.setItem('ncrLog', JSON.stringify(ncrLog));
            localStorage.setItem('history', JSON.stringify(history));
            localStorage.setItem('engineering', JSON.stringify(engineering));
            localStorage.setItem('purchasing', JSON.stringify(purchasing));
            localStorage.setItem('supplier', JSON.stringify(supplier));
        }

        if (loadingIndicator) loadingIndicator.style.display = 'none';

        updateNavLinks(userRole);

        const urlParams = new URLSearchParams(window.location.search);
        const ncrNumber = urlParams.get('ncr');
        console.log(ncrLog)
        console.log(quality)
        console.log(engineering)
        console.log(purchasing)


        // Handle different pages based on the current page name

        //=======================================================================================================
        //INDEX PAGE - DASHBOARD
        //=======================================================================================================
        if (pageName === 'index.html') {
            recentNCRs(userRole);
            setupNavigationButtons();
            populateNotifications(userRole);
            if (userRole == "Quality") {
                document.getElementById('onlyPurchasingDash').style.display = 'none';
                //NavBar(); //commented out because of loading errors.
                //recentNCRs();
                //setupNavigationButtons();
            }
            else if (userRole == "Engineer") {
                document.getElementById('onlyQualityDash').style.display = 'none';
                document.getElementById('onlyPurchasingDash').style.display = 'none';
                //setupNavigationButtons();
                //setupEngNavigationButtons();
                //recentEngNCRs();
            } else if (userRole == "Purchasing") {
                document.getElementById('onlyQualityDash').style.display = 'none';
            } 
            //=======================================================================================================
            //VIEW PAGE
            //=======================================================================================================
        } else if (pageName === 'view.html') {
            populateNotifications(userRole);
            if (userRole == "Quality") {
                document.getElementById('secEngineer').style.display = 'none';
                document.getElementById('secPurchasing').style.display = 'none';
                populateSupplierDropdownN('supplierName')
                document.getElementById("ncrStatus").value = "Quality";
                //NavBar();
                performSearch();
            }
            else if (userRole == "Engineer") {
                document.getElementById('secQuality').style.display = 'none';
                document.getElementById('secPurchasing').style.display = 'none';
                populateSupplierDropdownN('supplierNameEng')
                document.getElementById("ncrStatusEng").value = "Engineering";
                performSearchEng();
            }
            else if (userRole == "Purchasing") {
                document.getElementById('secQuality').style.display = 'none';
                document.getElementById('secEngineer').style.display = 'none';
                populateSupplierDropdownN('supplierNamePch')
                document.getElementById("ncrStatusPch").value = "Purchasing";
                performSearchPch();
            }
            else if (userRole == 'Admin'){
                
                document.getElementById('secEngineer').style.display = 'none';
                document.getElementById('secPurchasing').style.display = 'none';
                populateSupplierDropdownN('supplierName')
                document.getElementById("ncrStatus").value = "Quality";
                //NavBar();
                performSearch();

            }

            //=======================================================================================================
            //CREATE PAGE FOR AN NCR - FOR EDIT NCRS
            //=======================================================================================================

        } else if (ncrNumber && pageName === 'create.html') {
            populateNotifications(userRole);
            document.getElementById('lblCreateEditNCR').innerHTML = 'Edit NCR';
            if (userRole == "Quality") {
                //document.getElementById('secEngineer').style.display = 'none';
                toggleCreateEditModal(ncrNumber, true);
                //restrictInputToNumbersAndDashes(["poNumber", "soNumber"]);
            }
            else if (userRole == "Engineer") {
                document.getElementById('secCreateEditNCR').style.display = 'none';
                populateEngEditPage(ncrNumber)
                document.getElementById('sectionPurchasinglabel').style.display = 'none';
                document.getElementById('sectionEngineer').checked = true;
                setupEngSaveNCR();
                setupEngSubmitNCR();
                //restrictInputToNumbersAndDashes(["poNumber", "soNumber"]);

            } else if (userRole == "Purchasing") {
                document.getElementById('secCreateEditNCR').style.display = 'none';
                //populateNotificationsEng()
                //populateDetailsPageEng(ncrNumber)
                //populateEngEditPage(ncrNumber)
                
                document.getElementById('sectionPurchasing').checked = true;
                populatePchEditPage(ncrNumber)
                setupPchSaveNCR()
                setupCloseNCR()
                // setupEngSubmitNCR();
            }
            else if (userRole == "Admin"){
                populateAdmEditPage(ncrNumber)
            }

            //=======================================================================================================
            //CREATE PAGE - FOR CREATING AN NCR
            //=======================================================================================================
        } else if (pageName === 'create.html') {
            populateNotifications(userRole);
            if (userRole == 'Quality' || userRole == 'Admin') {
                //document.getElementById('secEngineer').style.display = 'none';
                toggleCreateEditModal(null, false);
                setupCreateNCRButton();
                //restrictInputToNumbersAndDashes(["poNumber", "soNumber"]);
            } else if (userRole == 'Engineer') {
                // document.getElementById('secQuality').style.display = 'none';
                //restrictInputToNumbersAndDashes(["poNumber", "soNumber"]);
            }
        } else if (ncrNumber && pageName === 'details.html') {
            populateNotifications(userRole);
            populateDetailsPage(ncrNumber);
            if (userRole === "Quality") {
                //document.getElementById('formInfo').style.display = 'none';
                document.getElementById('sectionEngineerlabel').style.display = 'none';
                document.getElementById('sectionPurchasinglabel').style.display = 'none';
                document.getElementById('sectionQuality').checked = true;
                //populateNotifications();
                //NavBar();
            }
            else if (userRole == "Engineer") {
                document.getElementById('editButton').style.display = 'none';
                //populateNotificationsEng()
                populateEngDetailsPage(ncrNumber);
                document.getElementById('sectionPurchasinglabel').style.display = 'none';
                document.getElementById('sectionEngineer').checked = true;
                //popupComment();
                //closeModal();
                ;
            } else if (userRole == "Purchasing") {
                populateEngDetailsPage(ncrNumber);
                populatePchDetailsPage(ncrNumber)
                document.getElementById('sectionPurchasing').checked = true;   
            } else if (userRole == "Admin"){
                populateAdmDetailsPage (ncrNumber)
            }
        }
        else if (pageName === 'profile_settings.html') {
            populateNotifications(userRole);
            if (userRole == "Quality") {
                populateNotifications();
                //NavBar();
            }
            else if (userRole == "Engineer") {
            }
        }
        else if (pageName === 'faqs.html') {
            populateNotifications(userRole);
            if (userRole == "Quality") {
                //populateNotifications();
                //NavBar();
            }
            else if (userRole == "Engineer") {
            }
        

        } else if (pageName === 'reports.html') {
            populateNotifications(userRole);
            performSearchReports();
            if (userRole == "Quality") {
                //NavBar();
            }
            else if (userRole == "Engineer") {
            }
       
            populateNotifications(userRole);
            if (userRole == "Quality") {
                //NavBar();
            }
            else if (userRole == "Engineer") {
            }

        } else if (pageName === 'metrics.html'){
            populateNotifications(userRole);
            Metrics();
        }


        // Set up the supplierName dropdown
        //populateSupplierDropdown(ncrNumber);
        //populateSupplierDropdownG(ncrLog)

    } catch (error) {
        console.error('Error fetching data:', error);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        showToast("An error occurred while loading data. Please try again later.");
    }

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
        document.getElementById('btnMetrics').addEventListener('click', () => {
            window.location.href = 'metrics.html';
        });
    }

    // Set up navigation buttons on index.html
    // function setupEngNavigationButtons() {
    //     document.getElementById('btnEngView').addEventListener('click', () => {
    //         window.location.href = 'view.html';
    //     });

    //     document.getElementById('btnEngReports').addEventListener('click', () => {
    //         window.location.href = 'reports.html';
    //     });
    // }

    // Toggle between create and edit modals
    function toggleCreateEditModal(ncrNumber, isEditMode) {
        const createNCRModal = document.getElementById('createNCRModal');
        const qualityEditModal = document.getElementById('formNCR');
        const engineerEditModal = document.getElementById('formInfo');

        if (isEditMode) {
            createNCRModal.style.display = 'none';
            engineerEditModal.style.display = 'none';
            qualityEditModal.style.visibility = 'visible';
            populateNotifications();
            //NavBar();
            populateEditPage(ncrNumber);
            populateSupplierDropdown('supplierName', ncrNumber);
            setupSaveNCR();
            setupSubmitNCR();
        } else {
            createNCRModal.style.visibility = 'visible';
            qualityEditModal.style.visibility = 'hidden';
            populateSupplierDropdown('nsupplierName');
        }
    }

    // Setup button to create a new NCR
    function setupCreateNCRButton() {
        document.getElementById('btnCreateNCR').addEventListener('click', () => {
            const ncrNumber = CreateNCR();
            if (ncrNumber) {
                toggleCreateEditModal(ncrNumber, true);
            }
        });
    }

    // Set up the Save and Submit NCR functions
    function setupSaveNCR() {
        document.getElementById('btnSave').addEventListener('click', () => {
            saveNCR();
        });
    }

    function setupSubmitNCR() {
        document.getElementById('btnSubmit').addEventListener('click', () => {
            submitNCR();
        });
    }

    // Set up the Cancel button
    const cancelButton = document.getElementById('btnCancelNCR');
    if (cancelButton) {
        cancelButton.addEventListener('click', goBack); // Use event listener instead of inline onclick
    }

    // Set up the Cancel button
    const cancelCreateButton = document.getElementById('btnCancel');
    if (cancelCreateButton) {
        cancelCreateButton.addEventListener('click', goBack); // Use event listener instead of inline onclick
    }

    // Set up the modal close button
    const closeModalButton = document.getElementById('btnCloseModal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', goBack); // Reuse the goBack function
    }

    // Set up the Cancel button for Engineer
    const cancelEngSubmitButton = document.getElementById('btnEngCancel');
    if (cancelEngSubmitButton) {
        cancelEngSubmitButton.addEventListener('click', goBack); // Use event listener instead of inline onclick
    }

    const cancelPchSubmitButton = document.getElementById('btnPchCancel');
    if (cancelPchSubmitButton) {
        cancelPchSubmitButton.addEventListener('click', goBack); // Use event listener instead of inline onclick
    }

    // Function to go back to the previous page
    function goBack() {
        console.log("Going back...");
        window.history.back();
    }

    // Set up the Save and Submit NCR functions
    function setupEngSaveNCR() {
        document.getElementById('btnEngSave').addEventListener('click', () => {
            saveEngNCR();
        });
    }

    function setupEngSubmitNCR() {
        document.getElementById('btnEngSubmit').addEventListener('click', () => {
            submitEngNCR();
        });
    }

    // Set up the Save and Submit/Close NCR functions for Purchasing
    function setupPchSaveNCR() {
        document.getElementById('btnPchSave').addEventListener('click', () => {
            savePchNCR();
        });
    }

     function setupCloseNCR() {
         document.getElementById('btnPchClose').addEventListener('click', () => {
             closeNCR();
         });
     }

    //breadcrumbs
    const breadcrumbMap = {
        'index.html': 'Dashboard',
        'view.html': 'NCR Log',
        'create.html': 'Create NCR',
        'edit.html': 'Edit NCR',
        'details.html': 'NCR Details',
        'faqs.html': 'FAQs',
        'login.html': 'Login',
        'reports.html': 'Audits',
        'settings.html': 'Settings',
        'underdevelopment.html': 'Under Development',
        'profile_settings.html': 'Profile & Settings',
        'metrics.html' : 'Reports'

    };

    // Get the current page path
    const currentPage = window.location.pathname.split('/').pop();
    const urlParams = new URLSearchParams(window.location.search);

    // Determine if the page is in edit mode based on presence of 'ncr' parameter
    const isEditMode = urlParams.has('ncr'); // If 'ncr' parameter exists, it's edit mode

    const derivedPath = [];
    if (currentPage === 'details.html') {
        derivedPath.push('index.html', 'view.html', 'details.html');
    } else if (currentPage === 'create.html') {
        // Check if it's create or edit mode based on the 'ncr' parameter
        if (isEditMode) {
            derivedPath.push('index.html', 'edit.html'); // Show 'Edit NCR' when in edit mode
        } else {
            derivedPath.push('index.html', 'create.html'); // Show 'Create NCR' otherwise
        }
    } else if (currentPage === 'view.html') {
        derivedPath.push('index.html', 'view.html');
    } else if (currentPage === 'reports.html') {
        derivedPath.push('index.html', 'reports.html');
    }
    else if (currentPage === 'profile_settings.html') {
        derivedPath.push('index.html', 'profile_settings.html');
    }
    else if (currentPage === 'metrics.html') {
        derivedPath.push('index.html', 'metrics.html');
    }
    else {
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
            link.title=breadcrumbMap[page];
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

    loadProfileSettings(loggedInUser);
    let tempProfilePicture = null; // Temporary storage for the profile picture during edit mode

    handleProfilePictureChange(loggedInUser); // Initialize the profile picture upload functionality


    // Event listeners for buttons
    document.getElementById('editprofileButton').addEventListener('click', toggleEditMode);
    document.getElementById('saveprofileButton').addEventListener('click', () => saveProfileSettings(loggedInUser));
    document.getElementById('cancelprofileButton').addEventListener('click', () => cancelEditMode(loggedInUser));
    // document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);

    // Event listener for profile picture upload
    // document.getElementById('imageUpload').addEventListener('change', (e) => handleProfilePictureUpload(e, loggedInUser));
    


});