// =======================================================================
// FUNCTIONS SUPPORTING THE MAIN.JS
// These must load first and are placed first when referencing in html
// =======================================================================

//FUNCTIONS USED ON DASHBOARD/HOME PAGE


// Retrieve and return the logged-in user's name
function getUserName() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        return `${loggedInUser.user_Firstname} ${loggedInUser.user_Lastname}`;
    } else {
        console.error("No logged-in user found.");
        return 'Unknown User'; // Default to 'Unknown User' if no one is logged in
    }
}

// Retrieve and return the department
function getUserRole() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        return loggedInUser.Department_Name;
    } else {
        console.error("No logged-in user found.");
        return 'Unknown User role'; // Default to 'Unknown User' if no one is logged in
    }
}


// ==========================================
// 1. Populate Notifications - For all pages
// ==========================================
function populateNotifications() {
    const dropdown = document.getElementById('notifList');
    const dropdownDesc = document.getElementById('notifDesc');
    if (!dropdown) {
        console.warn('Dropdown menu element not found.');
        return;
    }
    dropdown.innerHTML = ""; // Clear existing notifications

    const oldNotifications = getOldNotifications();
    const closedNotifications = JSON.parse(sessionStorage.getItem('closedNotifications')) || [];

    // Filter out closed notifications
    const visibleNotifications = oldNotifications.filter(ncr => !closedNotifications.includes(ncr));

    const countLabel = document.getElementById('spnCount');
    if (countLabel) {
        countLabel.textContent = `${visibleNotifications.length}`; // Update count label
    } else {
        console.warn('Count label element not found.');
    }

    if (visibleNotifications.length === 0) {
        dropdown.innerHTML = "<span>No urgent notifications</span>";
        countLabel.style.opacity = "0%";
        return;
    }

    dropdownDesc.innerHTML = "<p>Pending NCRs for Over 7 Days</p>"; // Text explaining urgency

    // Limit the number of notifications shown in the dropdown
    const notificationsToShow = visibleNotifications; // Show all notifications in the dropdown

    notificationsToShow.forEach(ncrNumber => {
        const notificationItem = document.createElement('div');
        notificationItem.classList = 'notif-item'

        const link = document.createElement('a');
        link.textContent = `NCR Number: ${ncrNumber}`;
        link.href = `create.html?ncr=${ncrNumber}`;
        link.style.cursor = 'pointer'; // Change cursor to pointer
        link.onclick = (e) => {
            e.preventDefault();
            editEntry(ncrNumber);
        };

        const closeButton = document.createElement('button');
        closeButton.classList.add('notif-button-close');
        closeButton.title = "Close Notification";
        closeButton.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18 17.94 6M18 18 6.06 6"/>
        </svg>`
        
        closeButton.onclick = (e) => {
            e.preventDefault(); // Prevent default action
            e.stopPropagation(); // Prevent click from propagating to parent elements

            // Logic to close the notification
            closedNotifications.push(ncrNumber); // Store the closed notification
            sessionStorage.setItem('closedNotifications', JSON.stringify(closedNotifications)); // Save to sessionStorage
            notificationItem.remove(); // Remove this notification item
            updateNotificationCount(); // Update the notification count
            // Dropdown remains open
        };

        notificationItem.appendChild(link);
        notificationItem.appendChild(closeButton);
        dropdown.appendChild(notificationItem);
    });

    // Add a style to make the dropdown scrollable
    dropdown.style.overflowY = 'auto';
    dropdown.style.maxHeight = '200px'; // Set the height limit for scrolling
}

// Function to update notification count
function updateNotificationCount() {
    const dropdown = document.getElementById('notifList');
    const countLabel = document.getElementById('spnCount');
    const currentCount = dropdown.children.length;
    countLabel.textContent = `${currentCount}`; // Update count label
}

// Supporting Function - Get Old Notifications
function getOldNotifications() {
    const today = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 7);

    return quality.filter(item => new Date(item.dateCreated) < fourteenDaysAgo && item.ncrStatus === "Quality")
        .map(item => item.ncrNumber);
}



// // Close dropdown if clicked outside (Notification)
// document.addEventListener('click', function (event) {
//     const notifDisplay = document.getElementById('notifDisplay');
//     const btnNotification = document.getElementById('btnNotification');

//     // Check if the click was outside the notification display and the button
//     if (!notifDisplay.contains(event.target) &&
//         !btnNotification.contains(event.target)) {
//         notifDisplay.style.display = 'none'; // Hide the dropdown
//     }
// });

// // Close dropdown if clicked outside (Profile)
// document.addEventListener('click', function (event) {
//     const profileDisplay = document.getElementById('profileDropdown');
//     const btnProfile = document.getElementById('btnProfile');

//     // Check if the click was outside the notification display and the button
//     if (!profileDisplay.contains(event.target) &&
//         !btnProfile.contains(event.target)) {
//         profileDisplay.style.display = 'none'; // Hide the dropdown
//     }
// });

// // Add this function to manage dropdown state
// function toggleDropdown() {
//     const btnNotification = document.getElementById('btnNotification');
//     const notifDisplay = document.getElementById('notifDisplay');

//     const isExpanded = btnNotification.getAttribute('aria-expanded') === 'true';
//     btnNotification.setAttribute('aria-expanded', !isExpanded);
//     notifDisplay.style.display = isExpanded ? 'none' : 'block'; // Toggle dropdown visibility
// }

// // Toggle Profile Dropdown
// function toggleProfileDropdown() {
//     const dropdown = document.getElementById('profileDropdown');
//     dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
// }

// Function to toggle dropdown visibility and ensure only one is open at a time
function toggleDropdown(dropdownId) {
    const profileDropdown = document.getElementById('profileDropdown');
    const notifDropdown = document.getElementById('notifDisplay');
    const targetDropdown = document.getElementById(dropdownId);

    // Close the other dropdown if it's open
    if (dropdownId === 'profileDropdown' && notifDropdown.classList.contains('active')) {
        notifDropdown.classList.remove('active');
    } else if (dropdownId === 'notifDisplay' && profileDropdown.classList.contains('active')) {
        profileDropdown.classList.remove('active');
    }

    // Toggle the target dropdown
    targetDropdown.classList.toggle('active');
}

// Event listeners for profile and notification buttons
document.getElementById('btnProfile').addEventListener('click', function (event) {
    event.stopPropagation(); // Prevents event from reaching document level
    toggleDropdown('profileDropdown');
});

document.getElementById('btnNotification').addEventListener('click', function (event) {
    event.stopPropagation(); // Prevents event from reaching document level
    toggleDropdown('notifDisplay');
});

// Close dropdowns if clicked outside
document.addEventListener('click', function (event) {
    document.getElementById('profileDropdown').classList.remove('active');
    document.getElementById('notifDisplay').classList.remove('active');
});

// ==============================================================
// 2. Recent NCRs on Dashboard/Home Page
// ==============================================================
function recentNCRs() {
    if (!quality.length) {
        console.warn('No quality data available to display.');
        return;
    }

    const recentNCRss = [...quality].reverse(); // Clone and reverse to avoid mutating the original array
    const recentN = recentNCRss.slice(0, 5);

    console.log(recentN);
    console.log(recentNCRss);

    const tableBody = document.getElementById("indexTableContent");
    if (!tableBody) {
        console.warn('Table body element not found.');
        return;
    }
    tableBody.innerHTML = ''; // Clear previous results

    recentN.forEach(result => {
        //const editButtonDisabled = result.ncrStatus !== "Quality" ? "disabled" : "";
        const newRow = `<tr>
                             <td>${result.ncrNumber}</td>
                             <td>${result.supplierName}</td>
                             <td>${formatDate(result.dateCreated)}</td>
                             <td>${result.ncrStatus}</td>
                             <td>
                                 <div>
                                    <button onclick="detailsEntry('${result.ncrNumber}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        </svg>
                                        View
                                    </button>
                                    <button onclick="handleEditEntry('${result.ncrNumber}', '${result.ncrStatus}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                        </svg>
                                        Edit
                                    </button>
                                 </div>
                             </td>
                         </tr>`;
        tableBody.innerHTML += newRow;
    });
}

//Supporting Function - For Formatting Dates for User Output
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

//FUNCTIONS USED ON DETAILS PAGE (WHEN VIEWING ONE NCR)

// ===========================================================
// 3. View Details of NCR
//Populate the Details Page of an NCR when a user clicks view
// ===========================================================
function populateDetailsPage(ncrNumber) {
    const entry = quality.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        document.getElementById('ncrNumber').textContent = entry.ncrNumber ?? "";
        document.getElementById('dateCreated').textContent = formatDate(entry.dateCreated) ?? "";
        document.getElementById('createdBy').textContent = entry.createdBy ?? "";
        document.getElementById('ncrStatus').textContent = entry.ncrStatus ?? "Quality";
        document.getElementById('applicableProcess').textContent = entry.applicableProcess ?? "";
        document.getElementById('supplierNameD').textContent = entry.supplierName ?? "";

        // Handle missing values with nullish coalescing
        document.getElementById('poNumber').textContent = entry.poNumber ?? "";
        document.getElementById('soNumber').textContent = entry.soNumber ?? "";
        document.getElementById('quantityReceived').textContent = entry.quantityReceived ?? "";
        document.getElementById('quantityDefect').textContent = entry.quantityDefect ?? "";
        document.getElementById('itemDescription').innerHTML = entry.itemDescription.replace(/\n/g, '<br/>') ?? "";
        document.getElementById('defectDescription').innerHTML = entry.defectDescription.replace(/\n/g, '<br/>') ?? "";

        // Assuming engineering is related to defect description
        document.getElementById('engNeeded').textContent = entry.engNeeded ?? "No";
        document.getElementById('itemConform').textContent = entry.itemConform ?? "No";

        const documentFilesList = document.getElementById('thumbnailsContainer');
        documentFilesList.innerHTML = ''; // Clear any existing content

        // Check if documentFiles exists and has items
        if (entry.documentFiles && entry.documentFiles.length > 0) {
            entry.documentFiles.forEach(file => {
                // Create elements for each thumbnail
                const fileItem = document.createElement('div');
                fileItem.classList.add('file-item');

                const thumbnailImage = document.createElement('img');
                thumbnailImage.src = file.thumbnail; // Assuming file.thumbnail contains the image data
                thumbnailImage.classList.add('thumbnail');

                // Append elements to the file item
                fileItem.appendChild(thumbnailImage);
                documentFilesList.appendChild(fileItem); // Append file item to the container
            });
        } else {
            documentFilesList.innerHTML = 'No uploaded files.'; // Handle no files case
        }
        // Disable edit button if status is not "Quality"
        const editButton = document.getElementById('editButton'); // Assuming you have an edit button with this ID

        if (editButton) {
            editButton.onclick = () => {
                const ncrStatus = entry.ncrStatus; // Get the NCR status from the entry object

                if (ncrStatus !== "Quality") {
                    alert(`This NCR is already submitted to ${ncrStatus}.`);
                } else {
                    // Proceed to edit the entry
                    editEntry(entry.ncrNumber, ncrStatus);
                }
            };
        }
    } else {
        console.error('Entry not found for NCR number:', ncrNumber);
    }
}


// Supporting Function - Redirection to Details Page of NCR when View button is clicked
function detailsEntry(ncrNumber) {
    window.location.href = `details.html?ncr=${ncrNumber}`; // Redirect to edit page
    console.log(ncr);
}


//working with
function editEntryTrial(ncrNumber) {
    window.location.href = `create.html?ncr=${ncrNumber}`; // Redirect to edit page
    console.log(ncr);
}

//FUNCTION USED ON AN EDIT PAGE - HAPPENS AT THE CREATE PAGE

// ============================================================
// 4. Edit The Information of an NCR that has been Created
// Populate the Create Page of an NCR when a user clicks Edit
// or immediately after creationg an NCR
// ============================================================

function populateEditPage(ncrNumber) {
    document.getElementById('createEditNCR').innerHTML = 'Edit NCR';
    document.getElementById('create-edit')
    const entry = quality.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        document.getElementById('ncrNumber').textContent = entry.ncrNumber;
        document.getElementById('dateCreated').textContent = formatDate(entry.dateCreated);
        document.getElementById('createdBy').textContent = entry.createdBy;
        document.getElementById('ncrStatus').textContent = entry.ncrStatus;
        document.getElementById('applicableProcess').value = entry.applicableProcess;
        document.getElementById('supplierName').value = entry.supplierName;
        document.getElementById('poNumber').value = entry.poNumber ? entry.poNumber : '';
        document.getElementById('soNumber').value = entry.soNumber ? entry.soNumber : '';
        document.getElementById('quantityReceived').value = entry.quantityReceived ? entry.quantityReceived : '';
        document.getElementById('quantityDefect').value = entry.quantityDefect ? entry.quantityDefect : '';
        document.getElementById('itemDescription').value = entry.itemDescription ? entry.itemDescription : '';
        document.getElementById('defectDescription').value = entry.defectDescription ? entry.defectDescription : '';
        document.getElementById('engNeeded').checked = entry.engNeeded === 'Yes';
        document.getElementById('itemConform').checked = entry.itemConform === 'Yes';
        

       // Clear the existing thumbnails container
       const thumbnailsContainer = document.getElementById('thumbnailsContainer');
       thumbnailsContainer.innerHTML = "";
       // Populate previously uploaded files into the global array and display them
       uploadedFiles.length = 0; // Clear current files (if any)
       if (entry.documentFiles && entry.documentFiles.length > 0) {
           entry.documentFiles.forEach(file => {
               const fileObject = { file, thumbnail: file.thumbnail };
               uploadedFiles.push(fileObject);
               displayThumbnail(fileObject);
           });
       } 
   }
}

// Supporting Function - Redirection to Edit an NCR when Edit button is clicked
function editEntry(ncrNumber) {
    window.location.href = `create.html?ncr=${ncrNumber}`; // Redirect to edit page

}

// Supporting Function - Redirection to Edit an NCR when Edit button is clicked
function handleEditEntry(ncrNumber, ncrStatus) {
    if (ncrStatus !== "Quality") {
        alert(`This NCR is already submitted to ${ncrStatus}.`);
    } else {
        window.location.href = `create.html?ncr=${ncrNumber}`; // Redirect to edit page
    }
}

//FUNCTION USED ON VIEW NCRS PAGE TO PERFORM SEARCH

// ====================================================================
//  5. Perform Search - Used for Filtering
//     sets results to a table
//     View NCRs page is initialized to show NCRS still with Quality
// ====================================================================
let currentPage = 1; // Initialize the current page
let resultsPerPage = 10; // Number of results to show per page

function setupPagination(totalResults, displayResultsFunc, tableBodyId, paginationContainerId) {
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const paginationContainer = document.getElementById(paginationContainerId);
    paginationContainer.innerHTML = ''; // Clear previous pagination

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = page;
        pageButton.onclick = () => {
            currentPage = page; // Set current page to the clicked page
            displayResultsFunc(currentPage, resultsPerPage, tableBodyId); // Update results based on current page
        };

        // Highlight the active page
        if (page === currentPage) {
            pageButton.classList.add('active');
        }

        paginationContainer.appendChild(pageButton); // Add button to pagination
    }
}

function resetPagination() {
    currentPage = 1; // Reset to the first page
}

function performSearch() {
    const ncrNumber = document.getElementById('ncrNumber').value.trim();
    const supplierName = document.getElementById('supplierName').value;
    const ncrStatus = document.getElementById('ncrStatus').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;

    //const resultsCountMessage = document.getElementById('noResultsMessage');

    // Date validation
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        //resultsCountMessage.textContent = 'Start date must be earlier than or equal to end date.';
        //resultsCountMessage.style.display = 'inline';
        //return;

        alert("Start date must be earlier than or equal to end date.")
        location.reload();
        return;
    }
    if (ncrNumber && /[a-zA-Z]/.test(ncrNumber)) {
        //resultsCountMessage.textContent = 'NCR Number must not contain alphabetic characters.';
        //resultsCountMessage.style.display = 'inline';

        alert("NCR Number must not contain alphabetic characters.")
        location.reload();
        return;
    } /*else {
        resultsCountMessage.style.display = 'none';
    }*/

    const uniqueQuality = Array.from(new Map(quality.map(item => [item.ncrNumber, item])).values())
        .sort((a, b) => {
            const numA = parseInt(a.ncrNumber.split('-')[1], 10);
            const numB = parseInt(b.ncrNumber.split('-')[1], 10);
            return numB - numA;
        });

    const fromDateObj = fromDate ? new Date(fromDate + 'T00:00:00') : null;
    const toDateObj = toDate ? new Date(toDate + 'T23:59:59') : null;

    const filteredResults = uniqueQuality.filter(item => {
        const isNcrNumberValid = ncrNumber ? item.ncrNumber.includes(ncrNumber) : true;
        const isSupplierNameValid = supplierName ? item.supplierName === supplierName : true;
        const isStatusValid = ncrStatus ? item.ncrStatus === ncrStatus : true;

        const itemDateCreated = new Date(item.dateCreated);
        const isDateCreatedValid = (
            (fromDateObj ? itemDateCreated >= fromDateObj : true) &&
            (toDateObj ? itemDateCreated <= toDateObj : true)
        );

        return isNcrNumberValid && isSupplierNameValid && isStatusValid && isDateCreatedValid;
    });

    const totalResults = filteredResults.length;

    // Display results based on current page
    const tableBody = document.getElementById("viewTableContent");
    const paginatedResults = filteredResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

    tableBody.innerHTML = ''; // Clear previous results

    paginatedResults.forEach(result => {
        const newRow = `<tr>
                            <td>${result.ncrNumber}</td>
                            <td>${result.supplierName}</td>
                            <td>${formatDate(result.dateCreated)}</td>
                            <td>${result.ncrStatus}</td>
                            <td>
                                <div>
                                    <button onclick="detailsEntry('${result.ncrNumber}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        </svg>
                                        View
                                    </button>
                                    <button onclick="handleEditEntry('${result.ncrNumber}', '${result.ncrStatus}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                        </svg>
                                        Edit
                                    </button>
                                </div>
                            </td>
                        </tr>`;
        tableBody.innerHTML += newRow; // Add new row to table
    });

    // Setup pagination
    setupPagination(totalResults, performSearch, "viewTableContent", "pagination");
}


//NCR MANAGEMENT FUNCTIONS - CREATE, SAVE, SUBMIT, CANCEL


// ===================================================
// 6. Function to Create an NCR
// ==================================================
function CreateNCR() {
    // Ensure ncrLog and quality are initialized
    if (!Array.isArray(ncrLog)) {
        ncrLog = [];  // Initialize ncrLog if undefined
    }
    if (!Array.isArray(quality)) {
        quality = [];  // Initialize quality if undefined
    }
    if (!Array.isArray(history)) {
        history = [];  // Initialize history if undefined
    }
    // Get form values
    const applicableProcess = document.getElementById('napplicableProcess')?.value;
    const supplierName = document.getElementById('nsupplierName')?.value;

   // Check for empty or undefined applicableProcess and supplierName
   if (!applicableProcess || !supplierName) {
    alert("Please select both Applicable Process and Supplier");
    return;
}

    // Generate NCR Number and Timestamp
    const ncrNumber = NCRNumberGenerator();
    const dateCreated = Timestamp();
    createdBy = getUserName();

    // Creating NCR log entry
    const ncrLogEntry = {
        ncrNumber: ncrNumber,
        dateCreated: dateCreated,
        lastUpdated: dateCreated,
        createdBy: createdBy,  // Replace with actual user data if available
        supplierName: supplierName,
        applicableProcess: applicableProcess,
        status: "Open",
        dateClosed: "",  // Blank initially
        closedBy: ""     // Blank initially
    };
    console.log(ncrLogEntry)

    //console.log("New NCR Log Entry:", ncrLogEntry);

    // Add the entry to the ncrLog array
    ncrLog.push(ncrLogEntry);

    //Prepare History array entry
    const historyEntry = {
        ncrNumber: ncrLogEntry.ncrNumber,
        actionType: "Generate",
        status: ncrLogEntry.status,
        actionDescription: "New NCR generated",
        changedBy: ncrLogEntry.createdBy,
        changedOn: ncrLogEntry.dateCreated
    }
    // Add the entry to the history array
    history.push(historyEntry);


    // Prepare quality array entry
    const qualityEntry = {
        ncrNumber: ncrLogEntry.ncrNumber,
        dateCreated: ncrLogEntry.dateCreated,
        createdBy: ncrLogEntry.createdBy,
        supplierName: ncrLogEntry.supplierName,
        applicableProcess: ncrLogEntry.applicableProcess,
        poNumber: "",  // Empty for now, to be updated later
        soNumber: "",  // Empty for now, to be updated later
        quantityReceived: "",  // Empty for now
        quantityDefect: "",  // Empty for now
        engNeeded: "No",  // Default value
        itemConform: "No",  // Default value
        itemDescription: "",  // Empty for now
        defectDescription: "",  // Empty for now
        documentFiles: [],  // Empty for now
        ncrStatus: "Quality"
    };

    // Add the entry to the quality array
    quality.push(qualityEntry);
    console.log("Updated Quality Array:", quality);

    // Persist ncrLog and quality to sessionStorage
    sessionStorage.setItem('ncrLog', JSON.stringify(ncrLog));
    sessionStorage.setItem('history', JSON.stringify(history));
    sessionStorage.setItem('quality', JSON.stringify(quality));

    alert(`NCR Number ${ncrNumber} successfully generated. You may continue to provide additional information now or later`);
    const createNCRModal = document.getElementById('createNCRModal');
    const createEditModal = document.getElementById('createEditModal');

    createNCRModal.style.visibility = 'hidden';
    createEditModal.style.visibility = 'visible';

    sessionStorage.setItem('ncrNumber', ncrNumber);
    return ncrNumber
}

// Supporting Functions - Timestamp function - returns the current date
function Timestamp() {
    return new Date().toLocaleDateString(); // Format: MM/DD/YYYY
}

// Supporting Functions - NCR Number Generator function - creates unique NCR number in format YYYY-XXX
function NCRNumberGenerator() {
    const currentYear = new Date().getFullYear();
    const nextNumber = (ncrLog.length + 1).toString().padStart(3, '0'); // Pads to 3 digits
    return `${currentYear}-${nextNumber}`;
}

// =================================================================
// 7. Function to Save the NCR temporarily (incomplete data)
// =================================================================
// Global array to hold all uploaded files
// =================================================================
// 7. Function to Save the NCR temporarily (incomplete data)
// =================================================================


// Function to save NCR
function saveNCR() {
    const ncrNumber = document.getElementById('ncrNumber').textContent;

    const changedBy = getUserName();

    // Collect current form values
    const applicableProcess = document.getElementById('applicableProcess')?.value;
    const supplierName = document.getElementById('supplierName')?.value;
    const poNumber = document.getElementById('poNumber')?.value || '';
    const soNumber = document.getElementById('soNumber')?.value || '';
    const quantityReceived = document.getElementById('quantityReceived')?.value || '';
    const parsedQuantityReceived = Number(quantityReceived);
    const quantityDefect = document.getElementById('quantityDefect')?.value || '';
    const parsedQuantityDefect = Number(quantityDefect);
    const engNeeded = document.getElementById('engNeeded')?.checked ? 'Yes' : 'No';
    const itemConform = document.getElementById('itemConform')?.checked ? 'Yes' : 'No';
    const itemDescription = document.getElementById('itemDescription')?.value || '';
    const defectDescription = document.getElementById('defectDescription')?.value || '';

    // Find the NCR entry in the quality array based on ncrNumber
    const qualityEntry = quality.find(entry => entry.ncrNumber === ncrNumber);

    if (qualityEntry) {
        // Check for any changes before saving
        const noChanges = (
            qualityEntry.applicableProcess === applicableProcess &&
            qualityEntry.supplierName === supplierName &&
            qualityEntry.poNumber === poNumber &&
            qualityEntry.soNumber === soNumber &&
            Number(qualityEntry.quantityReceived) === parsedQuantityReceived &&
            Number(qualityEntry.quantityDefect) === parsedQuantityDefect &&
            qualityEntry.engNeeded === engNeeded &&
            qualityEntry.itemConform === itemConform &&
            qualityEntry.itemDescription === itemDescription &&
            qualityEntry.defectDescription === defectDescription &&
            JSON.stringify(qualityEntry.documentFiles) === JSON.stringify(uploadedFiles)  // Compare file uploads
        );

        if (noChanges) {
            alert('No changes were made.');
            return;
        }

        if (quantityReceived != "") {
            if (parsedQuantityReceived < 1) {
                alert('Quantity Received cannot be less than 1')
                return;
            }
        }

        if (quantityDefect != "") {
            if (parsedQuantityDefect < 1) {
                alert('Quantity Defective cannot be less than 1')
                return
            }
        }

        if (Number(quantityDefect) > Number(quantityReceived)) {
            alert('The number of defects cannot exceed the quantity received.')
            return;
        }

        const confirmation = confirm("Are you sure you want to save the NCR?");
        if (confirmation) {
            // Call your save function here
            // If changes were made, update the entry
            qualityEntry.applicableProcess = applicableProcess;
            qualityEntry.supplierName = supplierName;
            qualityEntry.poNumber = poNumber;
            qualityEntry.soNumber = soNumber;
            qualityEntry.quantityReceived = quantityReceived;
            qualityEntry.quantityDefect = quantityDefect;
            qualityEntry.engNeeded = engNeeded;
            qualityEntry.itemConform = itemConform;
            qualityEntry.itemDescription = itemDescription;
            qualityEntry.defectDescription = defectDescription;
            qualityEntry.documentFiles = [...uploadedFiles];  // Store the accumulated uploaded files

            // Persist updated quality array to sessionStorage
            sessionStorage.setItem('quality', JSON.stringify(quality));

            // Create a history entry and add it to the history array
            const historyEntry = {
                ncrNumber: ncrNumber,
                actionType: "Edit",
                status: 'Open',
                actionDescription: "Edited the NCR",
                changedBy: changedBy,  // This should be dynamically set to the actual user
                changedOn: Timestamp() // Use function timestamp
            };

            // Push the history entry and save it in sessionStorage
            history.push(historyEntry);
            sessionStorage.setItem('history', JSON.stringify(history));

            alert('Your changes have been saved. You can continue later.');
            window.history.back();
        } else {
            // If the user cancels, do nothing or add custom logic
            alert("Save operation cancelled.");
        }

    } else {
        alert('NCR not found. Please check the NCR number.');
    }
}

// ===================================================================
// 8. Function to Submit the NCR (all required fields must be filled)
// ===================================================================
function submitNCR() {
    const ncrNumber = document.getElementById('ncrNumber').textContent;

    changedBy = getUserName();

    // Collect current form values
    const applicableProcess = document.getElementById('applicableProcess')?.value;
    const supplierName = document.getElementById('supplierName')?.value;
    const poNumber = document.getElementById('poNumber')?.value || '';
    const soNumber = document.getElementById('soNumber')?.value || '';
    const quantityReceived = document.getElementById('quantityReceived')?.value || '';
    const quantityDefect = document.getElementById('quantityDefect')?.value || '';
    const engNeeded = document.getElementById('engNeeded')?.value || 'No';
    const itemConform = document.getElementById('itemConform')?.value || 'No';
    const itemDescription = document.getElementById('itemDescription')?.value || '';
    const defectDescription = document.getElementById('defectDescription')?.value || '';

    // Check if all required fields are filled
    if (!poNumber || !soNumber || !quantityReceived || !quantityDefect || !itemDescription || !defectDescription) {
        alert('Please fill out all the required fields before submitting.');
        return;
    }

    if (Number(quantityDefect) > Number(quantityReceived)) {
        alert('The number of defects cannot exceed the quantity received.')
        return;
    }

    if (Number(quantityReceived) < 1) {
        alert('Quantity Received cannot be less than 1.')
        return;
    }
    if (Number(quantityDefect) < 1) {
        alert('Quantity Defect cannot be less than 1.')
        return;
    }

    const confirmation = confirm("Are you sure you want to submit the NCR?");
    if (confirmation) {
        // Update the corresponding NCR in the quality array
        const qualityEntry = quality.find(entry => entry.ncrNumber === ncrNumber);

        if (qualityEntry) {

            const engNeededCheckbox = document.getElementById('engNeeded');

            qualityEntry.applicableProcess = applicableProcess;
            qualityEntry.supplierName = supplierName;
            qualityEntry.poNumber = poNumber;
            qualityEntry.soNumber = soNumber;
            qualityEntry.quantityReceived = quantityReceived;
            qualityEntry.quantityDefect = quantityDefect;
            qualityEntry.engNeeded = engNeeded;
            qualityEntry.itemConform = itemConform;
            qualityEntry.itemDescription = itemDescription;
            qualityEntry.defectDescription = defectDescription;
            qualityEntry.documentFiles = [...uploadedFiles];

            // Mark the NCR as submitted
            qualityEntry.ncrStatus = engNeededCheckbox.checked ? "Engineering" : "Operations";

            // Persist updated quality array to sessionStorage
            sessionStorage.setItem('quality', JSON.stringify(quality));

            //make history array and push to history json
            const historyEntry = {
                ncrNumber: ncrNumber,
                actionType: "Submit",
                status: 'Open',
                actionDescription: "Submission by Quality",
                changedBy: changedBy,
                changedOn: Timestamp()
            }

            history.push(historyEntry);
            sessionStorage.setItem('history', JSON.stringify(history));

            //make engineering array and push to engineering json
             //make engineering array and push to engineering json
             const engineeringEntry = {
                ncrNumber: ncrNumber,
                dateReceived: Timestamp(),
                itemDescription: itemDescription,
                ncrStatus: qualityEntry.ncrStatus,
                comment: "",
                reviewByCfEngineering: "",
                customerNotification: "",
                disposition: "",
                drawingUpdate: "",
                originalRevNumber: "",
                originalEngineerName: "",
                updatedRevNumber: "",
                revisionDate: "",
                engineerName: ""
            }
            engineering.push(engineeringEntry);
            sessionStorage.setItem('engineering', JSON.stringify(engineering));

            alert('NCR has been successfully submitted.');

            // Redirect or perform other actions as needed
            //window.history.back();
            window.location.href = "index.html"; // Redirect to edit page
            /*ncrNumber = ncrNumber;
            populateDetailsPage(ncrNumber); */
        }

    } else {
        // If the user cancels, do nothing or add custom logic
        alert("Submit operation cancelled.");
        // Redirect or perform other actions as needed
        window.history.back();

        history.push(historyEntry);
        sessionStorage.setItem('history', JSON.stringify(history));
    }
}



function populateRecordsTable(data) {
    const tableContent = document.getElementById('reportsTableContent');
    tableContent.innerHTML = ''; // Clear existing rows
    data.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${record.ncrNumber}</td>    
        <td>${formatDate(record.changedOn)}</td>
            <td>${record.actionType}</td>
            <td>${record.status}</td>
            <td>${record.actionDescription}</td>
            <td>${record.changedBy}</td>
        `;
        tableContent.appendChild(row);
    });
}

