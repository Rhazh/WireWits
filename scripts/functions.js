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
    const countLabel = document.getElementById('spnCount');
    if (countLabel) {
        countLabel.textContent = `${oldNotifications.length}`; // Update count label
    } else {
        console.warn('Count label element not found.');
    }

    if (oldNotifications.length === 0) {
        dropdown.innerHTML = "<p>No urgent notifications</p>";
        return;
    }

    dropdownDesc.innerHTML = "<p>Pending NCRs for Over 30 Days</p>"; // Text explaining urgency

    oldNotifications.forEach(ncrNumber => {
        const p = document.createElement('p');
        const link = document.createElement('a');
        link.textContent = `NCR Number: ${ncrNumber}`;
        link.href = `create.html?ncr=${ncrNumber}`;
        link.style.cursor = 'pointer'; // Change cursor to pointer
        link.onclick = (e) => {
            e.preventDefault();
            editEntry(ncrNumber);
        };

        p.appendChild(link);
        dropdown.appendChild(p);
    });
}

// Supporting Function - Get Old Notifications
function getOldNotifications() {
    const today = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 30);

    return quality.filter(item => new Date(item.dateCreated) < fourteenDaysAgo && item.ncrStatus == "Quality")
        .map(item => item.ncrNumber);
}

// Close dropdown if clicked outside (Notification)
document.addEventListener('click', function (event) {
    const notifDisplay = document.getElementById('notifDisplay');
    const btnNotification = document.getElementById('btnNotification');

    // Check if the click was outside the notification display and the button
    if (!notifDisplay.contains(event.target) &&
        !btnNotification.contains(event.target)) {
        notifDisplay.style.display = 'none'; // Hide the dropdown
    }
});

// Close dropdown if clicked outside (Profile)
document.addEventListener('click', function (event) {
    const profileDisplay = document.getElementById('profileDropdown');
    const btnProfile = document.getElementById('btnProfile');

    // Check if the click was outside the notification display and the button
    if (!profileDisplay.contains(event.target) &&
        !btnProfile.contains(event.target)) {
        profileDisplay.style.display = 'none'; // Hide the dropdown
    }
});

// Supporoting functions for toggle down
function toggleDropdown() {
    const dropdown = document.getElementById('notifDisplay');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Toggle Profile Dropdown
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

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
        document.getElementById('supplierName').textContent = entry.supplierName ?? "";

        // Use nullish coalescing to handle missing or undefined values
        document.getElementById('poNumber').textContent = entry.poNumber ?? "";
        document.getElementById('soNumber').textContent = entry.soNumber ?? "";
        document.getElementById('quantityReceived').textContent = entry.quantityReceived ?? "";
        document.getElementById('quantityDefect').textContent = entry.quantityDefect ?? "";
        document.getElementById('itemDescription').textContent = entry.itemDescription ?? "";
        document.getElementById('defectDescription').innerHTML = entry.defectDescription.replace(/\n/g, '<br/>') ?? "";

        // Assuming engineering is related to defect description, corrected as `engNeeded`
        document.getElementById('engNeeded').textContent = entry.engNeeded ?? "No";

        document.getElementById('itemConform').textContent = entry.itemConform ?? "No";

        const documentFilesList = document.getElementById('attachedDocument');
        documentFilesList.innerHTML = ''; // Clear any existing content

        if (entry.documentFiles.length > 0) {
            entry.documentFiles.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file; // Just display the file name
                documentFilesList.appendChild(li);
            });
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

        /*Call to populate document files if they exist
        if (entry.documentFiles) {
            populateDocumentFiles(entry.documentFiles);
        }*/
    } else {
        console.error(`NCR with number ${ncrNumber} not found.`);
    }
}

// Supporting Function - Populate Document Files
function populateDocumentFiles(documentFiles) {
    const documentList = document.getElementById('attachedDocument');
    documentList.innerHTML = ''; // Clear existing files

    if (documentFiles && documentFiles.length > 0) {
        documentFiles.forEach(doc => {
            const listItem = document.createElement('li');
            listItem.textContent = doc; // Assuming doc is a string representing the filename
            documentList.appendChild(listItem);
        });
    } else {
        const noDocsItem = documentFiles.createElement('li');
        noDocsItem.textContent = 'No documents available.';
        documentList.appendChild(noDocsItem);
    }
}

// Supporting Function - Redirection to Details Page of NCR when View button is clicked
function detailsEntry(ncrNumber) {
    window.location.href = `details.html?ncr=${ncrNumber}`; // Redirect to edit page
    console.log(ncr);
}

//FUNCTION USED ON AN EDIT PAGE - HAPPENS AT THE CREATE PAGE

