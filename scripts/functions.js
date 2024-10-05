//FUNCTIONS

//1. Populate Notifications - For all pages
function populateNotifications() {
    const dropdown = document.getElementById('dropdown-menu');
    dropdown.innerHTML = ""; // Clear existing notifications

    const oldNotifications = getOldNotifications();
    const countLabel = document.getElementById('spnCount');
    countLabel.textContent = `${oldNotifications.length}`; // Update count label

    if (oldNotifications.length === 0) {
        dropdown.innerHTML = "<p>No urgent notifications</p>";
        return;
    }

    //if urgent NCRS applicable
    dropdown.innerHTML = "<p>Pending NCRs for Over 14 Days</p>"; //Text explaining why they are urgent
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
} //end of Function 1

//2. Recent NCRs on Dashboard/Home Page
function recentNCRs() {
    // Sort NCRs by NCRNumber (newest has the highest NCRNumber)
    const recentN = Quality.reverse().slice(0, 5);

    console.log(recentN);

    // Populate the results table
    const tableBody = document.getElementById("tablecontent")
    tableBody.innerHTML = ''; // Clear previous results

    // Add Recent NCRs to the table
    //TODO - FORMAT THE DATE AND ASK ARIANNE FOR CSS HERE
    recentN.forEach(result => {
        const newRow = `<tr>
                             <td>${result.ncrNumber}</td>
                             <td>${result.supplierName}</td>
                             <td>${result.dateCreated}</td>
                             <td>${result.ncrStatus}</td>
                             <td>
                                 <div style="display: grid; gap: 10px; grid-template-columns: 1fr 1fr">
                                     <button onclick="detailsEntry('${result.ncrNumber}')">View</button>
                                     <button onclick="editEntry('${result.ncrNumber}')">Edit</button>
                                 </div>
                             </td>
                         </tr>`;
        tableBody.innerHTML += newRow;
    })
};//End of Function 2


//3. Create Timestamp when Creating an NCR

function Timestamp() {
    const now = new Date();
    const date = now.toLocaleDateString(); // Format: MM/DD/YYYY
    const time = now.toLocaleTimeString(); // Format: HH:MM:SS AM/PM
    return `${date} ${time}`;
} //end of function 3


// 4. function to generate NCRNumber in the format YYYY-XXX
function NCRNumberGenerator() {
    const currentYear = new Date().getFullYear();
    const nextNumber = (NCRLog.length + 1).toString().padStart(3, '0');
    return `${currentYear}-${nextNumber}`;
} //end of function 4

//5. function to Create an NCR --HAVE TO EDIT
function CreateNCR() {
    // Get form values
    const applicableProcess = document.getElementById('applicableProcess').value;
    const supplierName = document.getElementById('supplierName').value;
    const ncrNumber = NCRNumberGenerator()
    const dateCreated = Timestamp(); //calls the timestamp function

    // Create a JSON object with the form data
    const ncrData = {
        ncrNumber: ncrNumber,
        dateCreated: dateCreated,
        createBy: "Test User",
        supplierName: supplierName,
        applicableProcess: applicableProcess,
        ncrStatus: 'Active', //all created ncrs defaulted to status
        dateClosed: '', //generated when an NCR is closed
        closedBy: '' //from the user entity
    }

    // Convert to JSON string (if you want to store it in localStorage or send it)
    const ncrJsonString = JSON.stringify(ncrData);

    // For demonstration, log the JSON object and string
    console.log('NCR Data (Object):', ncrData);
    console.log('NCR Data (JSON String):', ncrJsonString);

    //Optionally: store the data in localStorage
    localStorage.setItem('ncrData', ncrJsonString);

    //push NCR to NCRLog, then push to Quality?

    // Redirect to the edit page with NCR number in the URL
    window.location.href = `create.html?ncrNumber=${ncrData.ncrNumber}&supplierName=${encodeURIComponent(ncrData.supplierName)}&applicableProcess=${encodeURIComponent(ncrData.applicableProcess)}`;
}; //end of function 5



//SUPPORTING FUNCTIONS TO ORGANIZE
//Get Old Notifications - supports Notifications
function getOldNotifications() {
    const today = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 14);

    return Quality.filter(item => new Date(item.dateCreated) < fourteenDaysAgo)
        .map(item => item.ncrNumber);
} //end of function 