function viewReport(ncrNumber) {
    const filteredRecords = history.filter(record => record.ncrNumber === ncrNumber);
    populateRecordsTable(filteredRecords); // Populate with filtered records

    // Show the records table only if there are matching records
    const table = document.querySelector('#reportsTable');
    if (filteredRecords.length > 0) {
        table.style.display = 'block'; // Show the records table
    } else {
        table.style.display = 'none'; // Hide if no records
    }
}

function performSearchReports() {
    const ncrNumber = document.getElementById('ncrNumber').value.trim().toLowerCase();
    const ncrStatus = document.getElementById('ncrStatus').value;
    const ncrDepartment = document.getElementById('ncrDepartment').value;  // Get selected department
    const fromDateValue = document.getElementById('fromDate').value;
    const toDateValue = document.getElementById('toDate').value;

    let filteredReports = ncrLog;

    // Filter by NCR Number
    if (ncrNumber) {
        filteredReports = filteredReports.filter(report => report.ncrNumber.toLowerCase().includes(ncrNumber));
    }

    // Filter by Status
    if (ncrStatus !== 'All') {
        filteredReports = filteredReports.filter(report => report.status === ncrStatus);
    }

    // Filter by Department (new filter based on department selection)
    if (ncrDepartment && ncrDepartment !== 'All') {
        filteredReports = filteredReports.filter(report => report.department === ncrDepartment);
    }

    // Date validation
    if (fromDateValue && toDateValue && new Date(fromDateValue) > new Date(toDateValue)) {
        alert("Start date must be earlier than or equal to end date.");
        return;
    }

    // Filter by Date Range
    if (fromDateValue) {
        const fromDate = new Date(fromDateValue + 'T00:00:00'); // Start of the day
        filteredReports = filteredReports.filter(report => new Date(report.dateCreated) >= fromDate);
    }
    if (toDateValue) {
        const toDate = new Date(toDateValue + 'T23:59:59'); // End of the day
        filteredReports = filteredReports.filter(report => new Date(report.dateCreated) <= toDate);
    }

    // Sort filtered reports by NCRNumber in descending order
    filteredReports.sort((a, b) => {
        const [yearA, seqA] = a.ncrNumber.split('-').map(Number);
        const [yearB, seqB] = b.ncrNumber.split('-').map(Number);
        return yearB - yearA || seqB - seqA;
    });

    const totalResults = filteredReports.length;

    // Setup pagination
    const startIndex = (currentPage - 1) * resultsPerPage;
    const paginatedData = filteredReports.slice(startIndex, startIndex + resultsPerPage);

    // Populate the table
    const tableContent = document.getElementById('tableContent');
    tableContent.innerHTML = ''; // Clear existing rows

    let departmentMapping = {};
    quality.forEach(report => {
        departmentMapping[report.ncrNumber] = report.ncrStatus;  // Store ncrNumber -> department mapping
    });

    // Merge the department from quality.json into the ncrlog.json data based on ncrNumber
    ncrLog.forEach(log => {
        log.department = departmentMapping[log.ncrNumber] || "Unknown";  // Assign department or "Unknown" if not found
    });

    paginatedData.forEach(report => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${report.ncrNumber}</td>
            <td>${report.createdBy}</td>
            <td>${report.department}</td>
            <td>${formatDate(report.dateCreated)}</td>
            <td>${report.status}</td>
            <td>${formatDate(report.lastUpdated)}</td>
            <td>
                <button onclick="viewReport('${report.ncrNumber}')">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    View History
                </button>
            </td>
        `;
        tableContent.appendChild(row);
    });

    // Setup pagination controls
    setupPagination(totalResults, performSearchReports, 'tableContent', 'paginationControls');

    // Show or hide "no results" message
    //const noResultsMessage = document.getElementById('noResultsMessage');
    // Check if NCR number contains any alphabetic characters
    if (ncrNumber && /[a-zA-Z]/.test(ncrNumber)) {
        //noResultsMessage.textContent = 'NCR Number must not contain alphabetic characters.';
        //noResultsMessage.style.display = 'inline';

        alert("NCR Number must not contain alphabetic characters.")
        location.reload();
        return;
    }
    else if (filteredReports.length === 0) {
        //noResultsMessage.textContent = 'No results found.';
        //noResultsMessage.style.display = 'block';

        alert("No results found.")
        location.reload();
    } /*else {
        noResultsMessage.style.display = 'none';
    }*/
}

function clearSearch() {
    
    location.reload();
}


function NavBar() {
    const toggleCheckbox = document.getElementById('mobList');
    const navMenu = document.getElementById('mainNav');

    // Function to toggle the nav menu
    toggleCheckbox.addEventListener('change', function () {
        if (toggleCheckbox.checked) {
            navMenu.style.display = 'block'; // Show the nav
        } else {
            navMenu.style.display = 'none'; // Hide the nav
        }
    });
};

function printPdf() {
    // Get the content of the print section
    var printContent = document.getElementById("printSection");
    var ncrNumber = document.getElementById("ncrNumber").textContent.trim(); // Get NCR number from the page


    // Check if printContent exists
    if (!printContent) {
        console.error("Print section not found.");
        return;
    }

    // Open a new window
    var printWindow = window.open("", "_blank", "width=800,height=600");

    // Write the content and styles to the new window
    printWindow.document.open();
    printWindow.document.write(`
        <html>
        <head>
            <title>NCR - ${ncrNumber}</title>
            <link href="styles.css" rel="stylesheet">

            <style>
                body 
                {
                    -webkit-print-color-adjust: exact;
                     color-adjust: exact;
                }
                .form-header
                {
                    margin-top:5px;
                }
                #PrintButton, #editButton
                {
                    display:none;
                }
            </style>
        </head>
        <body>
        <br>
            ${printContent.outerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();

    // Wait for the new window to fully load, then print
    printWindow.onload = function () {
        setTimeout(() => {
            printWindow.print();
        }, 500); // Adjust delay as needed (500ms is usually sufficient)
    };

    // Close the print window only after printing is complete
    printWindow.onafterprint = function () {
        printWindow.close();
    };
}

//================================================================================================================
///FUNCTIONS SUPPLIER DROPDOWN
//
//=================================================================================================================
function populateSupplierDropdown(elementID, ncrNumber = null) {
    const supplierDropdown = document.getElementById(elementID);

    // Clear existing options to avoid duplication
    supplierDropdown.innerHTML = '';

    // Add a disabled "Select a Supplier" placeholder at the top
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select a Supplier';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    supplierDropdown.appendChild(placeholderOption);

    // Retrieve supplier and quality data from sessionStorage
    const supplier = JSON.parse(sessionStorage.getItem('supplier')) || [];
    const quality = JSON.parse(sessionStorage.getItem('quality')) || [];

    // Load or initialize stored suppliers with a Set to avoid duplicates
    let storedSuppliers = new Set(JSON.parse(sessionStorage.getItem('suppliers')) || []);
    if (storedSuppliers.size === 0) {
        supplier.forEach(item => storedSuppliers.add(item.supplierName));
        sessionStorage.setItem('suppliers', JSON.stringify([...storedSuppliers])); // Save to session storage
    }

    // If `ncrNumber` is provided, retrieve the previously selected supplier
    const selectedSupplier = ncrNumber ? quality.find(item => item.ncrNumber === ncrNumber)?.supplierName : null;

    // Count occurrences and sort suppliers based on frequency in 'quality'
    const supplierCounts = quality.reduce((counts, item) => {
        counts[item.supplierName] = (counts[item.supplierName] || 0) + 1;
        return counts;
    }, {});
    const sortedSuppliers = Object.keys(supplierCounts).sort((a, b) => supplierCounts[b] - supplierCounts[a]);

    // Group suppliers: top 3 most frequent and all others
    const topSuppliers = sortedSuppliers.slice(0, 3);
    const allSuppliers = [...new Set([...sortedSuppliers.slice(3), ...storedSuppliers])].sort();

    // Helper function to create option groups
    const createOptionGroup = (label, suppliers) => {
        const group = document.createElement('optgroup');
        group.label = label;
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier;
            option.textContent = supplier;
            group.appendChild(option);
        });
        return group;
    };

    // Populate dropdown with grouped suppliers
    supplierDropdown.appendChild(createOptionGroup('Popular Suppliers', topSuppliers));
    supplierDropdown.appendChild(createOptionGroup('All Suppliers', allSuppliers));

    // Add "Other supplier" option for custom entries only if no custom selection exists
    if (selectedSupplier !== 'custom') {
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = 'Other supplier...';
        supplierDropdown.appendChild(customOption);
    }

    // Set dropdown to the selected supplier if it exists
    if (selectedSupplier && selectedSupplier !== 'custom') {
        supplierDropdown.value = selectedSupplier;
    }

    // Handle custom supplier input and saving selected supplier
    supplierDropdown.addEventListener('change', function(event) {
        const supplierName = event.target.value;
        if (supplierName === 'custom') {
            const customSupplier = prompt('Please enter your supplier name:');
            if (customSupplier && !storedSuppliers.has(customSupplier)) {
                // Add new custom supplier to stored suppliers
                storedSuppliers.add(customSupplier);
                sessionStorage.setItem('suppliers', JSON.stringify([...storedSuppliers])); // Save updated list

                // Refresh dropdown with the updated list
                populateSupplierDropdown(elementID, ncrNumber);

                // Set the dropdown to the new supplier
                supplierDropdown.value = customSupplier;
                sessionStorage.setItem('selectedSupplier', customSupplier); // Save new selection
            }
        } else {
            sessionStorage.setItem('selectedSupplier', supplierName); // Save selected supplier
        }
    });
}


