// Declare global variables
let ncrLog = [];
let quality = [];
let history = [];
let engineering = [];
let supplier = [];
let uploadedFiles = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Check if the user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Redirect to login if the user is not logged in
    // Add later
    /*if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }*/

    // Populate user profile details in the UI (e.g., for the header)
    const fullNameElement = document.getElementById('userFullname');
    const roleElement = document.getElementById('userRole');
    const profilePicElement = document.getElementById('profilePic');
    const userRole = loggedInUser.Department_Name;
    const profilePagePicture = document.getElementById('profilePagePic')


    if (loggedInUser && fullNameElement && roleElement) {
        fullNameElement.textContent = `${loggedInUser.user_Firstname.substring(0, 1)}. ${loggedInUser.user_Lastname}`;
        roleElement.textContent = loggedInUser.Department_Name;

        // Set profile picture based on gender
        profilePicElement.src = loggedInUser.gender === 'male' ? 'images/user-profile_v1.png' : 'images/user-profile.png';

        // Logout functionality
        document.getElementById('logout').addEventListener('click', function () {
            localStorage.removeItem('loggedInUser');
            sessionStorage.clear();
            alert("Successfully logged out.");
            window.location.href = 'login.html';
        });
    } else {
        console.error("Profile elements not found or no user logged in.");
    }

    // Proceed if the user is logged in
    // Load data from sessionStorage or default to empty arrays
    ncrLog = JSON.parse(sessionStorage.getItem('ncrLog')) || [];
    quality = JSON.parse(sessionStorage.getItem('quality')) || [];
    history = JSON.parse(sessionStorage.getItem('history')) || [];
    engineering = JSON.parse(sessionStorage.getItem('engineering')) || [];
    supplier = JSON.parse(sessionStorage.getItem('supplier')) || [];

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
        if (!ncrLog.length || !quality.length || !history.length || !engineering.length || !supplier.length) {
            const [qualityData, ncrData, historyData, engineeringData, supplierData] = await Promise.all([
                fetchData('seed-data/Quality.json'),
                fetchData('seed-data/NCRLog.json'),
                fetchData('seed-data/History.json'),
                fetchData('seed-data/Engineering.json'),
                fetchData('seed-data/Supplier.json')
            ]);

            quality = qualityData;
            ncrLog = ncrData;
            history = historyData;
            engineering = engineeringData;
            supplier = supplierData;

            // Store seed data in sessionStorage for use in the current session
            sessionStorage.setItem('quality', JSON.stringify(quality));
            sessionStorage.setItem('ncrLog', JSON.stringify(ncrLog));
            sessionStorage.setItem('history', JSON.stringify(history));
            sessionStorage.setItem('engineering', JSON.stringify(engineering));
            sessionStorage.setItem('supplier', JSON.stringify(supplier));
        }

        if (loadingIndicator) loadingIndicator.style.display = 'none';

        // Populate notifications or handle errors

        //populateNotifications();
        //NavBar();
        updateNavLinks(userRole);

        const urlParams = new URLSearchParams(window.location.search);
        const ncrNumber = urlParams.get('ncr');
        

        // Handle different pages based on the current page name
        if (pageName === 'index.html') {
            if (userRole == "Quality") {
                document.getElementById('secEngineer').style.display = 'none';
                populateNotifications();
                NavBar();
                recentNCRs();
                setupNavigationButtons();
            }
            else if (userRole == "Engineer") {
                document.getElementById('secQuality').style.display = 'none';
                setupEngNavigationButtons();
                recentEngNCRs();
            }

        } else if (pageName === 'view.html') {
            populateNotifications();
            populateSupplierDropdownN('supplierName')
            NavBar();
            performSearch();
        } else if (ncrNumber && pageName === 'create.html') {
            if (userRole == "Quality") {
                document.getElementById('secEngineer').style.display = 'none';
                populateNotifications();
                NavBar();
                toggleCreateEditModal(ncrNumber, true);
                setupSaveNCR();
                setupSubmitNCR();
            }
            else if (userRole == "Engineer") {
                document.getElementById('secQuality').style.display = 'none';
                populateDetailsPageEng(ncrNumber)
                populateEngEditPage(ncrNumber)
                setupEngSaveNCR();
                setupEngSubmitNCR();
            }
        } else if (pageName === 'create.html') {
            toggleCreateEditModal(null, false);
            populateSupplierDropdown('nsupplierName');
            setupCreateNCRButton();
            setupSaveNCR();
            setupSubmitNCR();
            populateNotifications();
            NavBar();
        } else if (ncrNumber && pageName === 'details.html') {
            populateDetailsPage(ncrNumber);
            document.getElementById('printButton').style.display = 'none';
            if (userRole == "Quality") {
                document.getElementById('secEngineer').style.display = 'none';
                document.getElementById('revertButton').style.display = 'none';
                populateNotifications();
                NavBar();
            }
            else if (userRole == "Engineer") {
                document.getElementById('editButton').style.display = 'none';
                populateEngDetailsPage(ncrNumber);
            }
        }
        else if (pageName === 'profile_settings.html') {
            populateNotifications();
            NavBar();
        } else if (pageName === 'reports.html') {
            populateNotifications();
            NavBar();
            performSearchReports();
        } else if (pageName === 'engdash.html') {
            recentEngNCRs();
            //console.log("engineering");
        }

        // Set up the supplierName dropdown
        //populateSupplierDropdown(ncrNumber);
        //populateSupplierDropdownG(ncrLog)

    } catch (error) {
        console.error('Error fetching data:', error);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        alert("An error occurred while loading data. Please try again later.");
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
    }

    // Set up navigation buttons on index.html
    function setupEngNavigationButtons() {
        document.getElementById('btnEngView').addEventListener('click', () => {
            window.location.href = 'view.html';
        });

        document.getElementById('btnEngReports').addEventListener('click', () => {
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
            populateSupplierDropdown('supplierName', ncrNumber);
        }
    }

    // Setup button to create a new NCR
    function setupCreateNCRButton() {
        document.getElementById('btnCreateNCR').addEventListener('click', () => {
            CreateNCR();
            const ncrNumber = sessionStorage.getItem('ncrNumber')
            toggleCreateEditModal(ncrNumber, true);
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

    // Function to go back to the previous page
    function goBack() {
        console.log("Going back...");
        window.history.back();
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
        'reports.html': 'Reports',
        'settings.html': 'Settings',
        'underdevelopment.html': 'Under Development',
        'profile_settings.html': 'Profile & Settings',

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


//==========================
//=========================

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



//Function for the modal in Detail page
function popupComment(){

    const modal = document.getElementById("modal");
    modal.style.visibility="visible";
    modal.style.display="block";
    const btn = document.getElementById("revertButton");
    
    }
    
    function sendComment(){
        const reason = document.getElementById("reason").value;
        if(!reason){
            alert("Enter a reason before submitting")
            
        }
        else{

        const engineeringEntry = engineering.find(entry.ncrnumber === ncrNumber);

        if (engineeringEntry) {
            engineeringEntry.comment = reason;
            engineeringEntry.ncrStaus = "Returned to Quality";


            sessionStorage.setItem('engineeing', JSON.stringify(engineering));
            const qualityEntry = quality.find(entry => entry.ncrNumber === ncrNumber);
            if (qualityEntry) {

                qualityEntry.returnReason = reason;
                qualityEntry.ncrStatus = "Returned to Quality";

                sessionStorage.setItem('quality', JSON.stringify(quality));

                const historyEntry = {
                    ncrNumber: ncrNumber,
                    actionType: "Return to Quality",
                    status: 'Open',
                    actionDescription: `Returned to Quality by Engineering with reason: ${reason}`,
                    changedBy: getUserName(),
                    changedOn: Timestamp()
                };
                history.push(historyEntry);
                sessionStorage.setItem('history', JSON.stringify(history));

                alert(`NCR ${ncrNumber} has been returned to Quality with reason: ${reason}.`);

                //loadQualityTable();
            } else {
                alert("Quality entry not found for the specified NCR number.");
            }
        } else {
            alert("Engineering entry not found for the specified NCR number.");
        }
    }
}

        
    


    
    // function sendComment(){
    
    //     const reason = document.getElementById("reason").value;
    //     if(!reason){
    //         alert("Enter a reason before submitting")
    //         return;
    //     }
    
    //     const engineeringEntry = engineering.find(entry.ncrnumber === ncrNumber);
    
    //     if (engineeringEntry){
    //         engineeringEntry.comment = reason;
    //         engineeringEntry.ncrStaus = "Returned to Quality";
    
    
    //         sessionStorage.setItem('engineeing',JSON.stringify(engineering));
    //         const qualityEntry = quality.find(entry => entry.ncrNumber === ncrNumber);
    //         if (qualityEntry) {
                
    //             qualityEntry.returnReason = reason;
    //             qualityEntry.ncrStatus = "Returned to Quality";
    
    //             sessionStorage.setItem('quality', JSON.stringify(quality));
    
    //             const historyEntry = {
    //                 ncrNumber: ncrNumber,
    //                 actionType: "Return to Quality",
    //                 status: 'Open',
    //                 actionDescription: `Returned to Quality by Engineering with reason: ${reason}`,
    //                 changedBy: getUserName(),
    //                 changedOn: Timestamp()
    //             };
    //             history.push(historyEntry);
    //             sessionStorage.setItem('history', JSON.stringify(history));
    
    //             alert(`NCR ${ncrNumber} has been returned to Quality with reason: ${reason}.`);
    
    //             loadQualityTable();
    //         } else {
    //             alert("Quality entry not found for the specified NCR number.");
    //         }
    //     } else {
    //         alert("Engineering entry not found for the specified NCR number.");
    //     }
    
        
    // }
    

    function closeModal(){
        const modal = document.getElementById("modal");
        modal.style.visibility = "hidden";
        modal.style.display = "none"; 
    }

    
    
    // function sendComment(ncrNumber, reason){
    
    //     const reason = document.getElementById("reason").value;
    //     if(!reason){
    //         alert("Enter a reason before submitting")
    //         return;
    //     }
    
    //     const engineeringEntry = engineering.find(entry.ncrnumber === ncrNumber);
    
    //     if (engineeringEntry){
    //         engineeringEntry.comment = reason;
    //         engineeringEntry.ncrStaus = "Returned to Quality";
    
    
    //         sessionStorage.setItem('engineeing',JSON.stringify(engineering));
    //         const qualityEntry = quality.find(entry => entry.ncrNumber === ncrNumber);
    //         if (qualityEntry) {
                
    //             qualityEntry.returnReason = reason;
    //             qualityEntry.ncrStatus = "Returned to Quality";
    
    //             sessionStorage.setItem('quality', JSON.stringify(quality));
    
    //             const historyEntry = {
    //                 ncrNumber: ncrNumber,
    //                 actionType: "Return to Quality",
    //                 status: 'Open',
    //                 actionDescription: `Returned to Quality by Engineering with reason: ${reason}`,
    //                 changedBy: getUserName(),
    //                 changedOn: Timestamp()
    //             };
    //             history.push(historyEntry);
    //             sessionStorage.setItem('history', JSON.stringify(history));
    
    //             alert(`NCR ${ncrNumber} has been returned to Quality with reason: ${reason}.`);
    
    //             loadQualityTable();
    //         } else {
    //             alert("Quality entry not found for the specified NCR number.");
    //         }
    //     } else {
    //         alert("Engineering entry not found for the specified NCR number.");
    //     }
    
        
    // }
    
    




document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    const nameDisplay = document.getElementById('userFullname');
    const roleDisplay = document.getElementById('userRole');
    const nameInput = document.getElementById('nameInput');
    const roleInput = document.getElementById('roleInput');
    const editIcon = document.getElementById('editIcon');
    const profilePic = document.getElementById('profilePic');
    const profilePagePic = document.getElementById('profilePagePic');
    const imageUpload = document.getElementById('imageUpload');
    const message = document.getElementById('roleMessage');



    // Load user data from localStorage if it exists
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        userFullnameProfilePage.textContent = `${loggedInUser.user_Firstname} ${loggedInUser.user_Lastname}`;
        userRoleProfilePage.textContent = loggedInUser.Department_Name;
        nameInput.value = `${loggedInUser.user_Firstname} ${loggedInUser.user_Lastname}`;
        roleInput.value = loggedInUser.Department_Name;

        // Load profile picture from localStorage or set default
        const profilePictureSrc = loggedInUser.profilePicture || (loggedInUser.gender === 'male' ? 'images/user-profile_v1.png' : 'images/user-profile.png');
        profilePagePic.src = profilePictureSrc;
        profilePic.src = profilePictureSrc; // Initial header picture
    }

    // Save initial values to restore them on cancel
    let initialName = nameInput.value;
    let initialRole = roleInput.value;
    let initialProfilePicture = profilePagePic.src;
    let tempProfilePicture = initialProfilePicture;
    let changedPic = null;

    // Toggle to edit mode
    editButton.addEventListener('click', () => {
        // Hide display text and show input fields
        userFullnameProfilePage.style.display = 'none';
        userRoleProfilePage.style.display = 'none';
        nameInput.style.display = 'block';
        roleInput.style.display = 'block';
        roleMessage.style.display = 'block';

        // Show the edit icon
        editIcon.style.display = 'block';
        editButton.style.display = 'none';
        saveButton.style.display = 'block';
        cancelButton.style.display = 'block';
    });

    // Save changes and exit edit mode
    saveButton.addEventListener('click', () => {
        // Update display with new values from input fields
        userFullnameProfilePage.textContent = nameInput.value;
        userRoleProfilePage.textContent = roleInput.value;

        // Save the updated information to localStorage
        const [firstName, ...lastNameParts] = nameInput.value.split(" ");
        const lastName = lastNameParts.join(" ");
        const updatedUser = {
            ...loggedInUser,
            user_Firstname: firstName,
            user_Lastname: lastName,
            Department_Name: roleInput.value,
            profilePicture: tempProfilePicture // Save temporary picture as final picture

        };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

        profilePic.src = tempProfilePicture;


        // Show display text and hide input fields
        userFullnameProfilePage.style.display = 'block';
        userRoleProfilePage.style.display = 'block';
        nameInput.style.display = 'none';
        roleInput.style.display = 'none';
        message.style.display = 'none';

        // Hide the edit icon
        editIcon.style.display = 'none';
        editButton.style.display = 'block';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';


        // Update header display (assuming header elements have the same IDs as nameDisplay and roleDisplay)
        document.getElementById('headerName').textContent = nameInput.value;
        document.getElementById('headerRole').textContent = roleInput.value;

        initialName = nameInput.value;
        initialRole = roleInput.value;
        initialProfilePicture = tempProfilePicture;
    });

    cancelButton.addEventListener('click', () => {

        userFullnameProfilePage.style.display = 'block';
        userRoleProfilePage.style.display = 'block';
        nameInput.style.display = 'none';
        roleInput.style.display = 'none';
        roleMessage.style.display = 'none';
        nameInput.value = initialName;
        roleInput.value = initialRole;
        profilePagePic.src = initialProfilePicture;
        tempProfilePicture = initialProfilePicture;
        profilePic.src = initialProfilePicture;

        // Show the edit icon
        editIcon.style.display = 'none';
        editButton.style.display = 'block';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';


    });
    // Profile picture change handler
    editIcon.addEventListener('click', () => {
        imageUpload.click(); // Open file input dialog
    });

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                tempProfilePicture = e.target.result; // Store temporarily, only saved on Save button click
                profilePagePic.src = e.target.result;

                // Optional: Save updated picture URL in localStorage if required for persistence
                const updatedUser = {
                    ...loggedInUser,
                    profilePicture: e.target.result
                };
                localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
            };
            reader.readAsDataURL(file);
        }
    });
});