// ============================================================
// 4. Edit The Information of an NCR that has been Created
// Populate the Create Page of an NCR when a user clicks Edit
// or immediately after creationg an NCR
// ============================================================
function populateEditPage(ncrNumber) {
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
        // Handle previously uploaded files
        const fileNamesDisplay = document.getElementById('fileNames');
        if (entry.documentFiles && entry.documentFiles.length > 0) {
            // Display previously uploaded files
            fileNamesDisplay.innerHTML = `Previously Uploaded Files:<br>${entry.documentFiles.join('<br>')}`;
        } else {
            //fileNamesDisplay.textContent = 'No files uploaded yet.';
        }

        // Ensure that the global uploadedFiles array contains previously uploaded files
        uploadedFiles = [...entry.documentFiles];
    }
    document.getElementById('createNCRModal').style.visibility = 'hidden'; // Hide the modal
    document.getElementById('createEditNCR').style.visibility = 'visible'; // Show the edit section
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
function performSearch() {
    const ncrNumber = document.getElementById('ncrNumber')?.value.trim();
    const supplierName = document.getElementById('supplierName')?.value;
    const ncrStatus = document.getElementById('ncrStatus')?.value;
    const fromDate = document.getElementById('fromDate')?.value;
    const toDate = document.getElementById('toDate')?.value;

    const resultsCountMessage = document.getElementById('noResultsMessage');

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        resultsCountMessage.textContent = 'Start date must be earlier than or equal to end date.';
        resultsCountMessage.style.display = 'inline';
        return;
    } else {
        resultsCountMessage.style.display = 'none'; // Hide error if date range is valid
    }

    // Remove duplicates from quality based on ncrNumber
    const uniqueQuality = Array.from(new Map(quality.map(item => [item.ncrNumber, item])).values())
        .sort((a, b) => {
            const numA = parseInt(a.ncrNumber.split('-')[1], 10); // Extract numeric part
            const numB = parseInt(b.ncrNumber.split('-')[1], 10); // Extract numeric part
            return numA - numB; // Sort numerically
        })


    // Convert fromDate and toDate to Date objects
    const fromDateObj = fromDate ? new Date(fromDate + 'T00:00:00') : null; // Start of the day
    const toDateObj = toDate ? new Date(toDate + 'T23:59:59') : null; // End of the day

    const viewNCRs = uniqueQuality.filter(item => {
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

    const tableBody = document.getElementById("viewTableContent");
    // Check if NCR number contains any alphabetic characters
    if (ncrNumber && /[a-zA-Z]/.test(ncrNumber)) {
        resultsCountMessage.textContent = 'NCR Number must not contain alphabetic characters.';
        resultsCountMessage.style.display = 'inline';
    }
    // Show no results message if the filtered array is empty
    else if (viewNCRs.length === 0) {
        resultsCountMessage.textContent = 'No results found.';
        resultsCountMessage.style.display = 'inline';
    } else {
        resultsCountMessage.style.display = 'none';
        // Optionally, you can display the results here
        console.log(viewNCRs); // Or update the UI to show results
    }

    if (!tableBody) {
        console.warn('Table body element not found.');
        return;
    }
    tableBody.innerHTML = '';

    //const tenResults = viewNCRs.slice(0, 10);
    // Get the last 10 results if there are more than 10
    const tenResults = viewNCRs.length > 10 ? viewNCRs.slice(-10) : viewNCRs;

    tenResults.reverse().forEach(result => {
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
        history = [];  // Initialize quality if undefined
    }

    // Get form values
    const applicableProcess = document.getElementById('napplicableProcess')?.value;
    const supplierName = document.getElementById('nsupplierName')?.value;

    if (applicableProcess == "" || supplierName == "") {
        alert("Please select both Applicable Process and Supplier")
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

    // Display the newly created NCR data in the UI
    document.getElementById('createNCRModal').style.visibility = 'hidden';
    document.getElementById('createEditModal').style.visibility = 'visible';


    // Dynamically update elements with the new NCR data
    populateEditPage(qualityEntry.ncrNumber)

    alert(`NCR Number ${ncrNumber} successfully generated. You may continue to provide additional information now or later`);

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
let uploadedFiles = [];

document.getElementById('attachedDocument').addEventListener('change', function () {
    const fileInput = document.getElementById('attachedDocument');
    const fileNamesDisplay = document.getElementById('fileNames');
    const fileSummaryDisplay = document.getElementById('fileSummary');

    // Get the selected files
    const files = Array.from(fileInput.files);
    const validExtensions = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/mov'];

    let validFiles = [];
    let invalidFiles = [];

    // Check the file type for each selected file
    files.forEach(file => {
        if (validExtensions.includes(file.type)) {
            validFiles.push(file.name);
        } else {
            invalidFiles.push(file.name);
        }
    });

    // Handle invalid files
    if (invalidFiles.length > 0) {
        alert(`These files are not allowed: ${invalidFiles.join(', ')}. Please upload only images or videos.`);
        // Optionally, clear the invalid files and reset the input
        fileInput.value = ''; // Clears the file input
        return;
    }

    // Accumulate valid files
    uploadedFiles = [...uploadedFiles, ...validFiles];

    // Remove duplicates if needed (optional)
    uploadedFiles = [...new Set(uploadedFiles)];

    // Display the file names in the file-upload-details section
    if (uploadedFiles.length > 0) {
        fileSummaryDisplay.innerHTML = "Uploaded Files:"
        fileNamesDisplay.innerHTML = `${uploadedFiles.join('<br>')}`;
    } else {
        //fileNamesDisplay.textContent = 'No files uploaded yet.';
    }

    // Clear the file input so the same file can be uploaded again if needed
    fileInput.value = '';
});

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

            alert('NCR has been successfully submitted.');
            // Redirect or perform other actions as needed
            window.history.back();
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

// ===================================================================
// 9. Function to Populate the Reports
// ===================================================================

//let allRecords = []; // Global variable to hold all records
//let allReports = []; // Global variable to hold all reports

/*async function fetchReportsData() {
    try {
        const response = await fetch('seed-data/NCRLog.json'); // Update with the correct path
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        allReports = await response.json(); // Store all reports globally
        populateReportsTable(allReports);
    } catch (error) {
        console.error('Error fetching reports data:', error);
    }
}


async function fetchRecordsData() {
    try {
        const response = await fetch('seed-data/History.json'); // Update with the correct path
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        allRecords = await response.json(); // Store all records globally
        populateRecordsTable(allRecords);
    } catch (error) {
        console.error('Error fetching records data:', error);
    }
}*/

function populateReportsTable(data) {
    const tableContent = document.getElementById('tableContent');
    tableContent.innerHTML = ''; // Clear existing rows
    data.forEach(report => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${report.ncrNumber}</td>
            <td>${report.createdBy}</td>
            <td>${formatDate(report.dateCreated)}</td>
            <td>${report.status}</td>
            <td>${formatDate(report.lastUpdated)}</td>
            <td><button onclick="viewReport('${report.ncrNumber}')">View History</button></td>
        `;
        tableContent.appendChild(row);
    });
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

    // Date validation
    if (fromDateValue && toDateValue && new Date(fromDateValue) > new Date(toDateValue)) {
        const noResultsMessage = document.getElementById('noResultsMessage');
        noResultsMessage.textContent = 'Start date must be earlier than or equal to end date.';
        noResultsMessage.style.display = 'inline';
        return; // Exit the function if validation fails
    } else {
        const noResultsMessage = document.getElementById('noResultsMessage');
        noResultsMessage.style.display = 'none'; // Hide error if date range is valid
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

        // Compare years in descending order
        if (yearA !== yearB) {
            return yearB - yearA; // Sort by year descending
        }
        // Compare sequence numbers in descending order
        return seqB - seqA; // Sort by sequence number descending
    });

    // Take the first 10 results after sorting
    const tenResults = filteredReports.length > 10 ? filteredReports.slice(0, 10) : filteredReports;

    // Populate the table with filtered results
    populateReportsTable(tenResults);

    // Show or hide "no results" message
    const noResultsMessage = document.getElementById('noResultsMessage');
    // Check if NCR number contains any alphabetic characters
    if (ncrNumber && /[a-zA-Z]/.test(ncrNumber)) {
        noResultsMessage.textContent = 'NCR Number must not contain alphabetic characters.';
        noResultsMessage.style.display = 'inline';
    }
    else if (filteredReports.length === 0) {
        noResultsMessage.textContent = 'No results found.';
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
    }
}


function clearSearch() {
    /*
    // Clear search inputs
    document.getElementById('ncrNumber').value = '';
    document.getElementById('ncrStatus').value = 'All';
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';

    // Reset the table to show all reports
    populateReportsTable(allReports);

    // Hide "no results" message
    document.getElementById('no-results-message').style.display = 'none';
    */
    location.reload();
}

/*
document.addEventListener('DOMContentLoaded', () => {
    fetchReportsData();
    fetchRecordsData();
    document.querySelector('#reportTable').style.display = 'none';
});*/

document.addEventListener('DOMContentLoaded', function () {
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
});