function populateSupplierDropdownN(elementID) {
    const supplierDropdown = document.getElementById(elementID);

    // Retrieve supplier and quality data from sessionStorage
    const supplier = JSON.parse(sessionStorage.getItem('supplier')) || [];
    const quality = JSON.parse(sessionStorage.getItem('quality')) || [];

    // Load or initialize stored suppliers
    let storedSuppliers = JSON.parse(sessionStorage.getItem('suppliers')) || [];
    if (storedSuppliers.length === 0) {
        supplier.forEach(item => storedSuppliers.push(item.supplierName));
        sessionStorage.setItem('suppliers', JSON.stringify(storedSuppliers)); // Save to session storage
    }

    // If `ncrNumber` is provided, retrieve the previously selected supplier
    //const selectedSupplier = ncrNumber ? quality.find(item => item.ncrNumber === ncrNumber)?.supplierName : null;

    // Count occurrences and sort suppliers based on frequency in 'quality'
    const supplierCounts = quality.reduce((counts, item) => {
        counts[item.supplierName] = (counts[item.supplierName] || 0) + 1;
        return counts;
    }, {});
    const sortedSuppliers = Object.keys(supplierCounts).sort((a, b) => supplierCounts[b] - supplierCounts[a]);

    // Group suppliers: top 3 most frequent and all others
    const topSuppliers = sortedSuppliers.slice(0, 3);
    const allSuppliers = [...new Set([...sortedSuppliers.slice(3), ...storedSuppliers])].sort();

    // Helper function to create option groups
    const createOptionGroup = (label, suppliers) => {
        const group = document.createElement('optgroup');
        group.label = label;
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier;
            option.textContent = supplier;
            group.appendChild(option);
        });
        return group;
    };
     // Populate dropdown
    //supplierDropdown.innerHTML = ''; // Clear existing options
    supplierDropdown.appendChild(createOptionGroup('Popular Suppliers', topSuppliers));
    supplierDropdown.appendChild(createOptionGroup('All Suppliers', allSuppliers));
}

