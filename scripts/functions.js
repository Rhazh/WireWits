// =======================================================================
// FUNCTIONS SUPPORTING THE MAIN.JS
// These must load first and are placed first when referencing in html
// =======================================================================

//FUNCTIONS USED ON DASHBOARD/HOME PAGE

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

    dropdownDesc.innerHTML = "<p>Pending NCRs for Over 14 Days</p>"; // Text explaining urgency

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
    fourteenDaysAgo.setDate(today.getDate() - 14);

    return quality.filter(item => new Date(item.dateCreated) < fourteenDaysAgo && item.ncrStatus == "Quality")
        .map(item => item.ncrNumber);
}

// Close dropdown if clicked outside (Notification)
document.addEventListener('click', function(event) {
    const notifDisplay = document.getElementById('notifDisplay');
    const btnNotification = document.getElementById('btnNotification');

    // Check if the click was outside the notification display and the button
    if (!notifDisplay.contains(event.target) && 
        !btnNotification.contains(event.target)) {
        notifDisplay.style.display = 'none'; // Hide the dropdown
    }
});

// Close dropdown if clicked outside (Profile)
document.addEventListener('click', function(event) {
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

    const tableBody = document.getElementById("tablecontent");
    if (!tableBody) {
        console.warn('Table body element not found.');
        return;
    }
    tableBody.innerHTML = ''; // Clear previous results

    recentN.forEach(result => {
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
                                    <button onclick="editEntry('${result.ncrNumber}')">
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
        document.getElementById('ncrStatus').textContent = entry.ncrStatus ?? "";
        document.getElementById('applicableProcess').textContent = entry.applicableProcess ?? "";
        document.getElementById('supplierName').textContent = entry.supplierName ?? "";

        // Use nullish coalescing to handle missing or undefined values
        document.getElementById('poNumber').textContent = entry.poNumber ?? "";
        document.getElementById('soNumber').textContent = entry.soNumber ?? "";
        document.getElementById('quantityReceived').textContent = entry.quantityReceived ?? "";
        document.getElementById('quantityDefect').textContent = entry.quantityDefective ?? "";
        document.getElementById('itemDescription').textContent = entry.itemDescription ?? "";
        document.getElementById('defectDescription').textContent = entry.defectDescription ?? "";
        
        // Assuming engineering is related to defect description, corrected as `engNeeded`
        document.getElementById('engNeeded').textContent = entry.engNeeded ?? "No";

        document.getElementById('itemConform').textContent = entry.itemConform ?? "No";

        // Call to populate document files if they exist
        if (entry.documentFiles) {
            populateDocumentFiles(entry.documentFiles);
        }
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
        document.getElementById('poNumber').value = entry.poNumber? entry.poNumber : '';
        document.getElementById('soNumber').value = entry.soNumber? entry.soNumber : '';
        document.getElementById('quantityReceived').value = entry.quantityReceived;
        document.getElementById('quantityDefect').value = entry.quantityDefective;
        document.getElementById('itemDescription').value = entry.itemDescription? entry.itemDescription : '';
        document.getElementById('defectDescription').value = entry.defectDescription? entry.defectDescription : '';
        document.getElementById('engNeeded').checked = entry.engNeeded === 'Yes';
        document.getElementById('itemConform').checked = entry.itemConform === 'Yes';
    }
    document.getElementById('createNCRModal').style.visibility = 'hidden'; // Hide the modal
    document.getElementById('create-edit-NCR').style.visibility = 'visible'; // Show the edit section
}

// Supporting Function - Redirection to Edit an NCR when Edit button is clicked
function editEntry(ncrNumber) {
    window.location.href = `create.html?ncr=${ncrNumber}`; // Redirect to edit page
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

    const resultsCountMessage = document.getElementById('no-results-message');

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        resultsCountMessage.textContent = 'Start date must be earlier than or equal to end date.';
        resultsCountMessage.style.display = 'inline';
        return;
    }

    const viewNCRs = quality.filter(item => {
        const isNcrNumberValid = ncrNumber ? item.ncrNumber.includes(ncrNumber) : true;
        const isSupplierNameValid = supplierName ? item.supplierName === supplierName : true;
        const isStatusValid = ncrStatus ? item.ncrStatus === ncrStatus : true;

        const itemDateCreated = new Date(item.dateCreated);
        const isDateCreatedValid = (
            (fromDate ? itemDateCreated >= new Date(fromDate) : true) &&
            (toDate ? itemDateCreated <= new Date(toDate) : true)
        );

        return isNcrNumberValid && isSupplierNameValid && isStatusValid && isDateCreatedValid;
    });

    const tableBody = document.getElementById("tablecontent");
    if (!tableBody) {
        console.warn('Table body element not found.');
        return;
    }
    tableBody.innerHTML = '';

    viewNCRs.reverse().forEach(result => {
        const newRow = `<tr>
                            <td>${result.ncrNumber}</td>
                            <td>${result.supplierName}</td>
                            <td>${formatDate(result.dateCreated)}</td>
                            <td>${result.ncrStatus}</td>
                            <td>
                                <div style="display: grid; gap: 10px; grid-template-columns: 1fr 1fr">
                                    <button onclick="detailsEntry('${result.ncrNumber}')">View</button>
                                    <button onclick="editEntry('${result.ncrNumber}')">Edit</button>
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

    // Get form values
    const applicableProcess = document.getElementById('napplicableProcess')?.value;
    const supplierName = document.getElementById('nsupplierName')?.value;

    if(applicableProcess == "" || supplierName == ""){
        alert("Please select both Applicable Process and Supplier")
        return;
    }

    // Generate NCR Number and Timestamp
    const ncrNumber = NCRNumberGenerator();
    const dateCreated = Timestamp();

    // Creating NCR log entry
    const ncrLogEntry = {
        ncrNumber: ncrNumber,
        dateCreated: dateCreated,
        createdBy: "Test User",  // Replace with actual user data if available
        supplierName: supplierName,
        applicableProcess: applicableProcess,
        status: "Active",
        dateClosed: "",  // Blank initially
        closedBy: ""     // Blank initially
    };

    console.log("New NCR Log Entry:", ncrLogEntry);

    // Add the entry to the ncrLog array
    ncrLog.push(ncrLogEntry);

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
        defectDescription: [],  // Empty for now
        documentFiles: [],  // Empty for now
        ncrStatus: "Quality"   
    };

    // Add the entry to the quality array
    quality.push(qualityEntry);
    console.log("Updated Quality Array:", quality);

    // Persist ncrLog and quality to sessionStorage
    sessionStorage.setItem('ncrLog', JSON.stringify(ncrLog));
    sessionStorage.setItem('quality', JSON.stringify(quality));

    // Display the newly created NCR data in the UI
    document.getElementById('createNCRModal').style.visibility = 'hidden';
    document.getElementById('create-edit-modal').style.visibility = 'visible';

    // Dynamically update elements with the new NCR data
    
    console.log("Persisted NCR Log:", ncrLog);
    console.log("Persisted Quality:", quality);
    console.log(quality);
    //populateEditPage(qualityEntry.ncrNumber)

   
    const entry = quality.find(item => item.ncrNumber === ncrLogEntry.ncrNumber);
    if (entry) {
        document.getElementById('ncrNumber').textContent = entry.ncrNumber;
        document.getElementById('dateCreated').textContent = formatDate(entry.dateCreated);
        document.getElementById('createdBy').textContent = entry.createdBy;
        document.getElementById('ncrStatus').textContent = entry.ncrStatus;
        document.getElementById('applicableProcess').value = entry.applicableProcess;
        document.getElementById('supplierName').value = entry.supplierName;
        document.getElementById('poNumber').value = entry.poNumber? entry.poNumber : '';
        document.getElementById('soNumber').value = entry.soNumber? entry.soNumber : '';
        document.getElementById('quantityReceived').value = entry.quantityReceived;
        document.getElementById('quantityDefect').value = entry.quantityDefective;
        document.getElementById('itemDescription').value = entry.itemDescription? entry.itemDescription : '';
        document.getElementById('defectDescription').value = entry.defectDescription? entry.defectDescription : '';
        document.getElementById('engNeeded').checked = entry.engNeeded === 'Yes';
        document.getElementById('itemConform').checked = entry.itemConform === 'Yes';
    }
    console.log("check", quality)
    document.getElementById('createNCRModal').style.visibility = 'hidden'; // Hide the modal
    document.getElementById('create-edit-NCR').style.visibility = 'visible'; // Show the edit section

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
function saveNCR() {
    const ncrNumber = document.getElementById('ncrNumber').textContent;
    
    // Collect current form values
    const poNumber = document.getElementById('poNumber')?.value || '';
    const soNumber = document.getElementById('soNumber')?.value || '';
    const quantityReceived = document.getElementById('quantityReceived')?.value || '';
    const quantityDefect = document.getElementById('quantityDefect')?.value || '';
    const engNeeded = document.getElementById('engNeeded')?.checked || 'No';
    const itemConform = document.getElementById('itemConform')?.checked || 'No';
    const itemDescription = document.getElementById('itemDescription')?.value || '';
    const defectDescription = document.getElementById('defectDescription')?.value || '';
    
    if(Number(quantityDefect) > Number(quantityReceived)){
        alert('The number of defects cannot exceed the quantity received.')
        return;
    }
    // Update the corresponding NCR in the quality array
    const qualityEntry = quality.find(entry => entry.ncrNumber === ncrNumber);

    if (qualityEntry) {
        qualityEntry.poNumber = poNumber;
        qualityEntry.soNumber = soNumber;
        qualityEntry.quantityReceived = quantityReceived;
        qualityEntry.quantityDefect = quantityDefect;
        qualityEntry.engNeeded = engNeeded;
        qualityEntry.itemConform = itemConform;
        qualityEntry.itemDescription = itemDescription;
        qualityEntry.defectDescription = defectDescription;

        // Persist updated quality array to sessionStorage
        sessionStorage.setItem('quality', JSON.stringify(quality));

        alert('Your changes have been saved. You can continue later.');
    }
}

// ===================================================================
// 8. Function to Submit the NCR (all required fields must be filled)
// ===================================================================
function submitNCR() {
    const ncrNumber = document.getElementById('ncrNumber').textContent;
    
    // Collect current form values
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

    if(Number(quantityDefect) > Number(quantityReceived)){
        alert('The number of defects cannot exceed the quantity received.')
        return;}

    // Update the corresponding NCR in the quality array
    const qualityEntry = quality.find(entry => entry.ncrNumber === ncrNumber);

    if (qualityEntry) {

        const engNeededCheckbox = document.getElementById('engNeeded');

        qualityEntry.poNumber = poNumber;
        qualityEntry.soNumber = soNumber;
        qualityEntry.quantityReceived = quantityReceived;
        qualityEntry.quantityDefect = quantityDefect;
        qualityEntry.engNeeded = engNeeded;
        qualityEntry.itemConform = itemConform;
        qualityEntry.itemDescription = itemDescription;
        qualityEntry.defectDescription = defectDescription;
        
        // Mark the NCR as submitted
        qualityEntry.ncrStatus = engNeededCheckbox.checked ? "Engineering" : "Operations";
        
        // Persist updated quality array to sessionStorage
        sessionStorage.setItem('quality', JSON.stringify(quality));
        
        alert('NCR has been successfully submitted. You can provide more information now or continue later.');
        // Redirect or perform other actions as needed
        window.location.href = 'index.html';
    }
}

// ===================================================================
// 9. Function to Populate the Reports
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
    populateReports(); // Call the function to fetch and display data
    fetchNCRRecords();
});

async function populateReports() {
    try {
        const response = await fetch('seed-data/History.json'); // Update with your correct path
        if (!response.ok) throw new Error('Network response was not ok');
        const historyData = await response.json();
        const filteredData = filterHistoryData(historyData);
        displayReports(filteredData);
    } catch (error) {
        console.error('Error fetching history data:', error);
    }
}

function filterHistoryData(historyData) {
    const ncrNumber = document.getElementById('ncrNumber')?.value.trim();
    const ncrStatus = document.getElementById('ncrStatus')?.value;
    const fromDate = document.getElementById('fromDate')?.value;
    const toDate = document.getElementById('toDate')?.value;

    const filteredData = historyData.filter(item => {
        const isNcrNumberValid = ncrNumber ? item.NCR_Number.includes(ncrNumber) : true;
        const isStatusValid = ncrStatus && ncrStatus !== 'All' ? item.Status === ncrStatus : true;

        const itemChangedOn = new Date(item.Changed_On);
        const isDateValid = (
            (fromDate ? itemChangedOn >= new Date(fromDate) : true) &&
            (toDate ? itemChangedOn <= new Date(toDate) : true)
        );

        return isNcrNumberValid && isStatusValid && isDateValid;
    });

    return filteredData;
}

function displayReports(filteredData) {
    const tableBody = document.getElementById("reportsTableContent");
    if (!tableBody) {
        console.warn('Table body element not found.');
        return;
    }
    tableBody.innerHTML = ''; // Clear previous results

    if (filteredData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5'>No reports available for this NCR number.</td></tr>";
        return;
    }

    filteredData.forEach(report => {
        const newRow = `<tr>
                            <td>${formatDate(report.Changed_On)}</td>
                            <td>${report.Action_Type}</td>
                            <td>${report.Status}</td>
                            <td>${report.Action_Description}</td>
                            <td>${report.Changed_By}</td>
                        </tr>`;
        tableBody.innerHTML += newRow;
    });
}

// Function to fetch the JSON data and populate the table
async function fetchNCRData() {
    try {
        const response = await fetch('seed-data/Quality.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Filter records for the selected NCR Number
        const filteredRecords = data.filter(record => record.ncrNumber === ncrNumber);
        populateNCRRecordsTable(filteredRecords);
        populateNCRTable(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Function to populate the table with fetched data
function populateNCRTable(data) {
    const tableBody = document.getElementById("tablecontent");
    tableBody.innerHTML = ''; // Clear existing content

    data.forEach(item => {
        const newRow = `<tr>
                            <td>${item.ncrNumber}</td>
                            <td>${item.createdBy}</td>
                            <td>${formatDate(item.dateCreated)}</td>
                            <td>${item.ncrStatus}</td>
                            <td>${item.lastUpdated || 'N/A'}</td> <!-- Assuming lastUpdated is part of the data -->
                            <td>
                                <button onclick="viewNCR('${item.ncrNumber}')">View</button>
                            </td>
                        </tr>`;
        tableBody.innerHTML += newRow;
    });
}

// Function to populate the Available Records table
function populateNCRRecordsTable(records) {
    const recordsTableBody = document.getElementById("reportsTableContent");
    recordsTableBody.innerHTML = ''; // Clear existing content

    records.forEach(record => {
        const newRow = `<tr>
                            <td>${formatDate(record.dateCreated)}</td>
                            <td>${record.actionType || 'N/A'}</td>
                            <td>${record.ncrStatus}</td>
                            <td>${record.actionDescription || 'N/A'}</td>
                            <td>${record.changedBy || 'N/A'}</td>
                        </tr>`;
        recordsTableBody.innerHTML += newRow;
    });
}

let ncrRecords = []; // This should be populated in your fetch function

async function fetchNCRRecords() {
    const response = await fetch('seed-data/History.json');
    ncrRecords = await response.json(); // Store the fetched records
}

function viewNCR(ncrNumber) {
    console.log("Filtering for NCR Number:", ncrNumber); // Log the selected NCR number
    console.log("All NCR Records:", ncrRecords); // Log all available records

    // Filter records based on the selected NCR number
    const filteredRecords = ncrRecords.filter(record => record.NCR_Number === ncrNumber);
    
    console.log("Filtered Records:", filteredRecords); // Log filtered records
    
    displayAvailableRecords(filteredRecords);
}

function displayAvailableRecords(filteredRecords) {
    const availableRecordsTable = document.getElementById('reportsTableContent');
    availableRecordsTable.innerHTML = ''; // Clear previous content

    filteredRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(record.Changed_On)}</td>
            <td>${record.Action_Type}</td>
            <td>${record.Status}</td>
            <td>${record.Action_Description}</td>
            <td>${record.Changed_By}</td>
        `;
        availableRecordsTable.appendChild(row);
    });

    if (filteredRecords.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5">No records found for this NCR number.</td>`;
        availableRecordsTable.appendChild(row);
    }
}


// Call the fetch function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchNCRData();
});


