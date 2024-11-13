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
    const profilePagePic = document.getElementById('profilePagePic');


    if (loggedInUser && fullNameElement && roleElement) {
        fullNameElement.textContent = `${loggedInUser.user_Firstname.substring(0, 1)}. ${loggedInUser.user_Lastname}`;
        roleElement.textContent = loggedInUser.Department_Name;

        profilePicElement.src = loggedInUser.profilePicture || (loggedInUser.gender === 'male' ? 'images/user-profile_v1.png' : 'images/user-profile.png');;
        // Set profile picture based on gender
        //profilePicElement.src = loggedInUser.gender === 'male' ? 'images/user-profile_v1.png' : 'images/user-profile.png';

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
                populateNotificationsEng()
                setupEngNavigationButtons();
                recentEngNCRs();
            }

        } else if (pageName === 'view.html') {
            if (userRole == "Quality") {
                document.getElementById('secEngineer').style.display = 'none';
                populateNotifications();
                populateSupplierDropdownN('supplierName')
                NavBar();
                performSearch();

            }
            else if (userRole == "Engineer") {
                document.getElementById('secQuality').style.display = 'none';
                populateNotificationsEng()
                performSearchEng();
            }

        } else if (ncrNumber && pageName === 'create.html') {
            if (userRole == "Quality") {
                document.getElementById('secEngineer').style.display = 'none';
                toggleCreateEditModal(ncrNumber, true);
            }
            else if (userRole == "Engineer") {
                document.getElementById('secQuality').style.display = 'none';
                populateNotificationsEng()
                populateDetailsPageEng(ncrNumber)
                populateEngEditPage(ncrNumber)
                setupEngSaveNCR();
                setupEngSubmitNCR();
            }
        } else if (pageName === 'create.html') {
            if(userRole == 'Quality'){
                document.getElementById('secEngineer').style.display = 'none';
                toggleCreateEditModal(null, false);
                setupCreateNCRButton();
            }else if(userRole == 'Engineer'){
                document.getElementById('secQuality').style.display = 'none';
            }
        } else if (ncrNumber && pageName === 'details.html') {
            populateDetailsPage(ncrNumber);
            if (userRole == "Quality") {
                document.getElementById('secEngineer').style.display = 'none';
                document.getElementById('revertButton').style.display = 'none';
                populateNotifications();
                NavBar();
            }
            else if (userRole == "Engineer") {
                document.getElementById('editButton').style.display = 'none';
                populateNotificationsEng()
                populateEngDetailsPage(ncrNumber);
                popupComment();
                closeModal();
                ;
            }
        }
        else if (pageName === 'profile_settings.html') {
            if (userRole == "Quality") {
                populateNotifications();
                NavBar();
            }
            else if (userRole == "Engineer") {
                populateNotificationsEng()
            }

        } else if (pageName === 'reports.html') {
            performSearchReports();
            if (userRole == "Quality") {
                populateNotifications();
                NavBar();
            }
            else if (userRole == "Engineer") {
                populateNotificationsEng()
            }
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
            populateNotifications();
            NavBar();
            populateEditPage(ncrNumber);
            populateSupplierDropdown('supplierName', ncrNumber);
            setupSaveNCR();
            setupSubmitNCR();
        } else {
            createNCRModal.style.visibility = 'visible';
            createEditModal.style.visibility = 'hidden';
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


    //=============================
    //Account Settings Page
    //=============================
    const editButton = document.getElementById('editButtonAcc');
    const saveButton = document.getElementById('saveButton');
    const cancelProfileButton = document.getElementById('cancelButton');
    const nameDisplay = document.getElementById('userFullnameProfilePage');
    const roleDisplay = document.getElementById('userRoleProfilePage');
    const usernameDisplay = document.getElementById('username');
    const firstNameDisplay = document.getElementById('userFirstnameProfilePage');
    const middleNameDisplay = document.getElementById('userMiddlenameProfilePage');
    const lastNameDisplay = document.getElementById('userLastnameProfilePage');
    const emailDisplay = document.getElementById('userEmailProfilePage');
    const passwordDisplay = document.getElementById('userPasswordProfilePage');
    const genderDisplay = document.getElementById('userGenderProfilePage');
    const errormsg = document.getElementById('errormsg');


    const nameInput = document.getElementById('nameInput');
    const roleInput = document.getElementById('roleInput');
    const editIcon = document.getElementById('editIcon');
    const imageUpload = document.getElementById('imageUpload');
    const message = document.getElementById('roleMessage');
    const firstName = document.getElementById('firstnameInput');
    const middleName = document.getElementById('middlenameInput');
    const lastName = document.getElementById('lastnameInput');
    const userName = document.getElementById('usernameInput');
    const email = document.getElementById('emailInput');
    const password = document.getElementById('passwordInput');
    const gender = document.getElementById('genderInput');





    // Load user data from localStorage if it exists
    if (loggedInUser) {
        nameDisplay.textContent = `${loggedInUser.user_Firstname} ${loggedInUser.user_Middlename} ${loggedInUser.user_Lastname}`;  //`${loggedInUser.user_Firstname} ${loggedInUser.user_Lastname}`;
        roleDisplay.textContent = loggedInUser.Department_Name;
        usernameDisplay.textContent = loggedInUser.user_name;
        firstNameDisplay.textContent = loggedInUser.user_Firstname;
        middleNameDisplay.textContent = loggedInUser.user_Middlename;
        lastNameDisplay.textContent = loggedInUser.user_Lastname;
        emailDisplay.textContent = loggedInUser.email;
        passwordDisplay.textContent = loggedInUser.password;
        genderDisplay.textContent = loggedInUser.gender;


        roleInput.value = loggedInUser.Department_Name;
        userName.value = loggedInUser.user_name;
        firstName.value = loggedInUser.user_Firstname;
        middleName.value = loggedInUser.user_Middlename;
        lastName.value = loggedInUser.user_Lastname;
        email.value = loggedInUser.email;
        password.value = loggedInUser.password;
        gender.value = loggedInUser.gender;
        nameInput.value = `${firstName.value} ${middleName.value} ${lastName.value}`;


        // Load profile picture from localStorage or set default
        const profilePictureSrc = loggedInUser.profilePicture || (loggedInUser.gender === 'male' ? 'images/user-profile_v1.png' : 'images/user-profile.png');
        profilePagePic.src = profilePictureSrc;
        profilePicElement.src = profilePictureSrc; // Initial header picture
    }

    // Save initial values to restore them on cancel
    let initialName = nameInput.value;
    let initialRole = roleInput.value;
    let initialUserName = userName.value;
    let initialFirstName = firstName.value;
    let initialMiddleName = middleName.value;
    let initialLastName = lastName.value;
    let initialEmail = email.value;
    let initialPassword = password.value;
    let initialGender = gender.value;



    let initialProfilePicture = profilePagePic.src;
    let tempProfilePicture = initialProfilePicture;
    let changedPic = null;

    // Toggle to edit mode
    editButton.addEventListener('click', () => {
        // Hide display text and show input fields
        userFullnameProfilePage.style.display = 'none';
        userRoleProfilePage.style.display = 'none';
        username.style.display = 'none';
        userFirstnameProfilePage.style.display = 'none';
        userMiddlenameProfilePage.style.display = 'none';
        userLastnameProfilePage.style.display = 'none';
        userEmailProfilePage.style.display = 'none';
        userPasswordProfilePage.style.display = 'none';
        userGenderProfilePage.style.display = 'none';
        nameInput.style.display = 'none';
        fullnameHeading.style.display = 'none';


        roleInput.style.display = 'block';
        roleMessage.style.display = 'block';
        userName.style.display = 'block';
        firstName.style.display = 'block';
        middleName.style.display = 'block';
        lastName.style.display = 'block';
        email.style.display = 'block';
        password.style.display = 'block';
        gender.style.display = 'block';
        togglePassword.style.display = 'block';


        // Show the edit icon
        editIcon.style.display = 'block';
        editButton.style.display = 'none';
        saveButton.style.display = 'block';
        cancelProfileButton.style.display = 'block';
    });

    // Save changes and exit edit mode
    saveButton.addEventListener('click', () => {
        // Update display with new values from input fields
        userFullnameProfilePage.textContent = nameInput.value;
        userRoleProfilePage.textContent = roleInput.value;

        // Save the updated information to localStorage

        if (userName.value.trim() === "") {
            errormsg.style.display = 'block';
            errormsg.textContent = "*Username is required";
            errormsg.scrollIntoView({ behavior: 'smooth' });
            return;

        }
        if (firstName.value.trim() === "") {
            errormsg.style.display = 'block';
            errormsg.textContent = "*First Name is required";
            errormsg.scrollIntoView({ behavior: 'smooth' });
            return;

        }
        if (lastName.value.trim() === "") {
            errormsg.style.display = 'block';
            errormsg.textContent = "*Last Name is required";
            errormsg.scrollIntoView({ behavior: 'smooth' });
            return;

        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email.value.trim())) {
            errormsg.style.display = 'block';
            errormsg.textContent = "*Email should of xyz@email.com";
            errormsg.scrollIntoView({ behavior: 'smooth' });
            return;

        }
        if (password.value.trim() === "") {
            errormsg.style.display = 'block';
            errormsg.textContent = "*Password is required";
            errormsg.scrollIntoView({ behavior: 'smooth' });
            return;

        }


        const updatedUser = {
            ...loggedInUser,
            user_name: userName.value,
            user_Firstname: firstName.value,
            user_Middlename: middleName.value || '-',
            user_Lastname: lastName.value,
            Department_Name: roleInput.value || '-',
            profilePicture: tempProfilePicture, // Save temporary picture as final picture
            email: email.value || '-',
            password: password.value,
            gender: gender.value || '-'

        };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

        profilePicElement.src = tempProfilePicture;


        // Show display text and hide input fields
        userFullnameProfilePage.style.display = 'block';
        userRoleProfilePage.style.display = 'block';
        username.style.display = 'block';
        userFirstnameProfilePage.style.display = 'block';
        userMiddlenameProfilePage.style.display = 'block';
        userLastnameProfilePage.style.display = 'block';
        userEmailProfilePage.style.display = 'block';
        userPasswordProfilePage.style.display = 'block';
        userGenderProfilePage.style.display = 'block';

        nameInput.style.display = 'none';
        roleInput.style.display = 'none';
        message.style.display = 'none';
        userName.style.display = 'none';
        firstName.style.display = 'none';
        middleName.style.display = 'none';
        lastName.style.display = 'none';
        email.style.display = 'none';
        password.style.display = 'none';
        gender.style.display = 'none';
        togglePassword.style.display = 'none';
        errormsg.style.display = 'none';


        // Hide the edit icon
        editIcon.style.display = 'none';
        editButton.style.display = 'block';
        saveButton.style.display = 'none';
        cancelProfileButton.style.display = 'none';


        // Update header display (assuming header elements have the same IDs as nameDisplay and roleDisplay)
        document.getElementById('userFullname').textContent = `${firstName.value} ${lastName.value}`;
        document.getElementById('userRole').textContent = roleInput.value;
        document.getElementById('profilePic').src = tempProfilePicture;

        initialName = nameInput.value;
        initialRole = roleInput.value;
        initialUserName = userName.value;
        initialFirstName = firstName.value;
        initialMiddleName = middleName.value;
        initialLastName = lastName.value;
        initialEmail = email.value;
        initialPassword = password.value;
        initialGender = gender.value;
        initialProfilePicture = tempProfilePicture;

        window.location.reload();

    });

    cancelProfileButton.addEventListener('click', () => {

        userFullnameProfilePage.style.display = 'block';
        userRoleProfilePage.style.display = 'block';
        username.style.display = 'block';
        userFirstnameProfilePage.style.display = 'block';
        userMiddlenameProfilePage.style.display = 'block';
        userLastnameProfilePage.style.display = 'block';
        userEmailProfilePage.style.display = 'block';
        userPasswordProfilePage.style.display = 'block';
        userGenderProfilePage.style.display = 'block';

        nameInput.style.display = 'none';
        roleInput.style.display = 'none';
        roleMessage.style.display = 'none';
        userName.style.display = 'none';
        firstName.style.display = 'none';
        middleName.style.display = 'none';
        lastName.style.display = 'none';
        email.style.display = 'none';
        password.style.display = 'none';
        gender.style.display = 'none';
        togglePassword.style.display = 'none';
        errormsg.style.display = 'none';

        nameInput.value = initialName;
        roleInput.value = initialRole;
        firstName.value = initialFirstName;
        userName.value = initialUserName;
        middleName.value = initialMiddleName;
        lastName.value = initialLastName;
        email.value = initialEmail;
        password.value = initialPassword;
        gender.value = initialGender;
        profilePagePic.src = initialProfilePicture;
        tempProfilePicture = initialProfilePicture;
        profilePic.src = initialProfilePicture;
        profilePicElement.src = initialProfilePicture;


        // Show the edit icon
        editIcon.style.display = 'none';
        editButton.style.display = 'block';
        saveButton.style.display = 'none';
        cancelProfileButton.style.display = 'none';

        window.location.reload();


    });

    document.getElementById('togglePassword').addEventListener('click', function () {
        const passwordInput = document.getElementById('passwordInput');
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

        // Optionally, change the icon
        this.textContent = type === 'password' ? '👁️' : '🙈';
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
                const newProfilePicture = e.target.result; // Base64 URL of the new image
                tempProfilePicture = e.target.result; // Store temporarily, only saved on Save button click
                profilePagePic.src = e.target.result;
                profilePic.src = newProfilePicture;
                profilePicElement.src = newProfilePicture; // Update header pic immediately


                // Optional: Save updated picture URL in localStorage if required for persistence

            };
            reader.readAsDataURL(file);
        }
    });
});


//==========
//Notifications
//=========

const toggleSwitch = document.getElementById("toggleSwitch");
const profileButton = document.getElementById("btnNotification");

// Set initial visibility based on the checkbox state


// Toggle visibility on change
const savedState = localStorage.getItem("toggleState");

  if (savedState !== null) {
    // Convert savedState to boolean and set the checkbox and button visibility
    toggleSwitch.checked = savedState === "true";
    profileButton.style.display = toggleSwitch.checked ? "block" : "none";
  } else {
    // If no state is saved, use the default HTML state of the checkbox
    profileButton.style.display = toggleSwitch.checked ? "block" : "none";
  }

  // Add event listener to toggle switch
  toggleSwitch.addEventListener("change", function () {
    // Save the current state of the toggle switch in localStorage
    localStorage.setItem("toggleState", toggleSwitch.checked); // Save "true" or "false"
    
    // Update the display of the notification button
    profileButton.style.display = toggleSwitch.checked ? "block" : "none";
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