//================================================================================================================
///FUNCTIONS FOR IMAGE UPLOADS
//
//=================================================================================================================

// Function to display a thumbnail and add delete functionality
function displayThumbnail(fileObject) {
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');
 
    // Create elements for each thumbnail and delete button
    const fileItem = document.createElement('div');
    fileItem.classList.add('file-item');
 
    const thumbnailImage = document.createElement('img');
    thumbnailImage.src = fileObject.thumbnail;
    thumbnailImage.classList.add('thumbnail');
 
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
 
    // Delete function removes the file item from both array and display
    deleteButton.addEventListener('click', () => {
        deleteFile(fileObject, fileItem);
    });
 
    // Append elements to the file item
    fileItem.appendChild(thumbnailImage);
    fileItem.appendChild(deleteButton);
 
    // Append file item to thumbnails container
    thumbnailsContainer.appendChild(fileItem);
    document.getElementById('fileNames').innerHTML = "";
 }
 
 // Function to delete an uploaded file
 function deleteFile(fileObject, fileItem) {
    // Remove fileObject from uploadedFiles array
    uploadedFiles.splice(uploadedFiles.indexOf(fileObject), 1);
 
    // Remove the file item from the display
    fileItem.remove();
 }
 
 // Use the modified event listener for new file uploads
 document.getElementById('attachedDocument').addEventListener('change', function () {
    const fileInput = document.getElementById('attachedDocument');
    const files = Array.from(fileInput.files);
    const validExtensions = ['image/jpeg', 'image/png', 'image/gif'];
    let validFiles = [];
    let invalidFiles = [];
 
    files.forEach(file => {
        if (validExtensions.includes(file.type)) {
            validFiles.push(file);
        } else {
            invalidFiles.push(file.name);
        }
    });
 
    if (invalidFiles.length > 0) {
        alert(`These files are not allowed: ${invalidFiles.join(', ')}. Please upload only images.`);
        fileInput.value = '';
        return;
    }
 
    // Process and display new valid files
    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageData = event.target.result;
            const img = new Image();
            img.src = imageData;
            img.onload = () => {
                const thumbnailData = compressImage(img, 200, 200);
 
                const fileObject = { file, thumbnail: thumbnailData };
                uploadedFiles.push(fileObject);
 
                // Display the new thumbnail
                displayThumbnail(fileObject);
                
            };
        };
        reader.readAsDataURL(file);
    });
 
    // Clear the file input for potential future uploads
    fileInput.value = '';
 });
 
 // Function to compress the image and return thumbnail data
 function compressImage(img, width, height) {
     const canvas = document.createElement('canvas');
     const ctx = canvas.getContext('2d');
     canvas.width = width;
     canvas.height = height;
 
     // Draw the image scaled to fit the thumbnail dimensions
     ctx.drawImage(img, 0, 0, width, height);
 
     // Return the thumbnail data URL (compressed as JPEG, adjust quality as needed)
     return canvas.toDataURL('image/jpeg', 0.6); // 0.7 is a good balance of quality and size
 }
 

 //==========================================================================================================================