function performSearch() {
    const ncrNumber = document.getElementById('ncrNumber').value.trim();
    const supplierName = document.getElementById('supplierName').value;
    const ncrStatus = document.getElementById('ncrStatus').value;
    // Get start and end dates
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;

    const resultsCountMessage = document.getElementById('no-results-message');

    // Validate date range
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        resultsCountMessage.textContent = 'Start date must be earlier than or equal to end date.';
        resultsCountMessage.style.display = 'inline'; // Show the error message
        return; // Exit the function early
    }

    // Filter the Quality array based on the provided criteria
    const viewNCRs = Quality.filter(item => {
        const isNcrNumberValid = ncrNumber ? item.ncrNumber.includes(ncrNumber) : true;
        const isSupplierNameValid = supplierName ? item.supplierName === supplierName : true;
        const isStatusValid = ncrStatus ? item.ncrStatus === ncrStatus : true;

        // Date checks
        const itemDateCreated = new Date(item.dateCreated);
        const isDateCreatedValid = (
            (fromDate ? itemDateCreated >= new Date(fromDate) : true) &&
            (toDate ? itemDateCreated <= new Date(toDate) : true)
        );

        // Return true if all conditions are met
        return isNcrNumberValid && isSupplierNameValid && isStatusValid && isDateCreatedValid;
    });
    console.log(viewNCRs);
    console.log(ncrNumber);

    // Populate the results table
    const tableBody = document.getElementById("tablecontent")
    tableBody.innerHTML = ''; // Clear previous results

    //display results in table
    // Add Recent NCRs to the table
    //TODO - FORMAT THE DATE AND ASK ARIANNE FOR CSS HERE
    viewNCRs.forEach(result => {
        const newRow = `<tr>
                            <td>${result.ncrNumber}</td>
                            <td>${result.supplierName}</td>
                            <td>${result.dateCreated}</td>
                            <td>${result.ncrStatus}</td>
                            <td>
                                <div style="display: grid; gap: 10px; grid-template-columns: 1fr 1fr">
                                    <button onclick="detailsEntry('${result.ncrNumber}')">View</button>
                                    <button onclick="editEntry('${result.ncrNumber}')">Edit</button>
                                </div>
                            </td>
                        </tr>`;
        tableBody.innerHTML += newRow;
    })
};

// Populate the Details Page of an NCR when a user clicks view
function populateDetailsPage(ncrNumber) {
    const entry = Quality.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        document.getElementById('ncrNumber').textContent = entry.ncrNumber;
        document.getElementById('dateCreated').textContent = entry.dateCreated;
        document.getElementById('createdBy').textContent = entry.createdBy;
        document.getElementById('ncrStatus').textContent = entry.ncrStatus;
        document.getElementById('applicableProcess').textContent = entry.applicableProcess;
        document.getElementById('supplierName').textContent = entry.supplierName;
        document.getElementById('poNumber').textContent = entry.poNumber;
        document.getElementById('soNumber').textContent = entry.soNumber;
        document.getElementById('quantityReceived').textContent = entry.quantityReceived;
        document.getElementById('quantityDefect').textContent = entry.quantityDefective;
        document.getElementById('itemDescription').textContent = entry.itemDescription;
        document.getElementById('defectDescription').textContent = entry.defectDescription;
        document.getElementById('engNeeded').textContent = entry.engNeeded;
        document.getElementById('itemConform').textContent = entry.itemConform;
        populateDocumentFiles(entry.documentFiles); // Assuming documents is an array in your data
    }
}

// Populate Document Files
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

// Populate the Edit Page
function populateEditPage(ncrNumber) {
    const entry = Quality.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        document.getElementById('ncrNumber').textContent = entry.ncrNumber;
        document.getElementById('dateCreated').textContent = entry.dateCreated;
        document.getElementById('createdBy').textContent = entry.createdBy;
        document.getElementById('ncrStatus').textContent = entry.ncrStatus;
        document.getElementById('applicableProcess').value = entry.applicableProcess;
        document.getElementById('supplierName').value = entry.supplierName;
        document.getElementById('poNumber').value = entry.poNumber;
        document.getElementById('soNumber').value = entry.soNumber;
        document.getElementById('quantityReceived').value = entry.quantityReceived;
        document.getElementById('quantityDefect').value = entry.quantityDefective;
        document.getElementById('itemDescription').value = entry.itemDescription;
        document.getElementById('defectDescription').value = entry.defectDescription;
        document.getElementById('engNeeded').checked = entry.engNeeded === 'Yes'; 
        document.getElementById('itemConform').checked = entry.itemConform === 'Yes'; 
    }
}



// Other functions like toggleDropdown, editEntry, viewEntry, etc., go here

function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-menu');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Toggle Profile Dropdown
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Example edit function
function editEntry(ncrNumber) {
    window.location.href = `create.html?ncr=${ncrNumber}`; // Redirect to edit page
}

function detailsEntry(ncrNumber) {
    window.location.href = `details.html?ncr=${ncrNumber}`; // Redirect to edit page
    console.log(ncr);
}