//ENGINEER
//
//==============================================================================================================================
 



//================================================================================================================
//POPULATE RECENT NCRs FOR ENGINEER
//
//=================================================================================================================
function recentEngNCRs() {
    console.log(engineering);
    if (!engineering.length) {
        console.warn('No engineering data available to display.');
        return;
    }

    const recentNCRss = [...engineering].reverse(); // Clone and reverse to avoid mutating the original array
    const recentN = recentNCRss.slice(0, 5);

    console.log(recentN);
    console.log(recentNCRss);

    const tableBody = document.getElementById("indexTableContentEng");
    if (!tableBody) {
        console.warn('Table body element not found.');
        return;
    }
    tableBody.innerHTML = ''; // Clear previous results

    recentN.forEach(result => {
        //const editButtonDisabled = result.ncrStatus !== "Quality" ? "disabled" : "";
        const newRow = `<tr>
                             <td>${result.ncrNumber}</td>
                             <td>${result.itemDescription}</td>
                             <td>${formatDate(result.dateReceived)}</td>
                             <td>${result.ncrStatus}</td>
                              <td>
                                <div>
                                    <button onclick="detailsEntry('${result.ncrNumber}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        </svg>
                                        View
                                    </button>
                                    <button onclick="editEntryTrial('${result.ncrNumber}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                        </svg>
                                        Edit
                                    </button>
                                </div>
                            </td>
                         </tr>`;
        tableBody.innerHTML += newRow;
    });
}

//================================================================================================================
//POPULATE NCR DETAILS FROM QUALITY FOR ENGINEER
//
//=================================================================================================================
function populateDetailsPageEng(ncrNumber) {
    const entry = quality.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        document.getElementById('ncrNumberE').textContent = entry.ncrNumber ?? "";
        document.getElementById('dateCreatedE').textContent = formatDate(entry.dateCreated) ?? "";
        document.getElementById('createdByE').textContent = entry.createdBy ?? "";
        document.getElementById('ncrStatusE').textContent = entry.ncrStatus ?? "Quality";
        document.getElementById('applicableProcessE').textContent = entry.applicableProcess ?? "";
        document.getElementById('supplierNameDE').textContent = entry.supplierName ?? "";

        // Use nullish coalescing to handle missing or undefined values
        document.getElementById('poNumberE').textContent = entry.poNumber ?? "";
        document.getElementById('soNumberE').textContent = entry.soNumber ?? "";
        document.getElementById('quantityReceivedE').textContent = entry.quantityReceived ?? "";
        document.getElementById('quantityDefectE').textContent = entry.quantityDefect ?? "";
        document.getElementById('itemDescriptionE').innerHTML = entry.itemDescription.replace(/\n/g, '<br/>') ?? "";
        document.getElementById('defectDescriptionE').innerHTML = entry.defectDescription.replace(/\n/g, '<br/>') ?? "";

        // Assuming engineering is related to defect description, corrected as `engNeeded`
        document.getElementById('engNeededE').textContent = entry.engNeeded ?? "No";

        document.getElementById('itemConformE').textContent = entry.itemConform ?? "No";

        const documentFilesList = document.getElementById('attachedDocumentE');
        documentFilesList.innerHTML = ''; // Clear any existing content

        if (entry.documentFiles.length > 0) {
            entry.documentFiles.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file; // Just display the file name
                documentFilesList.appendChild(li);
            });
        } else { documentFilesList.innerHTML = 'No uploaded files.' }
    }
}

//================================================================================================================
///POPULATE DETAILS PAGE OF ENGINEER'S PORTION OF NCR
//
//=================================================================================================================
function populateEngDetailsPage(ncrNumber) {
    const entry = engineering.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        document.getElementById('ncrNumberEng').textContent = entry.ncrNumber;
        document.getElementById('reviewByCfEngineering').textContent = entry.reviewByCfEngineering ?? "";
        document.getElementById('customerNotification').textContent = entry.customerNotification ?? "";
        document.getElementById('disposition').innerHTML = entry.disposition.replace(/\n/g, '<br/>') ?? "";
        document.getElementById('drawingUpdate').textContent = entry.drawingUpdate ?? "";
        document.getElementById('originalEngineerName').textContent = entry.originalEngineerName ?? "";
        document.getElementById('originalRevNumber').textContent = entry.originalRevNumber ?? "";
        document.getElementById('updatedRevNumber').textContent = entry.updatedRevNumber ?? "";
        document.getElementById('revisionDate').textContent = entry.revisionDate ? formatDate(entry.revisionDate) : "";
        document.getElementById('engineerName').textContent = entry.engineerName ?? "";
    }
}

//================================================================================================================
//POPULATE EDIT PAGE OF ENGINEER'S PORTION OF NCR
//
//=================================================================================================================
function populateEngEditPage(ncrNumber) {
    //document.getElementById('createEditNCR').innerHTML = 'Edit NCR';
    //document.getElementById('create-edit')
    const entry = engineering.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        document.getElementById('ncrNumberEng').textContent = entry.ncrNumber;
        document.getElementById('reviewByCfEngineering').value = entry.reviewByCfEngineering;
        document.getElementById('customerNotification').value = entry.customerNotification;
        document.getElementById('disposition').textContent = entry.disposition;
        document.getElementById('drawingUpdate').value = entry.drawingUpdate;

        if (entry.drawingUpdate === "Yes") {

            document.getElementById('originalEngineerName').value = entry.originalEngineerName;
            document.getElementById('originalRevNumber').value = entry.originalRevNumber;
            document.getElementById('updatedRevNumber').value = entry.updatedRevNumber;
            document.getElementById('revisionDate').value = entry.revisionDate ? formatDate(entry.revisionDate) : "";

        } else {
            document.getElementById('revisionDate').value = '';
            document.getElementById('originalEngineerName').value = '';
            document.getElementById('originalRevNumber').value = '';
            document.getElementById('updatedRevNumber').value = '';
        }
    }
    console.log(entry);
}

//================================================================================================================
//EVENT LISTENER FOR YES/NO TO UPDATE DRAWINGS - ENGINEER
//
//=================================================================================================================
let prevOriginalRevNumber = "";
let prevOriginalEngineerName = "";
let prevUpdatedRevNumber = "";
let prevRevisionDate = "";

// Event listener for drawingUpdate
document.getElementById('drawingUpdate').addEventListener('change', (event) => {
    const drawingUpdate = event.target.value;

    if (drawingUpdate === "No") {
        // Store the current values before clearing them
        prevOriginalRevNumber = document.getElementById('originalRevNumber').value;
        prevOriginalEngineerName = document.getElementById('originalEngineerName').value;
        prevUpdatedRevNumber = document.getElementById('updatedRevNumber').value;
        prevRevisionDate = document.getElementById('revisionDate').value;

        // Clear the fields
        document.getElementById('originalRevNumber').value = "";
        document.getElementById('originalEngineerName').value = "";
        document.getElementById('updatedRevNumber').value = "";
        document.getElementById('revisionDate').value = "";
    } else if (drawingUpdate === "Yes") {
        // Restore previous values if "Yes" is selected
        document.getElementById('originalRevNumber').value = prevOriginalRevNumber;
        document.getElementById('originalEngineerName').value = prevOriginalEngineerName;
        document.getElementById('updatedRevNumber').value = prevUpdatedRevNumber;
        document.getElementById('revisionDate').value = prevRevisionDate;
    }
});

//================================================================================================================
//SAVE ENGINEER'S PORTION OF NCR
//
//=================================================================================================================
function saveEngNCR() {
    const ncrNumber = document.getElementById('ncrNumberEng').textContent;
    const changedBy = getUserName();
    const reviewByCfEngineering = document.getElementById('reviewByCfEngineering').value;
    const customerNotification = document.getElementById('customerNotification').value;
    const disposition = document.getElementById('disposition').value;
    const drawingUpdate = document.getElementById('drawingUpdate').value;
    const originalRevNumber = document.getElementById('originalRevNumber').value;
    const originalEngineerName = document.getElementById('originalEngineerName').value;
    const updatedRevNumber = document.getElementById('updatedRevNumber').value;
    
    // Only set revisionDate if updatedRevNumber has a value
    const revisionDate = updatedRevNumber ? Timestamp() : "";

    const engineeringEntry = engineering.find(entry => entry.ncrNumber === ncrNumber);

    if (engineeringEntry) {
        // Check for changes in all relevant fields
        const noChanges = (
            engineeringEntry.reviewByCfEngineering === reviewByCfEngineering &&
            engineeringEntry.customerNotification === customerNotification &&
            engineeringEntry.disposition === disposition &&
            engineeringEntry.drawingUpdate === drawingUpdate &&
            engineeringEntry.originalRevNumber === originalRevNumber &&
            engineeringEntry.updatedRevNumber === updatedRevNumber 
            //still need more info about revision (ask Mark in class)
            //&&
            //engineeringEntry.revisionDate === revisionDate
        );

        if (noChanges) {
            alert('No changes were made.');
            return;
        }

        const confirmation = confirm("Are you sure you want to save the NCR?");
        if (confirmation) {
            engineeringEntry.reviewByCfEngineering = reviewByCfEngineering;
            engineeringEntry.customerNotification = customerNotification;
            engineeringEntry.disposition = disposition;
            engineeringEntry.drawingUpdate = drawingUpdate;

            if (drawingUpdate === "Yes") {
                engineeringEntry.originalRevNumber = originalRevNumber;
                engineeringEntry.originalEngineerName = originalEngineerName;
                engineeringEntry.updatedRevNumber = updatedRevNumber;

                // Only set the revision date if updatedRevNumber has a value
                engineeringEntry.revisionDate = revisionDate;
            } else {
                engineeringEntry.originalRevNumber = "";
                engineeringEntry.originalEngineerName = "";
                engineeringEntry.updatedRevNumber = "";
                engineeringEntry.revisionDate = "";
            }
            sessionStorage.setItem('engineering', JSON.stringify(engineering));

            const historyEntry = {
                ncrNumber: ncrNumber,
                actionType: "Edit",
                status: 'Open',
                actionDescription: "Edited the NCR by Engineering",
                changedBy: changedBy,
                changedOn: Timestamp()
            };

            history.push(historyEntry);
            sessionStorage.setItem('history', JSON.stringify(history));

            alert('Your changes have been saved. You can continue later.');
            window.history.back();
        } else {
            alert("Save operation cancelled.");
        }
    } else {
        alert('NCR not found. Please check the NCR number.');
    }
    console.log(engineering);
}

//================================================================================================================
//SUBMIT ENGINEER'S PORTION OF NCR
//
//=================================================================================================================
function submitEngNCR() {
    //const ncrNumber = document.getElementById('ncrNumber').textContent;

    //changedBy = getUserName();

    const ncrNumber = document.getElementById('ncrNumberEng').textContent;
    const changedBy = getUserName();
    const reviewByCfEngineering = document.getElementById('reviewByCfEngineering').value;
    const customerNotification = document.getElementById('customerNotification').value;
    const disposition = document.getElementById('disposition').value;
    const drawingUpdate = document.getElementById('drawingUpdate').value;
    const originalRevNumber = document.getElementById('originalRevNumber').value;
    const originalEngineerName = document.getElementById('originalEngineerName').value;
    const updatedRevNumber = document.getElementById('updatedRevNumber').value;

    // Check if all required fields are filled
    if (!reviewByCfEngineering || !disposition) {
        alert('Please fill out all the required fields before submitting.');
        return;
    }

    /*if ((drawingUpdate === "Yes") && (!originalRevNumber || updatedRevNumber)) {
        alert('Please provide Original Revision Number and Updated Revision Number')
        return;
    }*/

    const confirmation = confirm("Are you sure you want to submit the NCR?");
    if (confirmation) {
        // Update the corresponding NCR in the quality array
        const engineeringEntry = engineering.find(entry => entry.ncrNumber === ncrNumber);

        if (engineeringEntry) {
            engineeringEntry.reviewByCfEngineering = reviewByCfEngineering;
            engineeringEntry.customerNotification = customerNotification;
            engineeringEntry.disposition = disposition;
            engineeringEntry.drawingUpdate = drawingUpdate;
            engineeringEntry.ncrStatus = "Operations";
            engineeringEntry.engineerName = changedBy;

            if (drawingUpdate === "Yes") {
                engineeringEntry.originalRevNumber = originalRevNumber;
                engineeringEntry.originalEngineerName = originalEngineerName;
                engineeringEntry.updatedRevNumber = updatedRevNumber;

                // Only set the revision date if updatedRevNumber has a value
                //engineeringEntry.revisionDate = revisionDate;
            } else {
                engineeringEntry.originalRevNumber = "";
                engineeringEntry.originalEngineerName = "";
                engineeringEntry.updatedRevNumber = "";
                engineeringEntry.revisionDate = "";
            }
            sessionStorage.setItem('engineering', JSON.stringify(engineering));
            //make history array and push to history json
            const historyEntry = {
                ncrNumber: ncrNumber,
                actionType: "Submit",
                status: 'Open',
                actionDescription: "Submission by Engineering",
                changedBy: changedBy,
                changedOn: Timestamp()
            }
            history.push(historyEntry);
            sessionStorage.setItem('history', JSON.stringify(history));
            alert('NCR has been successfully submitted.');
            window.history.back();
        }

    } else {
        // If the user cancels, do nothing or add custom logic
        alert("Submit operation cancelled.");
        // Redirect or perform other actions as needed
        return;
    }
}

//FUNCTION TO CHANGE NAVIGATION LINKS BASED ON USER
function updateNavLinks(userRole) {
    const homeLink = document.getElementById('home');
    const createLink = document.getElementById('create');
    const viewLink = document.getElementById('view');
    const reportsLink = document.getElementById('reports');

    // Hide link if the user is not an admin
    if (userRole == "Quality") {
        homeLink.style.display = 'block';
        createLink.style.display = 'block';
        viewLink.style.display = 'block';
        reportsLink.style.display = 'block';
    }
    else if(userRole == "Engineer"){
        homeLink.style.display = 'block';
        createLink.style.display = 'none';
        viewLink.style.display = 'block';
        reportsLink.style.display = 'block';
    }
}
