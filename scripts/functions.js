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
function populateNotifications(userRole) {

    if (userRole == "Quality") {
        if (!quality.length) {
            console.warn('No quality data available to display.');
            return;
        }

        const dropdown = document.getElementById('notifList');
        const dropdownDesc = document.getElementById('notifDesc');
        if (!dropdown) {
            console.warn('Dropdown menu element not found.');
            return;
        }
        dropdown.innerHTML = ""; // Clear existing notifications

        const oldNotifications = getOldNotifications(userRole);
        const closedNotifications = JSON.parse(localStorage.getItem('closedNotifications')) || [];

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
            notificationItem.title = "Click to View NCR";

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
                localStorage.setItem('closedNotifications', JSON.stringify(closedNotifications)); // Save to localStorage
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

    } else if (userRole == "Engineer") {
        if (!engineering.length) {
            console.warn('No engineering data available to display.');
            return;
        }

        const dropdown = document.getElementById('notifList');
        const dropdownDesc = document.getElementById('notifDesc');
        if (!dropdown) {
            console.warn('Dropdown menu element not found.');
            return;
        }
        dropdown.innerHTML = ""; // Clear existing notifications

        const oldNotifications = getOldNotifications(userRole);
        const closedNotifications = JSON.parse(localStorage.getItem('closedNotifications')) || [];

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

        dropdownDesc.innerHTML = "<p>Pending NCRs</p>"; // Text explaining urgency

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
                localStorage.setItem('closedNotifications', JSON.stringify(closedNotifications)); // Save to localStorage
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
    } else if (userRole == "Purchasing") {
        if (!purchasing.length) {
            console.warn('No purchasing data available to display.');
            return;
        }

        const dropdown = document.getElementById('notifList');
        const dropdownDesc = document.getElementById('notifDesc');
        if (!dropdown) {
            console.warn('Dropdown menu element not found.');
            return;
        }
        dropdown.innerHTML = ""; // Clear existing notifications

        const oldNotifications = getOldNotifications(userRole);
        const closedNotifications = JSON.parse(localStorage.getItem('closedNotifications')) || [];

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

        dropdownDesc.innerHTML = "<p>Pending NCRs</p>"; // Text explaining urgency

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
                localStorage.setItem('closedNotifications', JSON.stringify(closedNotifications)); // Save to localStorage
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
}

// Function to update notification count
function updateNotificationCount() {
    const dropdown = document.getElementById('notifList');
    const countLabel = document.getElementById('spnCount');
    const currentCount = dropdown.children.length;
    countLabel.textContent = `${currentCount}`; // Update count label
}

// Supporting Function - Get Old Notifications
function getOldNotifications(userRole) {

    if (userRole == "Quality") {

        if (!quality.length) {
            console.warn('No quality data available to display.');
            return;
        }
        const today = new Date();
        // Get the date for 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Get the date for 18 days ago
    const eighteenDaysAgo = new Date();
    eighteenDaysAgo.setDate(today.getDate() - 18);

    // Filter the items between 7 and 18 days ago with ncrStatus as "Quality"
    return quality.filter(item => {
        const itemDate = new Date(item.dateCreated);
        return itemDate >= eighteenDaysAgo && itemDate < sevenDaysAgo && item.ncrStatus === "Quality";
    }).map(item => item.ncrNumber);

    } else if (userRole == "Engineer") {

        if (!engineering.length) {
            console.warn('No engineering data available to display.');
            return;
        }
        return engineering.filter(item => item.ncrStatus === "Engineering")
            .map(item => item.ncrNumber);

    } else if (userRole == "Purchasing") {

        if (!purchasing.length) {
            console.warn('No purchasing data available to display.');
            return;
        }
        return purchasing.filter(item => item.ncrStatus === "Purchasing")
            .map(item => item.ncrNumber);

    }

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
    const mainNav = document.getElementById('mainNav');
    const targetDropdown = document.getElementById(dropdownId);

    // Close all dropdowns if the clicked one is already active
    if (targetDropdown.classList.contains('active')) {
        targetDropdown.classList.remove('active');
        return; // Exit the function if the clicked dropdown is already active
    }

    // Close other dropdowns
    if (profileDropdown.classList.contains('active')) {
        profileDropdown.classList.remove('active');
    }
    if (notifDropdown.classList.contains('active')) {
        notifDropdown.classList.remove('active');
    }
    if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
    }

    // Open the target dropdown
    targetDropdown.classList.add('active');
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

document.getElementById('toggleNavButton').addEventListener('click', function (event) {
    event.stopPropagation(); // Prevents event from reaching document level
    toggleDropdown('mainNav');
});

// Close dropdowns if clicked outside
document.addEventListener('click', function (event) {
    document.getElementById('profileDropdown').classList.remove('active');
    document.getElementById('notifDisplay').classList.remove('active');
    document.getElementById('mainNav').classList.remove('active');
});

// ==============================================================
// 2. Recent NCRs on Dashboard/Home Page
// ==============================================================
function recentNCRs(userRole) {

    if (userRole == "Quality") {
        if (!quality.length) {
            console.warn('No quality data available to display.');
            return;
        }

        const recentNCRss = [...quality.filter(item => item.ncrStatus === "Quality")].reverse(); // Clone and reverse to avoid mutating the original array
        const recentN = recentNCRss.slice(0, 5);

        console.log(recentN);
        console.log(recentNCRss);

        const tableBody = document.getElementById("indexTableContent");
        if (!tableBody) {
            console.warn('Table body element not found.');
            return;
        }
        tableBody.innerHTML = ''; // Clear previous results

        if (recentN.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px; color: #666; font-style: italic; font-size: 16px; background-color: #f9f9f9;">
                        <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 10px; color: #888;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m2.1-5.45a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/>
                        </svg>
                        No recent NCRs.
                    </td>
                </tr>`;
        } else {
        recentN.forEach(result => {
            //const editButtonDisabled = result.ncrStatus !== "Quality" ? "disabled" : "";
            const newRow = `<tr>
            <td data-tippy-content="NCR number - ${result.ncrNumber}">${result.ncrNumber}</td>
            <td data-tippy-content="Supplier - ${result.supplierName}">${result.supplierName}</td>
            <td data-tippy-content="Date Created - ${formatDate(result.dateCreated)}">${formatDate(result.dateCreated)}</td>
            <td data-tippy-content="Status - ${result.ncrStatus}">${result.ncrStatus}</td>
            <td>
                <div>
                   <button data-tippy-content="View Details for ${result.ncrNumber}" onclick="detailsEntry('${result.ncrNumber}')">
                       <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                           <title>Details Icon</title>
                           <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                           <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                       </svg>
                       Details
                   </button>
                   <button data-tippy-content="Edit ${result.ncrNumber}" onclick="handleEditEntry('${result.ncrNumber}', '${result.ncrStatus}')">
                       <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                           <title>Details Icon</title>
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
    }
    else if (userRole == "Engineer") {
        //console.log(engineering);
        if (!engineering.length) {
            console.warn('No engineering data available to display.');
            return;
        }

        const recentNCRss = [...engineering.filter(item => item.ncrStatus === "Engineering")].reverse(); // Clone and reverse to avoid mutating the original array
        const recentN = recentNCRss.slice(0, 5);

        console.log(recentN);
        console.log(recentNCRss);

        const tableBody = document.getElementById("indexTableContent");
        if (!tableBody) {
            console.warn('Table body element not found.');
            return;
        }
        tableBody.innerHTML = ''; // Clear previous results

        if (recentN.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px; color: #666; font-style: italic; font-size: 16px; background-color: #f9f9f9;">
                        <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 10px; color: #888;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m2.1-5.45a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/>
                        </svg>
                        No recent NCRs.
                    </td>
                </tr>`;
        } else {
        recentN.forEach(result => {
            //const editButtonDisabled = result.ncrStatus !== "Quality" ? "disabled" : "";
            const newRow = `<tr>
                             <td>${result.ncrNumber}</td>
                             <td>${((quality.find(q => q.ncrNumber === result.ncrNumber)?.supplierName)) || ''}</td>
                             <td>${formatDate(quality.find(q => q.ncrNumber === result.ncrNumber)?.dateCreated)}</td>
                             <td>${result.ncrStatus}</td>
                              <td>
                                <div>
                                    <button onclick="detailsEntry('${result.ncrNumber}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        </svg>
                                        Details
                                    </button>
                                    <button onclick="editEntryEng('${result.ncrNumber}')">
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
    }
    else if (userRole == "Purchasing") {
        //console.log(engineering);
        if (!purchasing.length) {
            console.warn('No purchasing data available to display.');
            return;
        }

        const recentNCRss = [...purchasing.filter(item => item.ncrStatus === "Purchasing")].reverse(); // Clone and reverse to avoid mutating the original array
        const recentN = recentNCRss.slice(0, 5);

        console.log(recentN);
        console.log(recentNCRss);

        const tableBody = document.getElementById("indexTableContent");
        if (!tableBody) {
            console.warn('Table body element not found.');
            return;
        }
        tableBody.innerHTML = ''; // Clear previous results

        if (recentN.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px; color: #666; font-style: italic; font-size: 16px; background-color: #f9f9f9;">
                        <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 10px; color: #888;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m2.1-5.45a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/>
                        </svg>
                        No recent NCRs.
                    </td>
                </tr>`;
        } else 
        {
        recentN.forEach(result => {
            //const editButtonDisabled = result.ncrStatus !== "Quality" ? "disabled" : "";
            const newRow = `<tr>
                             <td data-tippy-content="NCR Number - ${result.ncrNumber}">${result.ncrNumber}</td>
                             <td data-tippy-content="Supplier - ${((quality.find(q => q.ncrNumber === result.ncrNumber)?.supplierName)) || ''}">${((quality.find(q => q.ncrNumber === result.ncrNumber)?.supplierName)) || ''}</td>
                             <td data-tippy-content="Date Created - ${formatDate(quality.find(q => q.ncrNumber === result.ncrNumber)?.dateCreated)}">${formatDate(quality.find(q => q.ncrNumber === result.ncrNumber)?.dateCreated)}</td>
                             <td data-tippy-content="Status - ${result.ncrStatus}">${result.ncrStatus}</td>
                              <td>
                                <div>
                                    <button data-tippy-content="Details for ${result.ncrNumber}" onclick="detailsEntry('${result.ncrNumber}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <title>Details Icon</title>
                                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        </svg>
                                        Details
                                    </button>
                                    <button data-tippy-content="Edit ${result.ncrNumber}" onclick="editEntryEng('${result.ncrNumber}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <title>Edit Icon</title>
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
    }
    else if (userRole == "Admin") {
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

        if (recentN.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px; color: #666; font-style: italic; font-size: 16px; background-color: #f9f9f9;">
                        <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 10px; color: #888;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m2.1-5.45a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/>
                        </svg>
                        No recent NCRs.
                    </td>
                </tr>`;
        } else {
        recentN.forEach(result => {
            //const editButtonDisabled = result.ncrStatus !== "Quality" ? "disabled" : "";
            const newRow = `<tr>
            <td data-tippy-content="NCR number - ${result.ncrNumber}">${result.ncrNumber}</td>
            <td data-tippy-content="Supplier - ${result.supplierName}">${result.supplierName}</td>
            <td data-tippy-content="Date Created - ${formatDate(result.dateCreated)}">${formatDate(result.dateCreated)}</td>
            <td data-tippy-content="Status - ${result.ncrStatus}">${result.ncrStatus}</td>
            <td>
                <div>
                   <button data-tippy-content="View Details for ${result.ncrNumber}" onclick="detailsEntry('${result.ncrNumber}')">
                       <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                           <title>Details Icon</title>
                           <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                           <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                       </svg>
                       Details
                   </button>
                   <button data-tippy-content="Edit ${result.ncrNumber}" onclick="handleEditEntry('${result.ncrNumber}', '${result.ncrStatus}')">
                       <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                           <title>Details Icon</title>
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
    }
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
        document.getElementById('ncrNumber').textContent = entry.ncrNumber || "-";
        document.getElementById('dateCreated').textContent = formatDate(entry.dateCreated) || "-";
        document.getElementById('createdBy').textContent = entry.createdBy || "-";
        document.getElementById('ncrStatus').textContent = entry.ncrStatus ?? "Quality";
        document.getElementById('applicableProcess').textContent = entry.applicableProcess || "-";
        document.getElementById('supplierNameD').textContent = entry.supplierName || "-";

        // Handle missing values with nullish coalescing
        document.getElementById('poNumber').textContent = entry.poNumber || "-";
        document.getElementById('soNumber').textContent = entry.soNumber || "-";
        document.getElementById('quantityReceived').textContent = entry.quantityReceived || "-";
        document.getElementById('quantityDefect').textContent = entry.quantityDefect || "-";
        document.getElementById('itemDescription').innerHTML = entry.itemDescription.replace(/\n/g, '<br/>') || "-";
        document.getElementById('defectDescription').innerHTML = entry.defectDescription.replace(/\n/g, '<br/>') || "-";

        // Assuming engineering is related to defect description
        document.getElementById('engNeeded').textContent = entry.engNeeded ?? "No";
        document.getElementById('itemConform').textContent = entry.itemConform ?? "No";

        document.getElementById('completedByQI').textContent = entry.completedBy || "-";
        document.getElementById('completedOnQI').textContent = entry.completedOn ? formatDate(entry.completedOn) : "-";

        const documentFilesList = document.getElementById('thumbnailsContainer');
        documentFilesList.innerHTML = ''; // Clear any existing content

        // Check if documentFiles exists and has items
        if (entry.documentFiles && entry.documentFiles.length > 0) {
            entry.documentFiles.forEach(file => {
                // Create elements for each thumbnail
                const fileItem = document.createElement('div');
                fileItem.classList.add('file-item');

                const thumbImgContainer = document.createElement('div');
                thumbImgContainer.classList.add('file-img-container');

                const imageLink = document.createElement('a');
                imageLink.href = "#";
                imageLink.target = '_blank';

                const thumbImage = document.createElement('img');
                thumbImage.src = file.thumbnail;
                thumbImage.classList.add('thumbnail');

                thumbImage.title = "Click here to expand the image";
                thumbImage.setAttribute('aria-label', "Click here to expand the image");


                const imageName = document.createElement('p');
                const maxLength = 15;
                const truncatedName = file.fileName.length > maxLength ?
                    file.fileName.substring(0, maxLength) + '...jpg' :
                    file.fileName;
                imageName.textContent = truncatedName;

                imageLink.addEventListener('click', function () {
                    const newWindow = window.open("", "_blank");

                    newWindow.document.write(`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>${file.fileName}</title>
                            <style>
                                body {
                                    margin: 0;
                                    height: 100vh;
                                    background-color: black;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    overflow: hidden;
                                }
                                img {
                                    max-width: 90%;
                                    max-height: 90%;
                                    object-fit: contain;
                                }
                            </style>
                        </head>
                        <body>
                            <img src="${file.thumbnail}" alt="${file.fileName}" style="max-width: 100%; height: auto;">
                        </body>
                        </html>
                    `);
                    newWindow.document.close();
                });

                // Append elements to the file item
                fileItem.appendChild(imageName);
                imageLink.appendChild(thumbImage);
                thumbImgContainer.appendChild(imageLink);
                fileItem.appendChild(thumbImgContainer);

                documentFilesList.appendChild(fileItem); // Append file item to the container
            });
        } else {
            documentFilesList.innerHTML = 'No uploaded files.'; // Handle no files case
        }

        if (entry.ncrStatus != "Quality") {
            document.getElementById('qCompletionToggle').classList.add("non");
        }
        //hide print button unless NCR is closed
        if (entry.ncrStatus != "Close") {
            document.getElementById('printButton').classList.add("non");
        }

        // Disable edit button if status is not "Quality"
        const editButton = document.getElementById('editButton'); // Assuming you have an edit button with this ID

        if (editButton) {
            editButton.onclick = () => {
                const ncrStatus = entry.ncrStatus; // Get the NCR status from the entry object

                if (ncrStatus !== "Quality") {
                    showToast(`This NCR is already submitted to ${ncrStatus}. You can make and save changes, except to 'Item Marked Conforming' and 'Engineering Needed' fields.`, 'info', 5000);
                    window.location.href = `create.html?ncr=${ncrNumber}`; // Redirect to edit page
                } else {
                    window.location.href = `create.html?ncr=${ncrNumber}`; // Redirect to edit page
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
function editEntryEng(ncrNumber) {

    window.location.href = `create.html?ncr=${ncrNumber}`; // Redirect to edit page
}

function editEntryPch(ncrNumber) {

    window.location.href = `create.html?ncr=${ncrNumber}`; // Redirect to edit page

}

function downloadEntry(ncrNumber) {
    const currentPage = window.location.href; // Save the current page URL
    const detailsPage = `details.html?ncr=${ncrNumber}&action=print&returnUrl=${encodeURIComponent(currentPage)}`;
    window.location.href = detailsPage; // Redirect to details page

}
//showToast(`NCR Number: ${ncrNumber} has been downloaded.`,'success',5000);


//FUNCTION USED ON AN EDIT PAGE - HAPPENS AT THE CREATE PAGE

// ============================================================
// 4. Edit The Information of an NCR that has been Created
// Populate the Create Page of an NCR when a user clicks Edit
// or immediately after creationg an NCR
// ============================================================

function populateEditPage(ncrNumber) {
    //document.getElementById('create-edit')
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
        document.getElementById('completedByQI').value = entry.completedBy ? entry.completedBy : "";
        document.getElementById('completedOnQI').value = entry.completedOn ? formatDate(entry.completedOn) : "";


        // Clear the existing thumbnails container
        const thumbnailsContainer = document.getElementById('thumbnailsContainer');
        thumbnailsContainer.innerHTML = "";
        // Populate previously uploaded files into the global array and display them
        uploadedFiles.length = 0; // Clear current files (if any)
        if (entry.documentFiles && entry.documentFiles.length > 0) {
            entry.documentFiles.forEach(file => {
                const fileObject = { fileName: file.fileName, thumbnail: file.thumbnail };
                uploadedFiles.push(fileObject);
                displayThumbnail(fileObject);
            });
        }
        else {
            thumbnailsContainer.innerHTML = `<p id="fileEmptyDesc" class="file-empty-desc">No files uploaded yet!</p>`;
        }

        if (entry.ncrStatus != "Quality") {
            document.getElementById('btnSubmit').style.display = 'none';
            document.getElementById('engNeeded').disabled = true;
            document.getElementById('itemConform').disabled = true;
            document.getElementById('qCompletionToggle').classList.remove('non');
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
        showToast(`This NCR is already submitted to ${ncrStatus}. You can make and save changes, except to 'Item Marked Conforming' and 'Engineering Needed' fields.`, 'info', 5000);
        window.location.href = `create.html?ncr=${ncrNumber}`; // Redirect to edit page
    } else {
        window.location.href = `create.html?ncr=${ncrNumber}`; // Redirect to edit page
    }
}

//FUNCTION USED ON VIEW NCRS PAGE TO PERFORM SEARCH

// ====================================================================
// Pagination Controls
// ====================================================================
let currentPage = 1; // Initialize the current page
let resultsPerPage = 5; // Number of results to show per page

function setupPagination(totalResults, displayResultsFunc, tableBodyId, paginationContainerId) {
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const paginationContainer = document.getElementById(paginationContainerId);
    paginationContainer.innerHTML = ''; // Clear previous pagination

    // Add "Back" button only if on the second page or beyond
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Back';
        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination(totalResults, displayResultsFunc, tableBodyId, paginationContainerId);
            }
        };
        paginationContainer.appendChild(prevButton);
    }

    // Calculate the range of pages to display
    const startPage = Math.max(1, currentPage - 1); // Start one page before the current page, but not less than 1
    const endPage = Math.min(totalPages, startPage + 2); // Show up to 3 pages total

    for (let page = startPage; page <= endPage; page++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = page;
        pageButton.classList.toggle('active', page === currentPage); // Highlight the active page
        pageButton.onclick = () => {
            currentPage = page;
            updatePagination(totalResults, displayResultsFunc, tableBodyId, paginationContainerId);
        };
        paginationContainer.appendChild(pageButton);
    }

    // Add "Next" button only if there are more pages
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination(totalResults, displayResultsFunc, tableBodyId, paginationContainerId);
            }
        };
        paginationContainer.appendChild(nextButton);
    }
}
function updatePagination(totalResults, displayResultsFunc, tableBodyId, paginationContainerId) {
    displayResultsFunc(currentPage, resultsPerPage, tableBodyId); // Update the displayed results
    setupPagination(totalResults, displayResultsFunc, tableBodyId, paginationContainerId); // Re-render pagination
}

function resetPagination() {
    currentPage = 1; // Reset to the first page
}


// ====================================================================
//  5. Perform Search - Used for Filtering
//     sets results to a table
//     View NCRs page is initialized to show NCRS still with Quality
// ====================================================================
function performSearch() {
    const ncrNumber = document.getElementById('ncrNumber').value.trim();
    const supplierName = document.getElementById('supplierName').value;
    const ncrStatus = document.getElementById("ncrStatus").value || "Quality";
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;

    //const resultsCountMessage = document.getElementById('noResultsMessage');

    // Date validation
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        //resultsCountMessage.textContent = 'Start date must be earlier than or equal to end date.';
        //resultsCountMessage.style.display = 'inline';
        //return;

        showToast("Start date must be earlier than or equal to end date.", "error", 5000)
        //location.reload();
        return;
    }
    if (ncrNumber && /[a-zA-Z]/.test(ncrNumber)) {
        //resultsCountMessage.textContent = 'NCR Number must not contain alphabetic characters.';
        //resultsCountMessage.style.display = 'inline';

        showToast("NCR Number must not contain alphabetic characters.", "error", 5000)
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
        // Validate NCR number if provided
        const isNcrNumberValid = ncrNumber ? item.ncrNumber.includes(ncrNumber) : true;

        // Validate supplier name if provided
        const isSupplierNameValid = supplierName ? item.supplierName === supplierName : true;

        // Validate status: if ncrStatus is "All", ignore the status filter, else match it
        const isStatusValid = (ncrStatus === "All" || item.ncrStatus === ncrStatus);

        // Validate date range if provided
        const itemDateCreated = new Date(item.dateCreated);
        const isDateCreatedValid = (
            (fromDateObj ? itemDateCreated >= fromDateObj : true) &&
            (toDateObj ? itemDateCreated <= toDateObj : true)
        );

        // Return the result only if all filters are satisfied
        return isNcrNumberValid && isSupplierNameValid && isStatusValid && isDateCreatedValid;
    });


    const totalResults = filteredResults.length;

    // Display results based on current page
    const tableBody = document.getElementById("viewTableContent");
    const paginatedResults = filteredResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
    const paginationContainer = document.getElementById("pagination");

    tableBody.innerHTML = ''; // Clear previous results

    paginatedResults.forEach(result => {
        const newRow = `<tr>
                            <td data-tippy-content="NCR Number - ${result.ncrNumber}">${result.ncrNumber}</td>
                            <td data-tippy-content="Supplier - ${result.supplierName}">${result.supplierName}</td>
                            <td data-tippy-content="Date Created - ${formatDate(result.dateCreated)}">${formatDate(result.dateCreated)}</td>
                            <td data-tippy-content="Status - ${result.ncrStatus}">${result.ncrStatus}</td>
                            <td>
                                <div>
                                    <button data-tippy-content="Details for ${result.ncrNumber}" onclick="detailsEntry('${result.ncrNumber}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <title>Details Icon</title>
                                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        </svg>
                                        Details
                                    </button>
                                    ${((getUserRole() === "Admin" && (result.ncrStatus == ncrStatus || ncrStatus == "All")) || (result.ncrStatus !== 'Closed' && result.ncrStatus !== 'Purchasing' && result.ncrStatus !== 'Engineering')) ? `<button data-tippy-content="Edit ${result.ncrNumber}" onclick="handleEditEntry('${result.ncrNumber}', '${result.ncrStatus}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <title>Edit Icon</title>
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                        </svg>
                                        Edit
                                    </button>` : ''}
                                    ${result.ncrStatus === 'Closed' ? `<button data-tippy-content="Download PDF for ${result.ncrNumber}" onclick="downloadEntry('${result.ncrNumber}')">
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <title>Download PDF Icon</title>
                                        <path stroke="currentColor" stroke-width="2" d="M5 12l7 7 7-7M12 19V5"/>
                                    </svg>
                                    Download PDF
                                </button>` : ''}
                                </div>
                            </td>
                        </tr>`;
        tableBody.innerHTML += newRow; // Add new row to table
    });

    // Setup pagination
    setupPagination(totalResults, performSearch, "viewTableContent", "pagination");

    if (totalResults === 0) {
        // Show a placeholder row in the table with a magnifying glass icon


        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px; color: #666; font-style: italic; font-size: 16px; background-color: #f9f9f9;">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 10px; color: #888;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m2.1-5.45a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/>
                    </svg>
                    No results found.
                </td>
            </tr>`;
        paginationContainer.style.display = 'none'; // Hide pagination
        return;

    }
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

    // Validation rules for dropdown fields
    const createNCRValidations = [
        {
            id: 'applicableProcess-error', // Unique ID for error message
            targetId: 'napplicableProcess',
            condition: () => applicableProcess === '' || applicableProcess === 'default', // Adjust 'default' based on your dropdown's default value
            message: 'Please select an Applicable Process.'
        },
        {
            id: 'supplierName-error', // Unique ID for error message
            targetId: 'nsupplierName',
            condition: () => supplierName === '' || supplierName === 'default', // Adjust 'default' based on your dropdown's default value
            message: 'Please select a Supplier.'
        }
    ];

    // Validate fields
    let isValid = true;
    createNCRValidations.forEach(validation => {
        const fieldElement = document.getElementById(validation.targetId);
        const errorElement = document.getElementById(validation.id);

        // Clear previous messages and styles
        if (errorElement) errorElement.remove();
        if (fieldElement) fieldElement.style.border = '';

        // Apply validation
        if (validation.condition()) {
            isValid = false;

            // Display error message
            const errorDiv = document.createElement('div');
            errorDiv.id = validation.id;
            errorDiv.style.color = '#B22222';
            errorDiv.style.fontSize = '16px';
            errorDiv.textContent = validation.message;
            fieldElement.parentNode.appendChild(errorDiv);

            // Highlight border
            fieldElement.style.border = '3px solid #B22222';

            // Add real-time error clearing
            fieldElement.addEventListener('change', function clearError() {
                const fieldValue = fieldElement.value;
                if (fieldValue !== '' && fieldValue !== 'default') { // Adjust 'default' as needed
                    const errorElement = document.getElementById(validation.id);
                    if (errorElement) errorElement.remove();
                    fieldElement.style.border = '';
                    fieldElement.removeEventListener('change', clearError);
                }
            });
        }
    });

    // Stop submission if validations fail
    if (!isValid) return;

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
    //console.log(ncrLogEntry)

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
        supplierName: supplierName,
        applicableProcess: applicableProcess,
        poNumber: "",  // Empty for now, to be updated later
        soNumber: "",  // Empty for now, to be updated later
        quantityReceived: "",  // Empty for now
        quantityDefect: "",  // Empty for now
        engNeeded: "No",  // Default value
        itemConform: "No",  // Default value
        itemDescription: "",  // Empty for now
        defectDescription: "",  // Empty for now
        documentFiles: [],  // Empty for now
        ncrStatus: "Quality",
        completedBy: ""
    };

    // Add the entry to the quality array
    quality.push(qualityEntry);
    console.log("Updated Quality Array:", quality);

    // Persist ncrLog and quality to localStorage
    localStorage.setItem('ncrLog', JSON.stringify(ncrLog));
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('quality', JSON.stringify(quality));

    showToast(`NCR Number ${ncrNumber} successfully generated. You may continue to provide additional information now or later`, "success", 5000);
    //const createNCRModal = document.getElementById('createNCRModal');
    //const createEditModal = document.getElementById('createEditModal');

    //createNCRModal.style.visibility = 'hidden';
    //createEditModal.style.visibility = 'visible';

    localStorage.setItem('ncrNumber', ncrNumber);
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
    const date = Timestamp();

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
            showToast('No changes were made.', 'info', 5000);
            return;
        }

        if (quantityReceived != "") {
            if (parsedQuantityReceived < 1) {
                showToast('Quantity Received cannot be less than 1', 'error', 5000)
                return;
            }
        }

        if (quantityDefect != "") {
            if (parsedQuantityDefect < 1) {
                showToast('Quantity Defective cannot be less than 1', 'error', 5000)
                return
            }
        }

        if (Number(quantityDefect) > Number(quantityReceived)) {
            showToast('The number of defects cannot exceed the quantity received.', 'error', 5000)
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

            // Persist updated quality array to localStorage
            localStorage.setItem('quality', JSON.stringify(quality));

            //update lastUpdated in NCRLog
            const ncrLogEntry = ncrLog.find(entry => entry.ncrNumber === ncrNumber);
            if (ncrLogEntry) { ncrLogEntry.lastUpdated = date }
            localStorage.setItem('ncrLog', JSON.stringify(ncrLog));

            // Create a history entry and add it to the history array
            const historyEntry = {
                ncrNumber: ncrNumber,
                actionType: "Edit",
                status: 'Open',
                actionDescription: `NCR edited by ${getUserRole()}`,
                changedBy: changedBy,  // This should be dynamically set to the actual user
                changedOn: date // Use function timestamp
            };

            // Push the history entry and save it in localStorage
            history.push(historyEntry);
            localStorage.setItem('history', JSON.stringify(history));

            showToast('Your changes have been saved. You can continue later.', 'success', 5000);
            window.history.back();
        } else {
            // If the user cancels, do nothing or add custom logic
            showToast("Save operation cancelled.", 'info', 5000);
        }

    } else {
        showToast('NCR not found. Please check the NCR number.', 'error', 5000);
    }
}

// ===================================================================
// 8. Function to Submit the NCR (all required fields must be filled)
// ===================================================================
function submitNCR() {
    const ncrNumber = document.getElementById('ncrNumber').textContent;

    const changedBy = getUserName();
    const date = Timestamp();

    // Collect current form values
    const applicableProcess = document.getElementById('applicableProcess')?.value;
    const supplierName = document.getElementById('supplierName')?.value;
    const poNumber = document.getElementById('poNumber')?.value || '';
    const soNumber = document.getElementById('soNumber')?.value || '';
    const quantityReceived = document.getElementById('quantityReceived')?.value || '';
    const quantityDefect = document.getElementById('quantityDefect')?.value || '';
    const engNeeded = document.getElementById('engNeeded')?.checked ? 'Yes' : 'No';
    const itemConform = document.getElementById('itemConform')?.checked ? 'Yes' : 'No';
    const itemDescription = document.getElementById('itemDescription')?.value || '';
    const defectDescription = document.getElementById('defectDescription')?.value || '';

    // Array to store required field validation info
    const fieldsToValidate = [
        { id: 'poNumber', value: poNumber, message: 'Prod. Number is required.' },
        { id: 'soNumber', value: soNumber, message: 'Sales Order Number is required.' },
        { id: 'quantityReceived', value: quantityReceived, message: 'Quantity Received is required.' },
        { id: 'quantityDefect', value: quantityDefect, message: 'Quantity Defective is required.' },
        { id: 'itemDescription', value: itemDescription, message: 'Item Description is required.' },
        { id: 'defectDescription', value: defectDescription, message: 'Defect Description is required.' }
    ];

    // Additional validations as rules
    const additionalValidations = [
        {
            id: 'quantityDefect-exceeds-received', // Unique ID for this rule
            targetId: 'quantityDefect', // The field being validated
            condition: () => Number(document.getElementById('quantityDefect').value) > Number(document.getElementById('quantityReceived').value),
            message: 'Quantity Defective cannot exceed Quantity Received.'
        },
        {
            id: 'quantityReceived-less-than-one', // Unique ID for this rule
            targetId: 'quantityReceived',
            condition: () => Number(document.getElementById('quantityReceived').value) < 1,
            message: 'Quantity Received cannot be less than 1.'
        },
        {
            id: 'quantityDefect-less-than-one', // Unique ID for this rule
            targetId: 'quantityDefect',
            condition: () => Number(document.getElementById('quantityDefect').value) < 1,
            message: 'Quantity Defective cannot be less than 1.'
        }
    ];

    // Phase 1: Validate required fields
    let isMainValid = true;
    fieldsToValidate.forEach(field => {
        const fieldElement = document.getElementById(field.id);
        const errorElement = document.getElementById(`${field.id}-error`);

        // Clear previous messages and styles
        if (errorElement) errorElement.remove();
        if (fieldElement) fieldElement.style.border = '';

        // Add validation messages if required field is empty
        if (!field.value) {
            isMainValid = false;

            // Display error message
            const errorDiv = document.createElement('div');
            errorDiv.id = `${field.id}-error`;
            errorDiv.style.color = '#B22222';
            errorDiv.style.fontSize = '16px';
            errorDiv.textContent = field.message;
            fieldElement.parentNode.appendChild(errorDiv);

            // Highlight border
            fieldElement.style.border = '3px solid #B22222';

            // Add real-time error clearing
            fieldElement.addEventListener('input', function clearError() {
                if (fieldElement.value) {
                    const errorElement = document.getElementById(`${field.id}-error`);
                    if (errorElement) errorElement.remove();
                    fieldElement.style.border = '';
                    fieldElement.removeEventListener('input', clearError);
                }
            });
        }
    });

    // Stop further validation if main validations failed
    if (!isMainValid) return;

    // Phase 2: Validate additional conditions
    let isAdditionalValid = true;
    additionalValidations.forEach(validation => {
        const fieldElement = document.getElementById(validation.targetId);
        const errorElement = document.getElementById(validation.id); // Use unique error ID

        // Clear previous messages and styles
        if (errorElement) errorElement.remove();
        if (fieldElement) fieldElement.style.border = '';

        // Apply additional validation
        if (validation.condition()) {
            isAdditionalValid = false;

            // Display error message
            const errorDiv = document.createElement('div');
            errorDiv.id = validation.id; // Unique ID for this error message
            errorDiv.style.color = '#B22222';
            errorDiv.style.fontSize = '16px';
            errorDiv.textContent = validation.message;
            fieldElement.parentNode.appendChild(errorDiv);

            // Highlight border
            fieldElement.style.border = '3px solid #B22222';

            // Add real-time error clearing
            fieldElement.addEventListener('input', function clearError() {
                if (!validation.condition()) {
                    const errorElement = document.getElementById(validation.id);
                    if (errorElement) errorElement.remove();
                    fieldElement.style.border = '';
                    fieldElement.removeEventListener('input', clearError);
                }
            });
        }
    });

    if (!isAdditionalValid) return;


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
            qualityEntry.completedBy = changedBy;
            qualityEntry.completedOn = date;

            // Mark the NCR as submitted
            qualityEntry.ncrStatus = engNeededCheckbox.checked ? "Engineering" : "Purchasing";
            localStorage.setItem('quality', JSON.stringify(quality));

            //make engineering array and push to engineering json
            if (qualityEntry.ncrStatus === "Engineering") {
                const engineeringEntry = {
                    ncrNumber: ncrNumber,
                    ncrStatus: qualityEntry.ncrStatus,
                    reviewByCfEngineering: "",
                    customerNotification: "",
                    disposition: "",
                    drawingUpdate: "",
                    originalRevNumber: "",
                    updatedRevNumber: "",
                    revisionDate: "",
                    engineerName: "",
                    completedBy: "",
                    completedOn: ""
                }
                engineering.push(engineeringEntry);
                localStorage.setItem('engineering', JSON.stringify(engineering));

                // Send email notification
                // Send email to appropriate department
                //sendEmailNotification(ncrNumber, 'Yes');

                //make history array and push to history json
                const historyEntry = {
                    ncrNumber: ncrNumber,
                    actionType: "Submit",
                    status: 'Open',
                    actionDescription: "NCR submitted from Quality to Engineering",
                    changedBy: changedBy,
                    changedOn: date
                }
                history.push(historyEntry);
                localStorage.setItem('history', JSON.stringify(history));

            }
            else if (qualityEntry.ncrStatus === "Purchasing") {
                const purchasingEntry = {
                    ncrNumber: ncrNumber,
                    ncrStatus: qualityEntry.ncrStatus,
                    preliminaryDecision: "",
                    carRaised: "",
                    carNumber: "",
                    followUp: "",
                    followUpType: "",
                    followUpDate: "",
                    ncrClosed: "",
                    completedBy: "",
                    completedOn: ""
                }
                purchasing.push(purchasingEntry);
                localStorage.setItem('purchasing', JSON.stringify(purchasing));

                // Send email notification
                // Send email to appropriate department
                //sendEmailNotification(ncrNumber, 'No');

                //update lastUpdated in NCRLog
                const ncrLogEntry = ncrLog.find(entry => entry.ncrNumber === ncrNumber);
                if (ncrLogEntry) { ncrLogEntry.lastUpdated = date }
                localStorage.setItem('ncrLog', JSON.stringify(ncrLog));

                //make history array and push to history json
                const historyEntry = {
                    ncrNumber: ncrNumber,
                    actionType: "Submit",
                    status: 'Open',
                    actionDescription: "NCR submitted from Quality to Purchasing",
                    changedBy: changedBy,
                    changedOn: date
                }
                history.push(historyEntry);
                localStorage.setItem('history', JSON.stringify(history));
            }

            /*
            if (qualityEntry.ncrStatus === "Engineering") {
                // Send email to Engineering
                sendEmailNotification(ncrNumber, 'Yes');  // 'Yes' for Engineering emails

                // Additional logic for Engineering...
            }
            else if (qualityEntry.ncrStatus === "Purchasing") {
                // Send email to Purchasing
                sendEmailNotification(ncrNumber, 'No');  // 'No' for Purchasing emails

                // Additional logic for Purchasing...
            }
            */

            showToast('NCR has been successfully submitted.', 'success', 5000);

            // Redirect or perform other actions as needed
            //window.history.back();
            window.location.href = "index.html"; // Redirect to edit page


            /*ncrNumber = ncrNumber;
            populateDetailsPage(ncrNumber); */

        }

    } else {
        // If the user cancels, do nothing or add custom logic
        showToast("Submit operation cancelled.", 'info', 5000);
        // Redirect or perform other actions as needed
        return;

        //history.push(historyEntry);
        //localStorage.setItem('history', JSON.stringify(history));
    }
}

function populateRecordsTable(data) {
    const tableContent = document.getElementById('reportsTableContent');
    tableContent.innerHTML = ''; // Clear existing rows
    data.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td data-tippy-content="NCR Number - ${record.ncrNumber}">${record.ncrNumber}</td>    
        <td data-tippy-content="Changed On - ${formatDate(record.changedOn)}">${formatDate(record.changedOn)}</td>
            <td data-tippy-content="Action Type - ${record.actionType}">${record.actionType}</td>
            <td data-tippy-content="Status - ${record.status}">${record.status}</td>
            <td data-tippy-content="Action Description - ${record.actionDescription}">${record.actionDescription}</td>
            <td data-tippy-content="Changed By - ${record.changedBy}">${record.changedBy}</td>
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
        showToast("Start date must be earlier than or equal to end date.", 'error', 5000);
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

    // Check if NCR number contains any alphabetic characters
    if (ncrNumber && /[a-zA-Z]/.test(ncrNumber)) {
        //noResultsMessage.textContent = 'NCR Number must not contain alphabetic characters.';
        //noResultsMessage.style.display = 'inline';

        showToast("NCR Number must not contain alphabetic characters.", "error", 5000)
        //location.reload();
        return;
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
    const paginationContainer = document.getElementById("paginationControls");

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
            <td data-tippy-content="NCR Number - ${report.ncrNumber}">${report.ncrNumber}</td>
            <td data-tippy-content="Created By - ${report.createdBy}">${report.createdBy}</td>
            <td data-tippy-content="Department - ${report.department}">${report.department}</td>
            <td data-tippy-content="Date Created - ${formatDate(report.dateCreated)}">${formatDate(report.dateCreated)}</td>
            <td data-tippy-content="Status - ${report.status}">${report.status}</td>
            <td data-tippy-content="Last Updated - ${formatDate(report.lastUpdated)}">${formatDate(report.lastUpdated)}</td>
            <td>
                <button data-tippy-content="View History for ${report.ncrNumber}" onclick="viewReport('${report.ncrNumber}')">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <title>View History for ${report.ncrNumber}</title>
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

    if (filteredReports.length === 0) {
        //noResultsMessage.textContent = 'No results found.';
        //noResultsMessage.style.display = 'block';

        // Show a placeholder row in the table with a magnifying glass icon
        tableContent.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 20px; color: #666; font-style: italic; font-size: 16px; background-color: #f9f9f9;">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 10px; color: #888;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m2.1-5.45a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/>
                </svg>
                No results found.
            </td>
        </tr>`;
        paginationContainer.style.display = 'none'; // Hide pagination
        return;
    } /*else {
        noResultsMessage.style.display = 'none';
    }*/
}

function clearSearch() {

    location.reload();
}

function closeModal() {
    // Find the modal container and set its display to 'none' to hide it
    const modal = document.getElementById('reportsTable');
    modal.style.display = 'none';
}

/*function NavBar() {
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
};*/

function printPdf() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userRole = loggedInUser ? loggedInUser.Department_Name : null; // "Quality" or "Engineer"

    // Get the common NCR fields
    var ncrNumber1 = document.getElementById("ncrNumber").textContent.trim();
    var dateCreated = document.getElementById("dateCreated").textContent.trim();
    var createdBy = document.getElementById("createdBy").textContent.trim();
    var ncrStatus = document.getElementById("ncrStatus").textContent.trim();
    var supplierName = document.getElementById("supplierNameD").textContent.trim();
    var productionNumber = document.getElementById("poNumber").textContent.trim();
    var qtyRecieved = document.getElementById("quantityReceived").textContent.trim();
    var engneeded = document.getElementById("engNeeded").textContent.trim();
    var appProcess = document.getElementById("applicableProcess").textContent.trim();
    var qtyDefect = document.getElementById("quantityDefect").textContent.trim();
    var itemConform = document.getElementById("itemConform").textContent.trim();
    var sonumber = document.getElementById("soNumber").textContent.trim();
    var customerNotif = document.getElementById("customerNotification").textContent.trim();
    var drawingUpdate = document.getElementById("drawingUpdate").textContent.trim();
    var originalRevNumber = document.getElementById("originalRevNumber").textContent.trim();
    var updatedRevNumber = document.getElementById("updatedRevNumber").textContent.trim();
    var revisionDate = document.getElementById("revisionDate").textContent.trim();
    var engineerName = document.getElementById("engineerName").textContent.trim();
    var preliminaryDecision = document.getElementById("preliminaryDecision").textContent.trim();
    var carRaised = document.getElementById("carRaised").textContent.trim();
    var carNumber = document.getElementById("carNumber").textContent.trim();
    var followUp = document.getElementById("followUp").textContent.trim();
    var followUpType = document.getElementById("followUpType").textContent.trim();
    var followUpDate = document.getElementById("followUpDate").textContent.trim();
    var ncrClosed = document.getElementById("ncrClosed").textContent.trim();
    var completedByPch = document.getElementById("completedByPch").textContent.trim();
    var completedOnPch = document.getElementById("completedOnPch").textContent.trim();
    var engNeeded = document.getElementById("engNeeded");
    var isChecked = engNeeded.checked;

    // Quality-specific fields
    var itemDescription = document.getElementById("itemDescription").textContent.trim();
    var defectDescription = document.getElementById("defectDescription").innerHTML.trim();
    var qualityCompletedBy = document.getElementById("completedByQI").textContent.trim();
    var qualityCompletedOn = document.getElementById("completedOnQI").textContent.trim();

    // Engineer-specific fields
    var reviewByCfEngineering = document.getElementById("reviewByCfEngineering")?.textContent.trim();
    var disposition = document.getElementById("disposition")?.textContent.trim();
    var engineerName = document.getElementById("engineerName")?.textContent.trim();
    var engCompletedBy = document.getElementById("completedByEng").textContent.trim();
    var engCompletedOn = document.getElementById("completedOnEng").textContent.trim();

    var thumbnailsContainer = document.getElementById("thumbnailsContainer");
    var thumbnail = thumbnailsContainer ? thumbnailsContainer.innerHTML : "";
    var thumbnailCount = thumbnailsContainer ? thumbnailsContainer.querySelectorAll('img').length : 0;

    var fileUploaded = "";
    if (thumbnailCount === 0) {
        fileUploaded = "No uploaded files.";
    } else if (thumbnailCount === 1) {
        fileUploaded = "1 file uploaded. See the second page for more.";
    } else {
        fileUploaded = `${thumbnailCount} files uploaded. See the second page for more.`;
    }

    var thumbnailData = [];

    if (thumbnailsContainer) {
        var fileItems = thumbnailsContainer.querySelectorAll(".file-item");

        fileItems.forEach((fileItem) => {
            var fileName = fileItem.querySelector("p")?.textContent.trim();
            var imgElement = fileItem.querySelector("img");
            var imgHtml = imgElement ? imgElement.outerHTML : "";
            thumbnailData.push({ fileName, imgHtml });
        });
    }

    // Format the extracted content for use in the template
    if(thumbnailCount !== 0){
    var thumbnailContent = thumbnailData.map(
        ({ fileName, imgHtml }) => `
            <div class="thumbnail-print">
                <p>${fileName}</p>
                ${imgHtml}
            </div>
        `
    ).join("");
    }else{
        thumbnailContent = "No images uploaded";
    }


    const header = `
                    <div class="header">
                        <div class="logo left">
                            <img src="images/logo.png" alt="Crossfire logo" data-tippy-content="Crossfire logo" height="74" width="345">
                        </div>
                        <div class="center">
                            <p class="title">Non-Conformance Report</p>
                        </div>
                        <div class="paging right">
                            <span>Page <span id="currentPage" class="current-page"></span> of <span class="page-count"></span></span>
                        </div>
                    </div>

                    <div>
                        <h1>Document No.: <span class="document-number">OPS-00011</span></h1>
                    </div>`;


    const pageTwo = "";
    if(thumbnailCount!==0){
     pageTwo = `
                <section>
                    ${header}

                    <div class="print-table">
                        <div class="ncr-layout-tb">
                            <div class="ncr-head">
                                <p>Uploaded Images:</p>
                            </div>
                                <div class="ncr-files">
                                    ${thumbnailContent}
                                </div>
                            </div>
                        </div>
                </section>
                `;
    }
    // Open a new window
    var printWindow = window.open("", "_blank");

    // Write the content and styles to the new window
    printWindow.document.open();
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>NCR - ${ncrNumber1}</title>
            <link href="styles/styles.css" rel="stylesheet">
            <style>
                body {
                    background-color: #fff;
                    width: 800px;
                    margin: 0 auto;
                }
            </style>
        </head>
        <body>
            <div class="print-pdf">
                <section>
                    ${header}
                    <div class="print-table">
                        <div class="four-cols">
                            <div class="ncr-layout-tb">
                                <div class="ncr-head">
                                    <p>NCR Number</p>
                                </div>
                                <div class="ncr-content">
                                    <p>${ncrNumber1}</p>
                                </div>
                            </div>
                            <div class="ncr-layout-tb">
                                <div class="ncr-head">
                                    <p>Date Created:</p>
                                </div>
                                <div class="ncr-content">
                                    <p>${dateCreated}</p>
                                </div>
                            </div>
                            <div class="ncr-layout-tb">
                                <div class="ncr-head">
                                    <p>Created By</p>
                                </div>
                                <div class="ncr-content">
                                    <p>${createdBy}</p>
                                </div>
                            </div>
                            <div class="ncr-layout-tb">
                                <div class="ncr-head">
                                    <p>Status</p>
                                </div>
                                <div class="ncr-content">
                                    <p>${ncrStatus}</p>
                                </div>
                            </div>
                        </div>

                        <div class="section-content">
                            <div class="section-head">
                                <span>Quality Representatitve</span>
                            </div>
                            <div class="section-body">
                                <div class="three-cols">
                                    <div class="ncr-layout-tb">
                                        <div class="ncr-head">
                                            <p>Applicable Process</p>
                                        </div>
                                        <div class="ncr-content">
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboSupplierRecInsp" ${appProcess.includes("Supplier or Rec-Insp") ? "checked" : ""}>
                                                <label for="cboSupplierRecInsp">Supplier or Rec-Insp</label>
                                            </div>
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboWIP" ${appProcess.includes("WIP (Production Order)") ? "checked" : ""}>
                                                <label for="cboWIP">WIP (Production Order)</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="ncr-layout-tb">
                                        <div class="ncr-head">
                                            <p>Supplier Name</p>
                                        </div>
                                        <div class="ncr-content">
                                            <p>${supplierName}</p>
                                        </div>
                                    </div>
                                    <div class="ncr-layout-lr lr-two-rows ">
                                        <div class="lr-item">
                                            <div class="ncr-head">
                                                <p>Production Number</p>
                                            </div>
                                            <div class="ncr-content">
                                                <p>${productionNumber}</p>
                                            </div>
                                        </div>
                                        <div class="lr-item">
                                            <div class="ncr-head">
                                                <p>Sales Order Number</p>
                                            </div>
                                            <div class="ncr-content">
                                                <p>${sonumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="three-cols cols-2-3">
                                    <div class="ncr-layout-tb">
                                        <div class="ncr-head">
                                            <p>Description of Item: <span>(Including SAP No.)</span></p>
                                        </div>
                                        <div class="ncr-content">
                                            <p>${itemDescription}</p>
                                        </div>
                                    </div>
                                    <div class="ncr-layout-tb">
                                        <div class="ncr-head">
                                            <p>Quantity Received</p>
                                        </div>
                                        <div class="ncr-content">
                                            <p>${qtyRecieved}</p>
                                        </div>
                                    </div>
                                    <div class="ncr-layout-tb">
                                        <div class="ncr-head">
                                            <p>Quantity Defective</p>
                                        </div>
                                        <div class="ncr-content">
                                            <p>${qtyDefect}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="ncr-layout-tb">
                                    <div class="ncr-head">
                                        <p>Description of Defect: <span>(in as much detail as possible)</span></p>
                                    </div>
                                    <div class="ncr-content">
                                        <p class="textarea">${defectDescription}</p>
                                    </div>
                                </div>
                                <div class="ncr-layout-tb">
                                    <div class="ncr-head">
                                        <p>Uploaded Images/Videos</p>
                                    </div>
                                    <div class="ncr-content">
                                        <p class="textarea-min">${fileUploaded}</p>
                                    </div>
                                </div>
                                <div class="two-cols">
                                    <div class="ncr-layout-tb">
                                        <div class="ncr-head">
                                            <p>Item market Non-conforming</p>
                                        </div>
                                        <div class="ncr-content two-cols">
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboItemConformingYes" ${itemConform === "Yes" ? "checked" : ""}>
                                                <label for="cboItemConformingYes">Yes</label>
                                            </div>
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboItemConformingNo" ${itemConform === "No" ? "checked" : ""}>
                                                <label for="cboItemConformingNo">No</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="ncr-layout-tb">
                                        <div class="ncr-head">
                                            <p>Forward to Engineering</p>
                                        </div>
                                        <div class="ncr-content two-cols">
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboItemConformingYes" ${engneeded === "Yes" ? "checked" : ""}>
                                                <label for="cboItemConformingYes">Yes</label>
                                            </div>
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboItemConformingNo" ${engneeded === "No" ? "checked" : ""}>
                                                <label for="cboItemConformingNo">No</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ncr-desc">
                                    <span>Completed NCR to be forwarded to HBC Engineering and Operations Manager complete with any relevant documents attached (pictures, actual measurements, material certs, etc.)</span>
                                </div>
                                <div class="ncr-layout-tb">
                                    <div class="ncr-content content-right">
                                        <p>Quality Representative's Name: <span class="right-item">${qualityCompletedBy}</span></p>
                                        <p class="right-date">Date: <span class="right-item">${qualityCompletedOn}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="section-content">
                            <div class="section-head">
                                <span>Engineering</span>
                            </div>
                            <div class="section-body">
                                <div class="ncr-layout-tb">
                                    <div class="ncr-head">
                                        <p>Review by CF Engineering <span>(indicate disposition by "checking" one of the following)</span></p>
                                    </div>
                                    <div class="ncr-content four-cols">
                                        <div class="content-checkbox">
                                            <input type="checkbox" id="cboEngUseAsIs" ${reviewByCfEngineering.includes("Use As Is") ? "checked" : ""}>
                                            <label for="cboEngUseAsIs">Use As Is</label>
                                        </div>
                                        <div class="content-checkbox">
                                            <input type="checkbox" id="cboEngRepair" ${reviewByCfEngineering.includes("Repair") ? "checked" : ""}>
                                            <label for="cboEngRepair">Repair</label>
                                        </div>
                                        <div class="content-checkbox">
                                            <input type="checkbox" id="cboEngRework" ${reviewByCfEngineering.includes("Rework") ? "checked" : ""}>
                                            <label for="cboEngRework">Rework</label>
                                        </div>
                                        <div class="content-checkbox">
                                            <input type="checkbox" id="cboEngScrap" ${reviewByCfEngineering.includes("Scrap") ? "checked" : ""}>
                                            <label for="cboEngScrap">Scrap</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="ncr-layout-lr">
                                    <div class="lr-item cols-2-1">
                                        <div class="ncr-head">
                                            <p>Does Customer require notification of NCR</p>
                                            <span>(If "Yes" then raise message to customer detailing issues)</span>
                                        </div>
                                        <div class="ncr-content two-cols">
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboEngCusNotifYes" ${customerNotif === "Yes" ? "checked" : ""}>
                                                <label for="cboEngCusNotifYes">Yes</label>
                                            </div>
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboEngCusNotifNo" ${customerNotif === "No" ? "checked" : ""}>
                                                <label for="cboEngCusNotifNo">No</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ncr-layout-tb">
                                    <div class="ncr-head">
                                        <p>Disposition <span>(Sequence of work steps required when"repair" or "rework" indicated)</span></p>
                                    </div>
                                    <div class="ncr-content">
                                        <p class="textarea">${disposition}</p>
                                    </div>
                                </div>
                                <div class="two-cols">
                                    <div class="ncr-layout-tb">
                                        <div class="ncr-head">
                                            <p>Does the drawing require updating?</p>
                                        </div>
                                        <div class="ncr-content two-cols">
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboDrawingReqYes" ${drawingUpdate === "Yes" ? "checked" : ""}>
                                                <label for="cboDrawingReqYes">Yes</label>
                                            </div>
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboDrawingReqNo" ${drawingUpdate === "No" ? "checked" : ""}>
                                                <label for="cboDrawingReqNo">No</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="ncr-layout-lr lr-two-rows">
                                        <div class="lr-item item-short">
                                            <div class="ncr-head">
                                                <p>Original Revision Number</p>
                                            </div>
                                            <div class="ncr-content">
                                                <p>${originalRevNumber}</p>
                                            </div>
                                        </div>
                                        <div class="lr-item item-short">
                                            <div class="ncr-head">
                                                <p>Updated Revision Number</p>
                                            </div>
                                            <div class="ncr-content">
                                                <p>${updatedRevNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ncr-layout-tb">
                                    <div class="ncr-content content-right">
                                        <p>Engineering: <span class="right-item">${engCompletedBy}</span></p>
                                        <p class="right-date">Date: <span class="right-item">${engCompletedOn}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="section-content">
                            <div class="section-head">
                                <span>Purchasing</span>
                            </div>
                            <div class="section-body">
                                <div class="two-cols">
                                    <div class="ncr-layout-tb">
                                        <div class="ncr-head">
                                            <p>Purchasing's Preliminary Decision</p>
                                        </div>
                                        <div class="ncr-content">
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboPurchReturn" ${preliminaryDecision.includes("Return to Supplier for either \"rework\" or \"replacement\"") ? "checked" : ""}>
                                                <label for="cboPurchReturn">Return to Supplier for either "rework" or "replacement"</label>
                                            </div>
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboPurchRework" ${preliminaryDecision.includes("Rework \"In-House\"") ? "checked" : ""}>
                                                <label for="cboPurchRework">Rework "In-House"</label>
                                            </div>
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboPurchScrap" ${preliminaryDecision.includes("Scrap in House") ? "checked" : ""}>
                                                <label for="cboPurchScrap">Scrap in House</label>
                                            </div>
                                            <div class="content-checkbox">
                                                <input type="checkbox" id="cboPurchDefer" ${preliminaryDecision.includes("Defer for HBC Engineering Review") ? "checked" : ""}>
                                                <label for="cboPurchDefer">Defer for HBC Engineering Review</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="two-cols cols-1-2">
                                            <div class="ncr-layout-tb">
                                                <div class="ncr-head">
                                                    <p>Was a CAR Raised?</p>
                                                </div>
                                                <div class="ncr-content two-cols">
                                                    <div class="content-checkbox">
                                                        <input type="checkbox" id="cboPurchRaisedYes" ${carRaised === "Yes" ? "checked" : ""}>
                                                        <label for="cboPurchRaisedYes">Yes</label>
                                                    </div>
                                                    <div class="content-checkbox">
                                                        <input type="checkbox" id="cboPurchRaisedNo" ${carRaised === "No" ? "checked" : ""}>
                                                        <label for="cboPurchRaisedNo">No</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="ncr-layout-tb">
                                                <div class="ncr-head">
                                                    <p>If "Yes" indicate CAR Number</p>
                                                </div>
                                                <div class="ncr-content">
                                                    <p>${carNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="two-cols cols-1-2">
                                            <div class="ncr-layout-tb">
                                                <div class="ncr-head">
                                                    <p>Follow-up Required?</p>
                                                </div>
                                                <div class="ncr-content two-cols">
                                                    <div class="content-checkbox">
                                                        <input type="checkbox" id="cboPurchFollowUpYes" ${followUp === "Yes" ? "checked" : ""}>
                                                        <label for="cboPurchFollowUpYes">Yes</label>
                                                    </div>
                                                    <div class="content-checkbox">
                                                        <input type="checkbox" id="cboPurchFollowUpNo" ${followUp === "No" ? "checked" : ""}>
                                                        <label for="cboPurchFollowUpNo">No</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="ncr-layout-tb">
                                                    <div class="ncr-head">
                                                        <p>If "Yes" indicate type</p>
                                                    </div>
                                                    <div class="ncr-content">
                                                        <p>${followUpType}</p>
                                                    </div>
                                                </div>
                                                <div class="ncr-layout-tb">
                                                    <div class="ncr-head">
                                                        <p>If "Yes" indicate expected date</p>
                                                    </div>
                                                    <div class="ncr-content">
                                                        <p>${followUpDate}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ncr-layout-tb">
                                    <div class="ncr-content content-right">
                                        <p>Operations Manager: <span class="right-item">${completedByPch}</span></p>
                                        <p class="right-date">Date: <span class="right-item">${completedOnPch}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ncr-layout-tb">
                            <div class="ncr-content content-left">
                                <p>NCR Closed:</p>
                                <div class="content-checkbox">
                                    <input type="checkbox" id="cboNCRClosed" ${ncrClosed === "Yes" ? "checked" : ""}>
                                    <label for="cboNCRClosed">Yes</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                ${pageTwo}
            </div>
        </body>
        </html>
    `);


    printWindow.document.close();

    // Wait for the new window to fully load, then print
    printWindow.onload = function () {
        setTimeout(() => {
            printWindow.print();
        }, 500);
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

    // Retrieve supplier and quality data from localStorage
    const supplier = JSON.parse(localStorage.getItem('supplier')) || [];
    const quality = JSON.parse(localStorage.getItem('quality')) || [];

    // Load or initialize stored suppliers with a Set to avoid duplicates
    let storedSuppliers = new Set(JSON.parse(localStorage.getItem('suppliers')) || []);
    if (storedSuppliers.size === 0) {
        supplier.forEach(item => storedSuppliers.add(item.supplierName));
        localStorage.setItem('suppliers', JSON.stringify([...storedSuppliers])); // Save to local storage
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
    supplierDropdown.addEventListener('change', function (event) {
        const supplierName = event.target.value;
        if (supplierName === 'custom') {
            const customSupplier = prompt('Please enter your supplier name:');
            if (customSupplier && !storedSuppliers.has(customSupplier)) {
                // Add new custom supplier to stored suppliers
                storedSuppliers.add(customSupplier);
                localStorage.setItem('suppliers', JSON.stringify([...storedSuppliers])); // Save updated list

                // Refresh dropdown with the updated list
                populateSupplierDropdown(elementID, ncrNumber);

                // Set the dropdown to the new supplier
                supplierDropdown.value = customSupplier;
                localStorage.setItem('selectedSupplier', customSupplier); // Save new selection
            }
        } else {
            localStorage.setItem('selectedSupplier', supplierName); // Save selected supplier
        }
    });
}


function populateSupplierDropdownN(elementID) {
    const supplierDropdown = document.getElementById(elementID);

    // Retrieve supplier and quality data from localStorage
    const supplier = JSON.parse(localStorage.getItem('supplier')) || [];
    const quality = JSON.parse(localStorage.getItem('quality')) || [];

    // Load or initialize stored suppliers
    let storedSuppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
    if (storedSuppliers.length === 0) {
        supplier.forEach(item => storedSuppliers.push(item.supplierName));
        localStorage.setItem('suppliers', JSON.stringify(storedSuppliers)); // Save to local storage
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

    const fileEmptyDesc = document.getElementById('fileEmptyDesc');
    if (fileEmptyDesc) {
        fileEmptyDesc.remove();
    }

    // Create elements for each thumbnail and delete button
    const fileItem = document.createElement('div');
    fileItem.classList.add('file-item');

    const thumbImgContainer = document.createElement('div');
    thumbImgContainer.classList.add('file-img-container');

    const imageLink = document.createElement('a');
    imageLink.href = "#";
    imageLink.target = '_blank';

    const thumbnailImage = document.createElement('img');
    thumbnailImage.src = fileObject.thumbnail;
    thumbnailImage.classList.add('thumbnail');

    thumbnailImage.title = "Click here to expand the image";
    thumbnailImage.setAttribute('aria-label', "Click here to expand the image");

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('file-btn-delete');
    deleteButton.title = "Click to delete this item";

    const imageName = document.createElement('p');
    const maxLength = 15;
    const truncatedName = fileObject.fileName.length > maxLength ?
        fileObject.fileName.substring(0, maxLength) + '...jpg' :
        fileObject.fileName;
    imageName.textContent = truncatedName;

    // Delete function removes the file item from both array and display
    deleteButton.addEventListener('click', () => {
        deleteFile(fileObject, fileItem);
    });

    imageLink.addEventListener('click', function () {
        const newWindow = window.open("", "_blank");

        newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${fileObject.fileName}</title>
                <style>
                    body {
                        margin: 0;
                        height: 100vh;
                        background-color: black;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        overflow: hidden;
                    }
                    img {
                        max-width: 90%;
                        max-height: 90%;
                        object-fit: contain;
                    }
                </style>
            </head>
            <body>
                <img src="${fileObject.thumbnail}" alt="${fileObject.fileName}" style="max-width: 100%; height: auto;">
            </body>
            </html>
        `);
        newWindow.document.close();
    });

    // Append elements to the file item
    fileItem.appendChild(imageName);
    imageLink.appendChild(thumbnailImage);
    thumbImgContainer.appendChild(imageLink);
    fileItem.appendChild(thumbImgContainer);
    fileItem.appendChild(deleteButton);

    // Append file item to thumbnails container
    thumbnailsContainer.appendChild(fileItem);
}

// Function to delete an uploaded file
function deleteFile(fileObject, fileItem) {
    // Remove fileObject from uploadedFiles array
    uploadedFiles.splice(uploadedFiles.indexOf(fileObject), 1);

    // Remove the file item from the display
    fileItem.remove();
    if (uploadedFiles.length == 0) {
        document.getElementById('thumbnailsContainer').innerHTML = `<p id="fileEmptyDesc" class="file-empty-desc">No files uploaded yet!</p>`;
    }
}

// Use the modified event listener for new file uploads
document.getElementById('attachedDocument')?.addEventListener('change', function () {
    const fileInput = document.getElementById('attachedDocument');
    const files = Array.from(fileInput.files);
    const validExtensions = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
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
        showToast(`These files are not allowed: ${invalidFiles.join(', ')}. Please upload only images.`, 'error', 5000);
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
                const thumbnailData = compressImage(img, 300, 300);

                const fileObject = { fileName: file.name, thumbnail: thumbnailData };
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
function compressImage(img, maxWidth, maxHeight) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const aspectRatio = img.width / img.height;

    if (img.width > img.height) {
        canvas.width = maxWidth;
        canvas.height = maxWidth / aspectRatio;
    } else {
        canvas.height = maxHeight;
        canvas.width = maxHeight * aspectRatio;
    }

    // Draw the image scaled to fit the thumbnail dimensions
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Return the thumbnail data URL (compressed as JPEG, adjust quality as needed)
    return canvas.toDataURL('image/jpeg', 0.6); // 0.7 is a good balance of quality and size
}


//==========================================================================================================================
//ENGINEER
//
//==============================================================================================================================

// ==========================================
// Engineer Populate Notifications - For all pages
// ==========================================
/*function populateNotificationsEng() {
    const dropdown = document.getElementById('notifList');
    const dropdownDesc = document.getElementById('notifDesc');
    if (!dropdown) {
        console.warn('Dropdown menu element not found.');
        return;
    }
    dropdown.innerHTML = ""; // Clear existing notifications

    const oldNotifications = getOldNotificationsEng();
    const closedNotifications = JSON.parse(localStorage.getItem('closedNotifications')) || [];

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

    dropdownDesc.innerHTML = "<p>Pending NCRs from Quality</p>"; // Text explaining urgency

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
            localStorage.setItem('closedNotifications', JSON.stringify(closedNotifications)); // Save to localStorage
            notificationItem.remove(); // Remove this notification item
            updateNotificationCountEng(); // Update the notification count
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
function updateNotificationCountEng() {
    const dropdown = document.getElementById('notifList');
    const countLabel = document.getElementById('spnCount');
    const currentCount = dropdown.children.length;
    countLabel.textContent = `${currentCount}`; // Update count label
}

// Supporting Function - Get Old Notifications
function getOldNotificationsEng() {

    return engineering.filter(item => item.ncrStatus === "Engineering")
        .map(item => item.ncrNumber);

}*/



//================================================================================================================
//POPULATE RECENT NCRs FOR ENGINEER
//
//=================================================================================================================

//================================================================================================================
//POPULATE NCR DETAILS FROM QUALITY FOR ENGINEER
//
//=================================================================================================================
function populateDetailsPageEng(ncrNumber) {
    const entry = quality.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        document.getElementById('ncrNumberE').textContent = entry.ncrNumber || "-";
        document.getElementById('dateCreatedE').textContent = formatDate(entry.dateCreated) || "-";
        document.getElementById('createdByE').textContent = entry.createdBy || "-";
        document.getElementById('ncrStatusE').textContent = entry.ncrStatus ?? "Quality";
        document.getElementById('applicableProcessE').textContent = entry.applicableProcess || "-";
        document.getElementById('supplierNameDE').textContent = entry.supplierName || "-";

        // Use nullish coalescing to handle missing or undefined values
        document.getElementById('poNumberE').textContent = entry.poNumber || "-";
        document.getElementById('soNumberE').textContent = entry.soNumber || "-";
        document.getElementById('quantityReceivedE').textContent = entry.quantityReceived || "-";
        document.getElementById('quantityDefectE').textContent = entry.quantityDefect || "-";
        document.getElementById('itemDescriptionE').innerHTML = entry.itemDescription.replace(/\n/g, '<br/>') || "-";
        document.getElementById('defectDescriptionE').innerHTML = entry.defectDescription.replace(/\n/g, '<br/>') || "-";

        // Assuming engineering is related to defect description, corrected as `engNeeded`
        document.getElementById('engNeededE').textContent = entry.engNeeded ?? "No";

        document.getElementById('itemConformE').textContent = entry.itemConform ?? "No";

        const documentFilesList = document.getElementById('thumbnailsContainerE');
        documentFilesList.innerHTML = ''; // Clear any existing content

        // Check if documentFiles exists and has items
        if (entry.documentFiles && entry.documentFiles.length > 0) {
            entry.documentFiles.forEach(file => {
                // Create elements for each thumbnail
                const fileItem = document.createElement('div');
                fileItem.classList.add('file-item');

                const thumbImgContainer = document.createElement('div');
                thumbImgContainer.classList.add('file-img-container');

                const imageLink = document.createElement('a');
                imageLink.href = "#";
                imageLink.target = '_blank';

                const thumbImage = document.createElement('img');
                thumbImage.src = file.thumbnail;
                thumbImage.classList.add('thumbnail');

                thumbImage.title = "Click here to expand the image";
                thumbImage.setAttribute('aria-label', "Click here to expand the image");


                const imageName = document.createElement('p');
                const maxLength = 15;
                const truncatedName = file.fileName.length > maxLength ?
                    file.fileName.substring(0, maxLength) + '...jpg' :
                    file.fileName;
                imageName.textContent = truncatedName;

                imageLink.addEventListener('click', function () {
                    const newWindow = window.open("", "_blank");

                    newWindow.document.write(`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>${file.fileName}</title>
                            <style>
                                body {
                                    margin: 0;
                                    height: 100vh;
                                    background-color: black;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    overflow: hidden;
                                }
                                img {
                                    max-width: 90%;
                                    max-height: 90%;
                                    object-fit: contain;
                                }
                            </style>
                        </head>
                        <body>
                            <img src="${file.thumbnail}" alt="${file.fileName}" style="max-width: 100%; height: auto;">
                        </body>
                        </html>
                    `);
                    newWindow.document.close();
                });

                // Append elements to the file item
                fileItem.appendChild(imageName);
                imageLink.appendChild(thumbImage);
                thumbImgContainer.appendChild(imageLink);
                fileItem.appendChild(thumbImgContainer);

                documentFilesList.appendChild(fileItem); // Append file item to the container
            });
        } else {
            documentFilesList.innerHTML = 'No uploaded files.'; // Handle no files case
        }

        document.getElementById('completedByQIE').textContent = entry.completedBy ?? "";
        document.getElementById('completedOnQIE').textContent = entry.completedOn ? formatDate(entry.completedOn) : "";

    }
}

//================================================================================================================
///POPULATE DETAILS PAGE OF ENGINEER'S PORTION OF NCR
//
//=================================================================================================================
function populateEngDetailsPage(ncrNumber) {
    const entry = engineering.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        document.getElementById('reviewByCfEngineering').textContent = entry.reviewByCfEngineering || "-";
        document.getElementById('customerNotification').textContent = entry.customerNotification || "-";
        document.getElementById('disposition').innerHTML = entry.disposition.replace(/\n/g, '<br/>') || "-";
        document.getElementById('drawingUpdate').textContent = entry.drawingUpdate || "-";
        document.getElementById('originalRevNumber').textContent = entry.originalRevNumber || "-";
        document.getElementById('updatedRevNumber').textContent = entry.updatedRevNumber || "-";
        document.getElementById('revisionDate').textContent = entry.revisionDate ? formatDate(entry.revisionDate) : "-";
        document.getElementById('engineerName').textContent = entry.engineerName || "-";
        if (entry.drawingUpdate == "No") {
            // Array.from(document.getElementsByClassName('drawingUpdateToggle')).forEach(element => {
            //     element.classList.add('non');
            // });

            document.getElementById('eDrawingUpdateToggle').classList.add('non')
        }

        document.getElementById('completedByEng').textContent = entry.completedBy ?? "";
        document.getElementById('completedOnEng').textContent = entry.completedOn ? formatDate(entry.completedOn) : "";

        if (entry.ncrStatus != "Engineering") {
            document.getElementById('eCompletionToggle').classList.add("non");
        }

        //hide print button unless NCR is closed
        if (entry.ncrStatus != "Close") {
            document.getElementById('printButtonEng').classList.add("non");
        }
    }
}

//================================================================================================================
//POPULATE EDIT PAGE OF ENGINEER'S PORTION OF NCR
//
//=================================================================================================================
function populateEngEditPage(ncrNumber) {
    //document.getElementById('createEditNCR').innerHTML = 'Edit NCR';
    //document.getElementById('create-edit')
    //document.getElementById('lblCreateEditNCR').innerHTML = 'Edit NCR';
    populateDetailsPageEng(ncrNumber)
    document.getElementById('engDetailsForm').style.display = 'none'

    const entry = engineering.find(item => item.ncrNumber === ncrNumber);
    if (entry) {

        //document.getElementById('ncrNumberEng').textContent = entry.ncrNumber;
        document.getElementById('reviewByCfEngineering').value = entry.reviewByCfEngineering;
        document.getElementById('customerNotification').value = entry.customerNotification;
        document.getElementById('disposition').textContent = entry.disposition;
        document.getElementById('drawingUpdate').value = entry.drawingUpdate;
        document.getElementById('completedByEng').value = entry.completedBy ? entry.completedBy : "";
        document.getElementById('completedOnEng').value = entry.completedOn ? formatDate(entry.completedOn) : "";


        if (entry.ncrStatus != "Engineering") {
            document.getElementById('eCompletionToggle').classList.remove("non");
            document.getElementById('btnEngSubmit').style.display = 'none';
        }

        if (entry.drawingUpdate === "Yes") {
            document.getElementById('originalRevNumber').value = entry.originalRevNumber;
            document.getElementById('updatedRevNumber').value = entry.updatedRevNumber;

            document.getElementById('revisionDate').value = entry.revisionDate ? setDate(entry.revisionDate) : "";
            document.getElementById('engineerName').value = entry.engineerName;


        } else {
            document.getElementById('revisionDate').value = '';
            document.getElementById('originalRevNumber').value = '';
            document.getElementById('updatedRevNumber').value = '';
            document.getElementById('engineerName').value = '';

            // Disable the fields
            // document.getElementById('originalRevNumber').disabled = true;
            // document.getElementById('updatedRevNumber').disabled = true;
            // document.getElementById('revisionDate').disabled = true;
            // document.getElementById('engineerName').disabled = true;

            Array.from(document.getElementsByClassName('drawingUpdateToggle2')).forEach(element => {
                element.style.display = 'none';
            });

        }
    }
    //console.log(entry);
}


//================================================================================================================
//EVENT LISTENER FOR YES/NO TO UPDATE DRAWINGS - ENGINEER
//
//=================================================================================================================
let prevOriginalRevNumber = "";
let prevUpdatedRevNumber = "";
let prevRevisionDate = "";
let prevEngineerName = "";

// Event listener for drawingUpdate
document.getElementById('drawingUpdate')?.addEventListener('change', (event) => {
    const drawingUpdate = event.target.value;

    if (drawingUpdate === "No") {
        // Store the current values before clearing them
        prevOriginalRevNumber = document.getElementById('originalRevNumber').value;
        prevUpdatedRevNumber = document.getElementById('updatedRevNumber').value;
        prevRevisionDateRaw = document.getElementById('revisionDate').value;
        prevRevisionDate = prevRevisionDateRaw ? correctDate(prevRevisionDateRaw) : "";
        prevEngineerName = document.getElementById('engineerName').value;

        // Disable the fields
        // document.getElementById('originalRevNumber').disabled = true;
        // document.getElementById('updatedRevNumber').disabled = true;
        // document.getElementById('revisionDate').disabled = true;
        // document.getElementById('engineerName').disabled = true;
        Array.from(document.getElementsByClassName('drawingUpdateToggle2')).forEach(element => {
            element.style.display = 'none';
        });

        // Clear the fields
        document.getElementById('originalRevNumber').value = "";
        document.getElementById('updatedRevNumber').value = "";
        document.getElementById('revisionDate').value = "";
        document.getElementById('engineerName').value = "";





        /*Array.from(document.getElementsByClassName('drawingUpdateToggle2')).forEach(element => {
                element.style.display = 'none';
            });*/

    } else if (drawingUpdate === "Yes") {

        // Enable the fields
        // document.getElementById('originalRevNumber').disabled = false;
        // document.getElementById('updatedRevNumber').disabled = false;
        // document.getElementById('revisionDate').disabled = false;
        // document.getElementById('engineerName').disabled = false;

        Array.from(document.getElementsByClassName('drawingUpdateToggle2')).forEach(element => {
            element.style.display = 'block';
        });


        // Restore previous values if "Yes" is selected
        document.getElementById('originalRevNumber').value = prevOriginalRevNumber;
        document.getElementById('updatedRevNumber').value = prevUpdatedRevNumber;
        document.getElementById('revisionDate').value = setDate(prevRevisionDate);
        document.getElementById('engineerName').value = prevEngineerName;
    }
});

//================================================================================================================
//SAVE ENGINEER'S PORTION OF NCR
//
//=================================================================================================================
function saveEngNCR() {

    const ncrNumber = document.getElementById('ncrNumberE').textContent;
    const changedBy = getUserName();
    const reviewByCfEngineering = document.getElementById('reviewByCfEngineering').value;
    const customerNotification = document.getElementById('customerNotification').value;
    const disposition = document.getElementById('disposition').value;
    const drawingUpdate = document.getElementById('drawingUpdate').value;
    const originalRevNumber = document.getElementById('originalRevNumber').value;
    const updatedRevNumber = document.getElementById('updatedRevNumber').value;
    const revisionDateRaw = document.getElementById('revisionDate').value;
    const revisionDate = revisionDateRaw ? correctDate(revisionDateRaw) : "";
    const engineerName = document.getElementById('engineerName').value;

    const engineeringEntry = engineering.find(entry => entry.ncrNumber === ncrNumber);


    if (engineeringEntry) {
        // Check for changes in all relevant fields
        const noChanges = (
            engineeringEntry.reviewByCfEngineering === reviewByCfEngineering &&
            engineeringEntry.customerNotification === customerNotification &&
            engineeringEntry.disposition === disposition &&
            engineeringEntry.drawingUpdate === drawingUpdate &&
            engineeringEntry.originalRevNumber === originalRevNumber &&
            engineeringEntry.updatedRevNumber === updatedRevNumber &&
            engineeringEntry.engineerName === engineerName &&
            engineeringEntry.revisionDate === revisionDate

        );

        if (noChanges) {
            showToast('No changes were made.', 'info', 5000);
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
                engineeringEntry.updatedRevNumber = updatedRevNumber;
                engineeringEntry.revisionDate = revisionDate;
                engineeringEntry.engineerName = engineerName;
            } else {
                engineeringEntry.originalRevNumber = "";
                engineeringEntry.updatedRevNumber = "";
                engineeringEntry.revisionDate = "";
                engineeringEntry.engineerName = "";
            }
            localStorage.setItem('engineering', JSON.stringify(engineering));

            //update lastUpdated in NCRLog
            const ncrLogEntry = ncrLog.find(entry => entry.ncrNumber === ncrNumber);
            if (ncrLogEntry) { ncrLogEntry.lastUpdated = date }
            localStorage.setItem('ncrLog', JSON.stringify(ncrLog));

            const historyEntry = {
                ncrNumber: ncrNumber,
                actionType: "Edit",
                status: 'Open',
                actionDescription: `NCR edited by ${getUserRole()}`,
                changedBy: changedBy,
                changedOn: Timestamp()
            };

            history.push(historyEntry);
            localStorage.setItem('history', JSON.stringify(history));

            showToast('Your changes have been saved. You can continue later.', 'success', 5000);
            window.history.back();
            console.log(typeof (revisionDate), revisionDate)
        } else {
            showToast("Save operation cancelled.", 'info', 5000);
        }
    } else {
        showToast('NCR not found. Please check the NCR number.', 'error', 5000);
    }
    //console.log(engineering);
    //console.log(typeof(revisionDate), revisionDate)

}

//================================================================================================================
//SUBMIT ENGINEER'S PORTION OF NCR
//
//=================================================================================================================
function submitEngNCR() {

    const ncrNumber = document.getElementById('ncrNumberE').textContent;
    const changedBy = getUserName();
    const date = Timestamp();
    const reviewByCfEngineering = document.getElementById('reviewByCfEngineering').value;
    const customerNotification = document.getElementById('customerNotification').value;
    const disposition = document.getElementById('disposition').value;
    const drawingUpdate = document.getElementById('drawingUpdate').value;
    const originalRevNumber = document.getElementById('originalRevNumber').value;
    const updatedRevNumber = document.getElementById('updatedRevNumber').value;
    const revisionDateRaw = document.getElementById('revisionDate').value;
    const revisionDate = revisionDateRaw ? correctDate(revisionDateRaw) : "";
    const engineerName = document.getElementById('engineerName').value;

    // Validation rules for the form fields
    const validationRules = [
        {
            id: 'reviewByCfEngineering-error',
            targetId: 'reviewByCfEngineering',
            condition: () => reviewByCfEngineering === '', // Check if dropdown is empty
            message: 'Review by CF Engineering is required.',
            eventType: 'change' // Dropdown: listen for 'change'
        },
        {
            id: 'disposition-error',
            targetId: 'disposition',
            condition: () => !disposition, // Check if disposition is empty
            message: 'Disposition is required.',
            eventType: 'input' // Dropdown: listen for 'change'
        },
        {
            id: 'originalRevNumber-error',
            targetId: 'originalRevNumber',
            condition: () => drawingUpdate === "Yes" && !originalRevNumber, // Check if original revision number is missing
            message: 'Original Revision number is required.',
            eventType: 'input' // Textbox: listen for 'input'
        },
        {
            id: 'updatedRevNumber-error',
            targetId: 'updatedRevNumber',
            condition: () => drawingUpdate === "Yes" && !updatedRevNumber, // Check if updated revision number is missing
            message: 'Updated Revision Number is required.',
            eventType: 'input' // Textbox: listen for 'input'
        },
        {
            id: 'revisionDate-error',
            targetId: 'revisionDate',
            condition: () => drawingUpdate === "Yes" && revisionDate === "", // Check if revision date is missing
            message: 'Revision Date is required.',
            eventType: 'input' // Textbox: listen for 'input'
        },
        {
            id: 'engineerName-error',
            targetId: 'engineerName',
            condition: () => drawingUpdate === "Yes" && !engineerName, // Check if engineer name is missing
            message: 'Name of the Engineer is required.',
            eventType: 'input' // Textbox: listen for 'input'
        }
    ];

    // Perform validation
    let isValid = true;

    validationRules.forEach(validation => {
        const fieldElement = document.getElementById(validation.targetId);
        const errorElement = document.getElementById(validation.id);

        // Clear previous messages and styles
        if (errorElement) errorElement.remove();
        if (fieldElement) fieldElement.style.border = '';

        // Apply validation
        if (validation.condition()) {
            isValid = false;

            // Display error message
            const errorDiv = document.createElement('div');
            errorDiv.id = validation.id;
            errorDiv.style.color = '#B22222';
            errorDiv.style.fontSize = '16px';
            errorDiv.textContent = validation.message;
            fieldElement.parentNode.appendChild(errorDiv);

            // Highlight border
            fieldElement.style.border = '3px solid #B22222';

            // Add real-time error clearing for dropdowns and text fields
            if (validation.eventType === 'change') {
                fieldElement.addEventListener('change', function clearError() {
                    const fieldValue = fieldElement.value;
                    if (fieldValue !== '' && fieldValue !== 'default') { // Adjust 'default' as needed
                        const errorElement = document.getElementById(validation.id);
                        if (errorElement) errorElement.remove();
                        fieldElement.style.border = '';
                        fieldElement.removeEventListener('change', clearError);
                    }
                });

            }
            // For textboxes (input event)
            else if (validation.eventType === 'input') {
                fieldElement.addEventListener('input', function clearError() {
                    const fieldValue = fieldElement.value;
                    if (fieldValue !== '' && fieldValue !== 'default') { // Adjust 'default' as needed
                        const errorElement = document.getElementById(validation.id);
                        if (errorElement) errorElement.remove();
                        fieldElement.style.border = '';
                        fieldElement.removeEventListener('input', clearError);
                    }
                });
            }
        }
    });

    // If any validation fails, stop the submission
    if (!isValid) return;

    const confirmation = confirm("Are you sure you want to submit the NCR?");
    if (confirmation) {
        // Update the corresponding NCR in the quality array
        const engineeringEntry = engineering.find(entry => entry.ncrNumber === ncrNumber);

        const qualityEntry = quality.find(entry => entry.ncrNumber === ncrNumber);

        if (qualityEntry) {
            qualityEntry.ncrStatus = "Purchasing";
        }
        localStorage.setItem('quality', JSON.stringify(quality));



        if (engineeringEntry) {
            engineeringEntry.reviewByCfEngineering = reviewByCfEngineering;
            engineeringEntry.customerNotification = customerNotification;
            engineeringEntry.disposition = disposition;
            engineeringEntry.drawingUpdate = drawingUpdate;
            engineeringEntry.ncrStatus = quality.find(item => item.ncrNumber === ncrNumber)?.ncrStatus;
            engineeringEntry.engineerName = changedBy;
            engineeringEntry.originalRevNumber = originalRevNumber;
            engineeringEntry.updatedRevNumber = updatedRevNumber;
            engineeringEntry.revisionDate = revisionDate;
            engineeringEntry.engineerName = engineerName;
            engineeringEntry.completedBy = changedBy;
            engineeringEntry.completedOn = date;
        }
        localStorage.setItem('engineering', JSON.stringify(engineering));

        const purchasingEntry = {
            ncrNumber: ncrNumber,
            ncrStatus: qualityEntry.ncrStatus,
            preliminaryDecision: "",
            carRaised: "",
            carNumber: "",
            followUp: "",
            followUpType: "",
            followUpDate: "",
            ncrClosed: "",
            completedBy: "",
            completedOn: ""
        }
        purchasing.push(purchasingEntry);
        localStorage.setItem('purchasing', JSON.stringify(purchasing));

        //update lastUpdated in NCRLog
        const ncrLogEntry = ncrLog.find(entry => entry.ncrNumber === ncrNumber);
        if (ncrLogEntry) { ncrLogEntry.lastUpdated = date }
        localStorage.setItem('ncrLog', JSON.stringify(ncrLog));

        //make history array and push to history json
        const historyEntry = {
            ncrNumber: ncrNumber,
            actionType: "Submit",
            status: 'Open',
            actionDescription: "NCR submitted from Engineering to Purchasing",
            changedBy: changedBy,
            changedOn: date
        }
        history.push(historyEntry);
        localStorage.setItem('history', JSON.stringify(history));

        // Send email notification to Purchasing team
        //sendEmailNotification(ncrNumber, 'No'); // 'No' sends email to Purchasing

        showToast('NCR has been successfully submitted.', 'success', 5000);
        window.history.back();

    } else {
        // If the user cancels, do nothing or add custom logic
        showToast("Submit operation cancelled.", 'info', 5000);
        // Redirect or perform other actions as needed
        return;
    }
}


//================================================================================================================
//SUPPORTING FUNCTIONS FOR ENGINEER'S PORTION OF NCR
//
//=================================================================================================================

//Function to Set Date to Date input for Revision Date of NCR
function setDate(dateString) {
    //const newDate = dateString.replace(/-/g, '/')
    const [month, day, year] = dateString.split('/'); // Split the string into parts
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Convert to MM-DD-YYYY to suit data in json.
}
function correctDate(dateString) {
    //const newDate = dateString.replace(/-/g, '/')
    const [year, month, day] = dateString.split('-'); // Split the string into parts
    return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`; // Convert to MM-DD-YYYY to suit data in json.
}


//FUNCTION TO CHANGE NAVIGATION LINKS BASED ON USER
function updateNavLinks(userRole) {
    //const homeLink = document.getElementById('homeLi');
    const createLink = document.getElementById('createLi') || "";
    const createSkip = document.getElementById('createSkip') || "";
    const metricsLink = document.getElementById('metricsLi') || "";
    //const viewLink = document.getElementById('viewLi');
    //const reportsLink = document.getElementById('reports');

    // Hide link if the user is not an admin
    if (userRole == "Engineer" || userRole == "Purchasing") {
        createLink.classList = 'nav-hide';
        createSkip.classList = 'nav-hide';
    }
    if (userRole == "Quality" || userRole == "Engineering") {
        metricsLink.classList = 'nav-hide';
    }
}

function performSearchEng() {
    const ncrNumber = document.getElementById('ncrNumberEng').value.trim();
    const ncrStatus = document.getElementById("ncrStatusEng").value || "Engineering";
    const fromDate = document.getElementById('fromDateEng').value;
    const toDate = document.getElementById('toDateEng').value;
    const supplierName = document.getElementById('supplierNameEng').value;

    //const resultsCountMessage = document.getElementById('noResultsMessage');

    // Date validation
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        //resultsCountMessage.textContent = 'Start date must be earlier than or equal to end date.';
        //resultsCountMessage.style.display = 'inline';
        //return;

        showToast("Start date must be earlier than or equal to end date.", "error", 5000)
        //();
        return;
    }
    if (ncrNumber && /[a-zA-Z]/.test(ncrNumber)) {
        //resultsCountMessage.textContent = 'NCR Number must not contain alphabetic characters.';
        //resultsCountMessage.style.display = 'inline';

        showToast("NCR Number must not contain alphabetic characters.", "error", 5000)
        //location.reload();
        return;
    } /*else {
        resultsCountMessage.style.display = 'none';
    }*/


    const uniqueEngineering = Array.from(new Map(ncrLog.map(item => [item.ncrNumber, item])).values())
        .sort((a, b) => {
            const numA = parseInt(a.ncrNumber.split('-')[1], 10);
            const numB = parseInt(b.ncrNumber.split('-')[1], 10);
            return numB - numA;
        });

    const fromDateObj = fromDate ? new Date(fromDate + 'T00:00:00') : null;
    const toDateObj = toDate ? new Date(toDate + 'T23:59:59') : null;

    // Define your filtered results with the updated logic
    const filteredResults = uniqueEngineering.filter(item => {
        const isNcrNumberValid = ncrNumber ? item.ncrNumber.includes(ncrNumber) : true;

        const qualityItem = quality.find(qItem => qItem.ncrNumber === item.ncrNumber);

        // If ncrStatus is "All", don't filter by status, else filter by the selected ncrStatus
        const isStatusValid = (ncrStatus === "All" || qualityItem && qualityItem.ncrStatus === ncrStatus);

        // Validate supplier name if provided
        const isSupplierNameValid = supplierName ? qualityItem.supplierName === supplierName : true;

        const itemDateCreated = new Date(item.dateCreated);
        const isDateCreatedValid = (
            (fromDateObj ? itemDateCreated >= fromDateObj : true) &&
            (toDateObj ? itemDateCreated <= toDateObj : true)
        );

        // Return true if all conditions are valid
        return isNcrNumberValid && isSupplierNameValid && isStatusValid && isDateCreatedValid;
    });

    const totalResults = filteredResults.length;

    // Display results based on current page
    const tableBody = document.getElementById("viewTableContentEng");
    const paginatedResults = filteredResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
    const paginationContainer = document.getElementById("paginationEng");

    tableBody.innerHTML = ''; // Clear previous results

    paginatedResults.forEach(result => {
        const ncrStatusEng = quality.find(q => q.ncrNumber === result.ncrNumber)?.ncrStatus || '';

        const newRow = `<tr>
                            <td data-tippy-content="NCR Number - ${result.ncrNumber}">${result.ncrNumber}</td>
                             <td data-tippy-content="Supplier - ${((quality.find(q => q.ncrNumber === result.ncrNumber)?.supplierName)) || ''}">${((quality.find(q => q.ncrNumber === result.ncrNumber)?.supplierName)) || ''}</td>
                             <td data-tippy-content="Date Created - ${formatDate(ncrLog.find(q => q.ncrNumber === result.ncrNumber).dateCreated)}">
                                ${formatDate(ncrLog.find(q => q.ncrNumber === result.ncrNumber).dateCreated)}
                            </td>
                            <td data-tippy-content="Status - ${ncrStatusEng}">${ncrStatusEng}</td>
                            <td>
                                <div>
                                    <button data-tippy-content="Details for ${result.ncrNumber}" onclick="detailsEntry('${result.ncrNumber}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <title>Details Icon</title>
                                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        </svg>
                                        Details
                                    </button>
                                    ${ncrStatusEng !== 'Closed' && ncrStatusEng !== 'Purchasing' && ncrStatusEng !== 'Quality' ? `<button data-tippy-content="Edit ${result.ncrNumber}" onclick="editEntryEng('${result.ncrNumber}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <title>Edit Icon</title>
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                        </svg>
                                        Edit
                                    </button>` : ''}
                                    ${ncrStatusEng === 'Closed' ? `<button data-tippy-content="Download PDF for ${result.ncrNumber}" onclick="downloadEntry('${result.ncrNumber}')">
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <title>Download PDF Icon</title>
                                        <path stroke="currentColor" stroke-width="2" d="M5 12l7 7 7-7M12 19V5"/>
                                    </svg>
                                    Download PDF
                                </button>` : ''}
                                </div>
                            </td>
                        </tr>`;
        tableBody.innerHTML += newRow; // Add new row to table
    });

    // Setup pagination
    setupPagination(totalResults, performSearchEng, "viewTableContentEng", "paginationEng");

    if (totalResults === 0) {
        // Show a placeholder row in the table with a magnifying glass icon
        tableBody.innerHTML = `
           <tr>
               <td colspan="5" style="text-align: center; padding: 20px; color: #666; font-style: italic; font-size: 16px; background-color: #f9f9f9;">
                   <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 10px; color: #888;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m2.1-5.45a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/>
                   </svg>
                   No results found.
               </td>
           </tr>`;
        paginationContainer.style.display = 'none'; // Hide pagination
        return;
    }
}


//=================
//   Account Page
//================

// Load user data and populate the profile settings page
function loadProfileSettings(loggedInUser) {
    if (!loggedInUser) return;

    // Update display elements
    document.getElementById('userFullnameProfilePage').textContent =
        `${loggedInUser.user_Firstname} ${loggedInUser.user_Middlename || ''} ${loggedInUser.user_Lastname}`.trim();

    document.getElementById('usernameInput').value = loggedInUser.user_name;
    document.getElementById('firstnameInput').value = loggedInUser.user_Firstname;
    document.getElementById('middlenameInput').value = loggedInUser.user_Middlename || '-';
    document.getElementById('lastnameInput').value = loggedInUser.user_Lastname;
    document.getElementById('emailInput').value = loggedInUser.email;
    document.getElementById('passwordInput').value = loggedInUser.password;
    document.getElementById('roleInput').value = loggedInUser.Department_Name;
    document.getElementById('genderInput').value = loggedInUser.gender;

    document.getElementById('username').textContent = loggedInUser.user_name;



    // Set the profile picture
    const profilePicSrc = loggedInUser.profilePicture ||
        (loggedInUser.gender.toLowerCase() === 'male' ? 'images/user-profile_v1.png' : 'images/user-profile.png');
    document.getElementById('profilePagePic').src = profilePicSrc;
}

// Toggle edit mode on the profile settings page
function toggleEditMode(loggedInUser) {
    // const displayFields = document.querySelectorAll('.user-fullname, .user-role');
    // const editFields = document.querySelectorAll('.editable-field, #togglePassword');

    const updatedUser = JSON.parse(localStorage.getItem('loggedInUser'));


    //document.getElementById('userFullnameProfilePage').style.display = 'none';
    document.getElementById('usernameInput').disabled = false;
    document.getElementById('firstnameInput').disabled = false;
    document.getElementById('middlenameInput').disabled = false;
    document.getElementById('lastnameInput').disabled = false;
    document.getElementById('emailInput').disabled = false;
    document.getElementById('passwordInput').disabled = false;
    document.getElementById('genderInput').disabled = false;

    //document.getElementById('username').style.display = 'none';
    document.getElementById('togglePassword').style.display = 'block';

    document.getElementById('editprofileButton').style.display = 'none';
    document.getElementById('saveprofileButton').style.display = 'block';
    document.getElementById('cancelprofileButton').style.display = 'block';
    document.getElementById('editIcon').style.display = 'block';
    document.getElementById('roleMessage').style.display = 'block';


    const profilePagePic = document.getElementById('profilePagePic');
    tempProfilePicture = profilePagePic.src;

    //initialising the password visibility
    initializePasswordToggle();
}

// Save profile changes and persist to localStorage
function saveProfileSettings(loggedInUser) {
    const updatedUser = {
        ...loggedInUser,
        user_name: document.getElementById('usernameInput').value,
        user_Firstname: document.getElementById('firstnameInput').value,
        user_Middlename: document.getElementById('middlenameInput').value || '-',
        user_Lastname: document.getElementById('lastnameInput').value,
        email: document.getElementById('emailInput').value,
        password: document.getElementById('passwordInput').value,
        gender: document.getElementById('genderInput').value,

    };

    // Validate required fields
    if (!updatedUser.user_Firstname || !updatedUser.user_Lastname || !updatedUser.email || !updatedUser.password || !updatedUser.user_name) {
        showToast("Please fill in all required fields.", 'error', 5000);
        return;
    }
    const profilePagePic = document.getElementById('profilePagePic');
    loggedInUser.profilePicture = profilePagePic.src;
    profilePic.src = profilePagePic.src;

    // Update `loggedInUser` in localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

    // Update the users array in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.user_name === loggedInUser.user_name);



    if (userIndex !== -1) {
        // Update the specific user in the users array
        users[userIndex] = updatedUser;
    } else {
        // Add the user if it doesn't exist (unlikely scenario but included for completeness)
        users.push(updatedUser);
    }

    // Save the updated users array back to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    showToast("Profile updated successfully!", 'success', 5000);
    location.reload();
}


// Cancel editing and revert to original values
function cancelEditMode(loggedInUser) {
    loadProfileSettings(loggedInUser);


    document.getElementById('userFullnameProfilePage').style.display = 'block';
    document.getElementById('usernameInput').disabled = true;
    document.getElementById('firstnameInput').disabled = true;
    document.getElementById('middlenameInput').disabled = true;
    document.getElementById('lastnameInput').disabled = true;
    document.getElementById('emailInput').disabled = true;
    document.getElementById('passwordInput').disabled = true;
    document.getElementById('roleInput').value = loggedInUser.Department_Name;
    document.getElementById('genderInput').disabled = true;

    document.getElementById('username').style.display = 'block';

    document.getElementById('editprofileButton').style.display = 'block';
    document.getElementById('saveprofileButton').style.display = 'none';
    document.getElementById('cancelprofileButton').style.display = 'none';
    document.getElementById('editIcon').style.display = 'none';
    document.getElementById('roleMessage').style.display = 'none';



    document.getElementById('togglePassword').style.display = 'none';

    document.getElementById('userFullnameProfilePage').textContent =
        `${loggedInUser.user_Firstname} ${loggedInUser.user_Middlename || ''} ${loggedInUser.user_Lastname}`.trim();

    document.getElementById('usernameInput').value = loggedInUser.user_name;
    document.getElementById('firstnameInput').value = loggedInUser.user_Firstname;
    document.getElementById('middlenameInput').value = loggedInUser.user_Middlename || '-';
    document.getElementById('lastnameInput').value = loggedInUser.user_Lastname;
    document.getElementById('emailInput').value = loggedInUser.email;
    document.getElementById('passwordInput').value = loggedInUser.password;
    document.getElementById('roleInput').value = loggedInUser.Department_Name;
    document.getElementById('genderInput').value = loggedInUser.gender;

    document.getElementById('username').textContent = loggedInUser.user_name;

    const profilePagePic = document.getElementById('profilePagePic');
    profilePagePic.src = tempProfilePicture;
    profilePic.src = profilePagePic.src;

}

//Function for the password visibilities.
function initializePasswordToggle() {
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("passwordInput");

    // Remove previous listeners to avoid duplication
    togglePassword.replaceWith(togglePassword.cloneNode(true));
    const newTogglePassword = document.getElementById("togglePassword");

    // Attach click event listener for toggling password visibility
    newTogglePassword.addEventListener('click', function () {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.style.color = (type === 'text') ? 'black' : 'gray';
    });
}



function handleProfilePictureChange(loggedInUser) {
    const editIcon = document.getElementById('editIcon'); // The pencil icon
    const imageUpload = document.getElementById('imageUpload'); // The hidden file input
    const profilePagePic = document.getElementById('profilePagePic'); // The profile picture on the profile page
    const profilePic = document.getElementById('profilePic'); // The profile picture in the header

    // Handle the pencil icon click event
    editIcon.addEventListener('click', () => {
        imageUpload.click(); // Trigger the file input dialog
    });

    // Handle the file selection and preview
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const newProfilePicture = e.target.result; // Base64 URL of the image
                profilePagePic.src = newProfilePicture; // Update the profile picture preview
                profilePic.src = newProfilePicture; // Update the header profile picture

                // Persist the new profile picture to loggedInUser and localStorage
                loggedInUser.profilePicture = newProfilePicture;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            };

            reader.readAsDataURL(file); // Read the file as a Data URL
        }
    });


}

//======================
// Notifications 
//======================
// Function to update the visibility of the notification button
function updateNotificationButton() {
    const profileButton = document.getElementById("btnNotification"); // Notification button
    const savedState = localStorage.getItem("toggleState"); // Read state from localStorage
    const isVisible = savedState === "true"; // Check if the state is true or false
    const notifSettingsMessage = document.getElementById("notifSettingsMessage"); // Notification message

    if (profileButton) {
        // Show or hide the button based on the toggle state
        profileButton.style.display = isVisible ? "block" : "none";
    } else {
        console.warn("#btnNotification not found on this page.");
    }
    if (notifSettingsMessage) {
        //notifSettingsMessage.style.display = isVisible ? "inline" : "none";
        notifSettingsMessage.textContent = isVisible
            ? "Notifications are enabled"
            : "Notifications are disabled";
    } else {
        console.warn("#notifSettingsMessage not found on this page.");
    }
}

// Function to initialize the toggle switch and its behavior
function initializeNotificationToggle() {
    const toggleSwitch = document.getElementById("toggleSwitch"); // The toggle button element

    // Step 1: Check the saved toggle state in localStorage
    let savedState = localStorage.getItem("toggleState");
    if (savedState === null) {
        savedState = "true"; // Default to "checked" on the first app load
        localStorage.setItem("toggleState", savedState); // Save default state
    }

    // Step 2: Set the toggle switch state if it exists on the current page
    if (toggleSwitch) {
        toggleSwitch.checked = savedState === "true"; // Set the toggle state on the page

        // Add event listener to handle changes
        toggleSwitch.addEventListener("change", () => {
            const isVisible = toggleSwitch.checked; // Get the new state of the toggle
            localStorage.setItem("toggleState", isVisible); // Save the new state to localStorage
            updateNotificationButton(); // Update button visibility immediately
        });
    }

    // Step 3: Update the notification button visibility based on the saved state
    updateNotificationButton();
}

//=======================================
//Restrict inputs to numbers and dashes
//========================================

// Restrict input to numbers and dashes only
function restrictInputToNumbersAndDashes(fieldIds) {
    fieldIds.forEach((id) => {
        const field = document.getElementById(id);
        if (!field) {
            console.warn(`Field with ID "${id}" not found.`);
            return;
        }

        field.addEventListener("keypress", function (event) {
            const char = String.fromCharCode(event.keyCode);
            const regex = /^[0-9-]$/; // Allow only numbers and dashes
            if (!regex.test(char)) {
                event.preventDefault();
            }
        });

        field.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9-]/g, ""); // Remove invalid characters
        });
    });
}

//=======================================
// Tool tip 
//========================================
document.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll(".info-icon");
    let activeTooltip = null;

    icons.forEach((icon) => {
        const tooltip = icon.nextElementSibling;

        icon.addEventListener("mouseenter", () => {
            const iconRect = icon.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            // Set default positioning
            tooltip.style.position = "fixed";
            tooltip.style.top = `${iconRect.bottom + 2}px`;
            tooltip.style.minWidth = "150px"; // Minimum width
            tooltip.style.maxWidth = "300px"; // Maximum width

            // Align tooltip's right edge with the icon
            tooltip.style.left = `${iconRect.right}px`;
            tooltip.style.transform = "translateX(-100%)";

            // Adjust if tooltip overflows to the left
            if (iconRect.right - tooltip.offsetWidth < 0) {
                tooltip.style.left = `${iconRect.left}px`; // Align to left edge
                tooltip.style.transform = "translateX(0)";
            }

            // Show tooltip
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";

            // Track the active tooltip
            activeTooltip = tooltip;
        });

        icon.addEventListener("mouseleave", () => {
            // Hide tooltip
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = "0";
            activeTooltip = null; // Clear active tooltip
        });
    });

    // Hide tooltip on scroll
    window.addEventListener("scroll", () => {
        if (activeTooltip) {
            activeTooltip.style.visibility = "hidden";
            activeTooltip.style.opacity = "0";
            activeTooltip = null;
        }
    });
});

// Tippy.js
document.addEventListener("DOMContentLoaded", () => {
    
    const instances = tippy('[data-tippy-content]', {
        theme: 'light',
        animation: 'fade',
        placement: 'top',
        arrow: true, 
        delay: [200, 100],
        onShow(instance) {
            
            instances.forEach(tip => {
                if (tip !== instance) {
                    tip.hide();
                }
            });
        },
        onMount(instance) {
            const tooltip = instance.popper.querySelector('.tippy-box');
            tooltip.style.boxSizing = 'border-box'; // Dynamically set box-sizing
            tooltip.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; // Ensure smooth animation
        },
    });
});

//=======================================================================================================================================================
//PURCHASING FUNCTIONS
//
//=======================================================================================================================================================
//================================================================================================================
//POPULATE EDIT PAGE OF ENGINEER'S PORTION OF NCR
//
//=================================================================================================================
function populateEngDetailsPagePch(ncrNumber) {
    document.getElementById('engEditForm').style.display = 'none'
    const entry = engineering.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        document.getElementById('reviewByCfEngineeringP').textContent = entry.reviewByCfEngineering || "-";
        document.getElementById('customerNotificationP').textContent = entry.customerNotification || "-";
        document.getElementById('dispositionP').innerHTML = entry.disposition.replace(/\n/g, '<br/>') || "-";
        document.getElementById('drawingUpdateP').textContent = entry.drawingUpdate || "-";
        document.getElementById('originalRevNumberP').textContent = entry.originalRevNumber || "-";
        document.getElementById('updatedRevNumberP').textContent = entry.updatedRevNumber || "-";
        document.getElementById('revisionDateP').textContent = entry.revisionDate ? formatDate(entry.revisionDate) : "-";
        document.getElementById('engineerNameP').textContent = entry.engineerName || "-";
        document.getElementById('completedByEngP').textContent = entry.completedBy ?? "";
        document.getElementById('completedOnEngP').textContent = entry.completedOn ? formatDate(entry.completedOn) : "";
        if (entry.drawingUpdate == "No") {
            Array.from(document.getElementsByClassName('drawingUpdateToggleP')).forEach(element => {
                element.style.display = 'none';
            });
        }
    }
}


function populatePchEditPage(ncrNumber) {
    //populateEngEditPage(ncrNumber)
    populateDetailsPageEng(ncrNumber)
    populateEngDetailsPagePch(ncrNumber)
    const entry = purchasing.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        //document.getElementById('ncrNumberEng').textContent = entry.ncrNumber;
        document.getElementById('preliminaryDecision').value = entry.preliminaryDecision;
        document.getElementById('carRaised').value = entry.carRaised;
        document.getElementById('followUp').value = entry.followUp;
        //document.getElementById('ncrClosed').value = entry.ncrClosed;
        document.getElementById('completedByPch').value = entry.completedBy ? entry.completedBy : "";
        document.getElementById('completedOnPch').value = entry.completedOn ? formatDate(entry.completedOn) : "";

        if (entry.ncrClosed == "Yes") {
            document.getElementById('completionToggle3').style.display = 'block'
            document.getElementById('btnPchSubmit').style.display = 'none';
        }

        if (entry.carRaised === "Yes") {
            document.getElementById('carNumber').value = entry.carNumber;
        } else {
            document.getElementById('carNumber').value = '';

            document.getElementById('carRaisedToggle').style.display = 'none';
        }

        if (entry.followUp === "Yes") {
            document.getElementById('followUpType').value = entry.followUpType;
            document.getElementById('followUpDate').value = entry.followUpDate ? setDate(entry.followUpDate) : "";
        } else {
            document.getElementById('followUpType').value = '';
            document.getElementById('followUpDate').value = '';

            document.getElementById('followUpToggle').style.display = 'none';
        }
    }
    //console.log(entry);
}


//========================================================================================================================
//DETAILS PAGE
//========================================================================================================================
function populatePchDetailsPage(ncrNumber) {
    const entry = purchasing.find(item => item.ncrNumber === ncrNumber);
    if (entry) {
        document.getElementById('preliminaryDecision').textContent = entry.preliminaryDecision || "-";
        document.getElementById('carRaised').textContent = entry.carRaised || "-";
        document.getElementById('carNumber').textContent = entry.carNumber || "-";
        document.getElementById('followUp').textContent = entry.followUp || "-";
        document.getElementById('followUpType').textContent = entry.followUpType || "-";
        document.getElementById('followUpDate').textContent = entry.followUpDate ? formatDate(entry.followUpDate) : "-";
        document.getElementById('ncrClosed').textContent = entry.ncrClosed || "No";
        document.getElementById('completedByPch').textContent = entry.completedBy ?? "";
        document.getElementById('completedOnPch').textContent = entry.completedOn ? formatDate(entry.completedOn) : "";

        if (entry.carRaised == "No") {
            document.getElementById('toggleCarNumber').style.display = 'none';
        }
        if (entry.followUp == "No") {
            document.getElementById('toggleFollowUpType').style.display = 'none';
            document.getElementById('toggleFollowUpDate').style.display = 'none';
        }
        if (entry.ncrStatus == "Closed") {
            document.getElementById('completionToggle3').style.display = 'grid';
            document.getElementById('editButton').classList.add("non");
            document.getElementById('editButtonEng').classList.add("non");
            document.getElementById('editButtonPch').classList.add("non");
        }
        //hide print button unless NCR is closed
        if (entry.ncrStatus != "Closed") {
            document.getElementById('printButtonPch').classList.add("non");
            document.getElementById('editButton').classList.add("non");
            document.getElementById('editButtonEng').classList.add("non");
        }
    }
}

//================================================================================================================
//SAVE PURCHASING'S PORTION OF NCR
//
//=================================================================================================================
function savePchNCR() {
    const ncrNumber = document.getElementById('ncrNumberE').textContent;
    const changedBy = getUserName();
    const date = Timestamp();
    const preliminaryDecision = document.getElementById('preliminaryDecision').value;
    const carRaised = document.getElementById('carRaised').value;
    const carNumber = document.getElementById('carNumber').value;
    const followUp = document.getElementById('followUp').value;
    const followUpType = document.getElementById('followUpType').value;
    const followUpDateRaw = document.getElementById('followUpDate').value;
    const followUpDate = followUpDateRaw ? correctDate(followUpDateRaw) : "";

    const purchasingEntry = purchasing.find(entry => entry.ncrNumber === ncrNumber);


    if (purchasingEntry) {
        // Check for changes in all relevant fields
        const noChanges = (
            purchasingEntry.preliminaryDecision === preliminaryDecision &&
            purchasingEntry.carRaised === carRaised &&
            purchasingEntry.carNumber === carNumber &&
            purchasingEntry.followUp === followUp &&
            purchasingEntry.followUpType === followUpType &&
            purchasingEntry.followUpDate === followUpDate
        );

        if (noChanges) {
            showToast('No changes were made.', 'info', 5000);
            return;
        }

        const confirmation = confirm("Are you sure you want to save the NCR?");
        if (confirmation) {
            purchasingEntry.preliminaryDecision = preliminaryDecision;
            purchasingEntry.carRaised = carRaised;
            purchasingEntry.followUp = followUp;

            if (carRaised == "Yes") {
                purchasingEntry.carNumber = carNumber;
            }
            else {
                purchasingEntry.carNumber = "";
            }
            if (followUp == "Yes") {
                purchasingEntry.followUpType = followUpType;
                purchasingEntry.followUpDate = followUpDate;
            }
            else {
                purchasingEntry.followUpType = "";
                purchasingEntry.followUpDate = "";
            }
            localStorage.setItem('purchasing', JSON.stringify(purchasing));

            //update lastUpdated in NCRLog
            const ncrLogEntry = ncrLog.find(entry => entry.ncrNumber === ncrNumber);
            if (ncrLogEntry) { ncrLogEntry.lastUpdated = date }
            localStorage.setItem('ncrLog', JSON.stringify(ncrLog));

            const historyEntry = {
                ncrNumber: ncrNumber,
                actionType: "Edit",
                status: 'Open',
                actionDescription: `NCR edited by ${getUserRole()}`,
                changedBy: changedBy,
                changedOn: Timestamp()
            };

            history.push(historyEntry);
            localStorage.setItem('history', JSON.stringify(history));

            console.log(ncrLog)

            showToast('Your changes have been saved. You can continue later.', 'success', 5000);
            window.history.back();
            //console.log(typeof (revisionDate), revisionDate)
        } else {
            showToast("Save operation cancelled.", 'info', 5000);
        }
    } else {
        showToast('NCR not found. Please check the NCR number.', 'error', 5000);
    }
    //console.log(engineering);
    //console.log(typeof(revisionDate), revisionDate)
}

//================================================================================================================
//SUBMIT/CLOSE PURCHASING'S PORTION OF NCR
//
//=================================================================================================================
function closeNCR() {

    const ncrNumber = document.getElementById('ncrNumberE').textContent;
    const changedBy = getUserName();
    const date = Timestamp();
    const preliminaryDecision = document.getElementById('preliminaryDecision').value;
    const carRaised = document.getElementById('carRaised').value;
    const carNumber = document.getElementById('carNumber').value;
    const followUp = document.getElementById('followUp').value;
    const followUpType = document.getElementById('followUpType').value;
    const followUpDateRaw = document.getElementById('followUpDate').value;
    const followUpDate = followUpDateRaw ? correctDate(followUpDateRaw) : "";


    // Validation rules for the form fields
    const validationRules = [
        {
            id: 'preliminaryDecision-error',
            targetId: 'preliminaryDecision',
            condition: () => preliminaryDecision === '', // Check if dropdown is empty
            message: "Purchasing's Preliminary Decision is required.",
            eventType: 'change' // Dropdown: listen for 'change'
        },
        {
            id: 'carRaised-error',
            targetId: 'carRaised',
            condition: () => carRaised === '', // Check if dropdown is empty
            message: "Was a CAR raised is required.",
            eventType: 'change' // Dropdown: listen for 'change'
        },
        {
            id: 'followUp-error',
            targetId: 'followUp',
            condition: () => followUp === '', // Check if dropdown is empty
            message: "Follow-up Required is required.",
            eventType: 'change' // Dropdown: listen for 'change'
        },
        {
            id: 'carNumber-error',
            targetId: 'carNumber',
            condition: () => carRaised === "Yes" && !carNumber, // Check if carNumber is empty
            message: 'CAR Number is required.',
            eventType: 'input' // Dropdown: listen for 'change'
        },
        {
            id: 'followUpType-error',
            targetId: 'followUpType',
            condition: () => followUp === "Yes" && !followUpType, // Check if followUpType is empty
            message: 'Follow-up Type is required.',
            eventType: 'input' // Dropdown: listen for 'change'
        },
        {
            id: 'followUpDate-error',
            targetId: 'followUpDate',
            condition: () => followUp === "Yes" && !followUpDate, // Check if followUpDate is empty
            message: 'Follow-up Date is required.',
            eventType: 'input' // Dropdown: listen for 'change'
        }
    ];

    // Perform validation
    let isValid = true;

    validationRules.forEach(validation => {
        const fieldElement = document.getElementById(validation.targetId);
        const errorElement = document.getElementById(validation.id);

        // Clear previous messages and styles
        if (errorElement) errorElement.remove();
        if (fieldElement) fieldElement.style.border = '';

        // Apply validation
        if (validation.condition()) {
            isValid = false;

            // Display error message
            const errorDiv = document.createElement('div');
            errorDiv.id = validation.id;
            errorDiv.style.color = '#B22222';
            errorDiv.style.fontSize = '16px';
            errorDiv.textContent = validation.message;
            fieldElement.parentNode.appendChild(errorDiv);

            // Highlight border
            fieldElement.style.border = '3px solid #B22222';

            // Add real-time error clearing for dropdowns and text fields
            if (validation.eventType === 'change') {
                fieldElement.addEventListener('change', function clearError() {
                    const fieldValue = fieldElement.value;
                    if (fieldValue !== '' && fieldValue !== 'default') { // Adjust 'default' as needed
                        const errorElement = document.getElementById(validation.id);
                        if (errorElement) errorElement.remove();
                        fieldElement.style.border = '';
                        fieldElement.removeEventListener('change', clearError);
                    }
                });

            }
            // For textboxes (input event)
            else if (validation.eventType === 'input') {
                fieldElement.addEventListener('input', function clearError() {
                    const fieldValue = fieldElement.value;
                    if (fieldValue !== '' && fieldValue !== 'default') { // Adjust 'default' as needed
                        const errorElement = document.getElementById(validation.id);
                        if (errorElement) errorElement.remove();
                        fieldElement.style.border = '';
                        fieldElement.removeEventListener('input', clearError);
                    }
                });
            }
        }
    });

    // If any validation fails, stop the submission
    if (!isValid) return;

    const confirmation = confirm("Are you sure you want to close the NCR?");
    if (confirmation) {
        // Update the corresponding NCR in the ncrLog, quality and engineering arrays
        const ncrLogEntry = ncrLog.find(entry => entry.ncrNumber === ncrNumber);
        const qualityEntry = quality.find(entry => entry.ncrNumber === ncrNumber);
        const engineeringEntry = engineering.find(entry => entry.ncrNumber === ncrNumber);

        if (ncrLogEntry) { ncrLogEntry.status = "Closed" }
        if (qualityEntry) { qualityEntry.ncrStatus = "Closed"; }
        if (engineeringEntry) { engineeringEntry.ncrStatus = "Closed"; }
        localStorage.setItem('ncrLog', JSON.stringify(ncrLog));
        localStorage.setItem('quality', JSON.stringify(quality));
        localStorage.setItem('engineering', JSON.stringify(engineering));

        const purchasingEntry = purchasing.find(entry => entry.ncrNumber === ncrNumber);

        if (purchasingEntry) {
            purchasingEntry.preliminaryDecision = preliminaryDecision;
            purchasingEntry.carRaised = carRaised;
            purchasingEntry.followUp = followUp;
            purchasingEntry.ncrStatus = quality.find(item => item.ncrNumber === ncrNumber)?.ncrStatus;
            purchasingEntry.ncrClosed = "Yes";
            purchasingEntry.completedBy = changedBy;
            purchasingEntry.completedOn = date;

            if (carRaised == "Yes") {
                purchasingEntry.carNumber = carNumber;
            }
            else {
                purchasingEntry.carNumber = "";
            }
            if (followUp == "Yes") {
                purchasingEntry.followUpType = followUpType;
                purchasingEntry.followUpDate = followUpDate;
            }
            else {
                purchasingEntry.followUpType = "";
                purchasingEntry.followUpDate = "";
            }

            localStorage.setItem('purchasing', JSON.stringify(purchasing));

            //update lastUpdated in NCRLog
            const ncrLogEntry = ncrLog.find(entry => entry.ncrNumber === ncrNumber);
            if (ncrLogEntry) { ncrLogEntry.lastUpdated = date }
            localStorage.setItem('ncrLog', JSON.stringify(ncrLog));

            //make history array and push to history json
            const historyEntry = {
                ncrNumber: ncrNumber,
                actionType: "Close",
                status: 'Close',
                actionDescription: "NCR closed by Purchasing",
                changedBy: changedBy,
                changedOn: date
            }
            history.push(historyEntry);
            localStorage.setItem('history', JSON.stringify(history));
            showToast('NCR has been successfully closed.', 'success', 5000);
            // Delay the execution of detailsEntry to match the toast's duration
            setTimeout(() => {
                detailsEntry(ncrNumber);
            }, 2000); // 5000ms matches the toast duration
        }
    } else {
        // If the user cancels, do nothing or add custom logic
        showToast("NCR Close operation cancelled.", 'info', 5000);
        // Redirect or perform other actions as needed
        return;
    }
}


//PerformSearch for Purchasing
function performSearchPch() {
    const ncrNumber = document.getElementById('ncrNumberPch').value.trim();
    const ncrStatus = document.getElementById("ncrStatusPch").value || "Purchasing";
    const fromDate = document.getElementById('fromDatePch').value;
    const toDate = document.getElementById('toDatePch').value;
    const supplierName = document.getElementById('supplierNamePch').value;

    //const resultsCountMessage = document.getElementById('noResultsMessage');

    // Date validation
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        //resultsCountMessage.textContent = 'Start date must be earlier than or equal to end date.';
        //resultsCountMessage.style.display = 'inline';
        //return;

        showToast("Start date must be earlier than or equal to end date.", "error", 5000)
        //location.reload();
        return;
    }
    if (ncrNumber && /[a-zA-Z]/.test(ncrNumber)) {
        //resultsCountMessage.textContent = 'NCR Number must not contain alphabetic characters.';
        //resultsCountMessage.style.display = 'inline';

        showToast("NCR Number must not contain alphabetic characters.", "error", 5000)
        //location.reload();
        return;
    } /*else {
        resultsCountMessage.style.display = 'none';
    }*/


    const uniquePurchasing = Array.from(new Map(ncrLog.map(item => [item.ncrNumber, item])).values())
        .sort((a, b) => {
            const numA = parseInt(a.ncrNumber.split('-')[1], 10);
            const numB = parseInt(b.ncrNumber.split('-')[1], 10);
            return numB - numA;
        });

    const fromDateObj = fromDate ? new Date(fromDate + 'T00:00:00') : null;
    const toDateObj = toDate ? new Date(toDate + 'T23:59:59') : null;

    // Define your filtered results with the updated logic
    const filteredResults = uniquePurchasing.filter(item => {
        const isNcrNumberValid = ncrNumber ? item.ncrNumber.includes(ncrNumber) : true;

        const qualityItem = quality.find(qItem => qItem.ncrNumber === item.ncrNumber);

        // If ncrStatus is "All", don't filter by status, else filter by the selected ncrStatus
        const isStatusValid = (ncrStatus === "All" || qualityItem && qualityItem.ncrStatus === ncrStatus);

        // Validate supplier name if provided
        const isSupplierNameValid = supplierName ? qualityItem.supplierName === supplierName : true;

        const itemDateCreated = new Date(item.dateCreated);
        const isDateCreatedValid = (
            (fromDateObj ? itemDateCreated >= fromDateObj : true) &&
            (toDateObj ? itemDateCreated <= toDateObj : true)
        );

        // Return true if all conditions are valid
        return isNcrNumberValid && isSupplierNameValid && isStatusValid && isDateCreatedValid;
    });

    const totalResults = filteredResults.length;

    // Display results based on current page
    const tableBody = document.getElementById("viewTableContentPch");
    const paginatedResults = filteredResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
    const paginationContainer = document.getElementById("paginationPch");

    tableBody.innerHTML = ''; // Clear previous results

    paginatedResults.forEach(result => {
        const ncrStatusPch = quality.find(q => q.ncrNumber === result.ncrNumber)?.ncrStatus || '';

        const newRow = `<tr>
                            <td data-tippy-content="NCR Number - ${result.ncrNumber}">${result.ncrNumber}</td>
                             <td data-tippy-content="Supplier - ${((quality.find(q => q.ncrNumber === result.ncrNumber)?.supplierName)) || ''}">${((quality.find(q => q.ncrNumber === result.ncrNumber)?.supplierName)) || ''}</td>
                             <td data-tippy-content="Date Created - ${formatDate(ncrLog.find(q => q.ncrNumber === result.ncrNumber).dateCreated)}">
                                ${formatDate(ncrLog.find(q => q.ncrNumber === result.ncrNumber).dateCreated)}
                            </td>
                            <td data-tippy-content="Status - ${ncrStatusPch}">${ncrStatusPch}</td>
                            <td>
                                <div>
                                    <button data-tippy-content="Details for ${result.ncrNumber}" onclick="detailsEntry('${result.ncrNumber}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <title>Details Icon</title>
                                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        </svg>
                                        Details
                                    </button>
                                    ${ncrStatusPch !== 'Closed' && ncrStatusPch !== 'Quality' && ncrStatusPch !== 'Engineering' ? `<button data-tippy-content="Edit ${result.ncrNumber}" onclick="editEntryPch('${result.ncrNumber}', '${result.ncrStatus}')">
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <title>Edit Icon</title>
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                        </svg>
                                        Edit
                                    </button>` : ''}
                                    ${ncrStatusPch === 'Closed' ? `<button data-tippy-content="Download PDF for ${result.ncrNumber}" onclick="downloadEntry('${result.ncrNumber}')">
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <title>Download PDF Icon</title>
                                        <path stroke="currentColor" stroke-width="2" d="M5 12l7 7 7-7M12 19V5"/>
                                    </svg>
                                    Download PDF
                                </button>` : ''}
                                </div>
                            </td>
                        </tr>`;
        tableBody.innerHTML += newRow; // Add new row to table
    });

    // Setup pagination
    setupPagination(totalResults, performSearchPch, "viewTableContentPch", "paginationPch");

    if (totalResults === 0) {
        // Show a placeholder row in the table with a magnifying glass icon
        tableBody.innerHTML = `
           <tr>
               <td colspan="5" style="text-align: center; padding: 20px; color: #666; font-style: italic; font-size: 16px; background-color: #f9f9f9;">
                   <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 10px; color: #888;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m2.1-5.45a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/>
                   </svg>
                   No results found.
               </td>
           </tr>`;
        paginationContainer.style.display = 'none'; // Hide pagination
        return;
    }

}

//===================================================================================================
// Toast Messages - apvarun.github.io
//==================================================================================================
function showToast(message, type = 'info', duration = 5000) {
    const existingToast = document.querySelector('.toastify');
    if (existingToast) {
        const closeButton = existingToast.querySelector('.toastify-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                existingToast.remove();
            });
        }
        return;
    }

    Toastify({
        text: message,
        duration: duration,
        close: true,
        gravity: "top",
        position: "center",
        style: {
            color: "#fdfdfd",
            background: type === 'success' ? "#007a33" :
                type === 'error' ? "#B22222" :
                    type === 'warning' ? "#FF8C00" :
                        "#0056b3",
        },
    }).showToast();
}
//================================================================================================================
//EMAIL
//
//=================================================================================================================
// Function to retrieve and return the department name based on user role

// Function to send email to the right department
function sendEmailNotification(ncrNumber, engNeeded) {

    // Get the department name of the logged-in user
    let departmentName = ""; // Declare an empty string
    
    // Check the user role and assign the corresponding department name
    if(getUserRole() === "Quality") {
        departmentName = "Quality"; // If user role is "Quality", set department name to "Quality"
    }
    else if(getUserRole() === "Engineer") {
        departmentName = "Engineering"; // If user role is "Engineer", set department name to "Engineering"
    }
    else if(getUserRole() === "Purchasing") {
        departmentName = "Purchasing"; // If user role is "Purchasing", set department name to "Purchasing"
    }
    else {
        departmentName = "Unknown Department"; // Default case if the role doesn't match any above
    }

    const engineerEmails = [
        "wirewits2024@gmail.com",
        "jaynikzgonzales001@gmail.com"  // Example: Add engineering department emails here
    ];

    const purchasingEmails = [
        "feranmieyitope@gmail.com",
        "jaylordnikkogonzales01@gmail.com"  // Example: Add purchasing department emails here
    ];

    // Determine the email list based on 'engNeeded'
    let emailList = [];
    if (engNeeded === 'Yes') {
        emailList = engineerEmails;  // Send to Engineering emails
    } else if (engNeeded === 'No') {
        emailList = purchasingEmails;  // Send to Purchasing emails
    }

    // Send email via EmailJS
    emailjs.send("service_lr5w72q", "template_pvjf6qr", {
        to_email: emailList.join(','),  // Send to the entire list (comma-separated)
        subject: `NCR Submission - ${ncrNumber}`,
        ncrNumber: ncrNumber,
        department_name: departmentName,  // Pass department name in the email body
        from_name: "Crossfire System"
    })
        .then(response => {
            console.log("Email sent successfully:", response);
        })
        .catch(error => {
            console.error("Error sending email:", error);
        });
}

// showToast('This is an alert message!', 'info');
// options: success / error / warning / info (default)

//===================================================================================================
//UNUSED FUNCTIONS
//==================================================================================================

// function recentEngNCRs() {
//     //console.log(engineering);
//     if (!engineering.length) {
//         console.warn('No engineering data available to display.');
//         return;
//     }

//     const recentNCRss = [...engineering].reverse(); // Clone and reverse to avoid mutating the original array
//     const recentN = recentNCRss.slice(0, 5);

//     console.log(recentN);
//     console.log(recentNCRss);

//     const tableBody = document.getElementById("indexTableContentEng");
//     if (!tableBody) {
//         console.warn('Table body element not found.');
//         return;
//     }
//     tableBody.innerHTML = ''; // Clear previous results

//     recentN.forEach(result => {
//         //const editButtonDisabled = result.ncrStatus !== "Quality" ? "disabled" : "";
//         const newRow = `<tr>
//                              <td>${result.ncrNumber}</td>
//                              <td>${((quality.find(q => q.ncrNumber === result.ncrNumber)?.itemDescription)) || ''}</td>
//                              <td>${formatDate(result.dateReceived)}</td>
//                              <td>${result.ncrStatus}</td>
//                               <td>
//                                 <div>
//                                     <button onclick="detailsEntry('${result.ncrNumber}')">
//                                         <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                                             <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
//                                             <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
//                                         </svg>
//                                         Details
//                                     </button>
//                                     <button onclick="editEntryEng('${result.ncrNumber}')">
//                                         <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                                             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
//                                         </svg>
//                                         Edit
//                                     </button>
//                                 </div>
//                             </td>
//                          </tr>`;
//         tableBody.innerHTML += newRow;
//     });
// }

function Metrics() {
    const supplierStats = {};
    quality.forEach(entry => {
        if (!supplierStats[entry.supplierName]) {
            supplierStats[entry.supplierName] = {
                totalReceived: 0,
                totalDefect: 0,
                ncrCount: 0
            };
        }
        supplierStats[entry.supplierName].totalReceived += Number(entry.quantityReceived);
        supplierStats[entry.supplierName].totalDefect += Number(entry.quantityDefect);
        supplierStats[entry.supplierName].ncrCount++;
    });

    // Step 2: Prepare data for the chart and table
    const supplierNames = [];
    const ncrCounts = [];
    const tableRows = [];

    Object.entries(supplierStats).forEach(([supplier, stats]) => {
        supplierNames.push(supplier);
        ncrCounts.push(stats.ncrCount);

        const defectPercentage = ((stats.totalDefect / stats.totalReceived) * 100).toFixed(2);
        tableRows.push(`
            <tr>
                <td data-tippy-content="Supplier Name - ${supplier}">${supplier}</td>
                <td data-tippy-content="Number of NCRS - ${stats.ncrCount}">${stats.ncrCount}</td>
                <td data-tippy-content="Total quantity received - ${stats.totalReceived}">${stats.totalReceived}</td>
                <td data-tippy-content="Total quantity defective - ${stats.totalDefect}">${stats.totalDefect}</td>
                <td data-tippy-content="Defective percentage - ${defectPercentage}%">${defectPercentage}%</td>
            </tr>
        `);
    });

    // Pagination setup
    const totalResults = tableRows.length;
    const tableBodyId = 'supplierTableBody';
    const paginationContainerId = 'paginationContainer';

    function displayResults(page, resultsPerPage, tableBodyId) {
        const tableBody = document.getElementById(tableBodyId);
        const start = (page - 1) * resultsPerPage;
        const end = page * resultsPerPage;
        tableBody.innerHTML = tableRows.slice(start, end).join('');
    }

    resetPagination(); // Reset to the first page
    setupPagination(totalResults, displayResults, tableBodyId, paginationContainerId);
    displayResults(currentPage, resultsPerPage, tableBodyId); // Populate table for the first page


    // Step 3: Render the bar chart
    const metricAll = document.getElementById('metricChartAll').getContext('2d');
    const metricRecord = document.getElementById('metricChartRecord').getContext('2d');
    const metricDefect = document.getElementById('metricChartDefect').getContext('2d');

    const cumulativeDefectPercentage = supplierNames.map(
        (supplier, index) =>
            ((supplierStats[supplier].totalDefect / supplierStats[supplier].totalReceived) * 100).toFixed(2)
    );

    Chart.defaults.font.size = 18;
    Chart.defaults.font.family = "'Instrument Sans', 'sans-serif'";
    Chart.defaults.color = '#00214d';
    Chart.defaults.backgroundColor = '#fff';

    new Chart(metricAll, {
        type: 'bar', // Base type of the chart
        data: {
            labels: supplierNames,
            datasets: [
                {
                    label: 'Cumulative Defect Percentage (%)', // Line chart dataset
                    data: cumulativeDefectPercentage,
                    backgroundColor: 'rgba(0, 86, 179, 0.7)',
                    isCumulativePercentage: true
                },
                {
                    label: 'Number of NCR Records', // Bar chart dataset
                    data: ncrCounts,
                    backgroundColor: 'rgba(0, 122, 51, 0.7)',
                    isCumulativePercentage: false
                },
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                subtitle: {
                    display: true,
                    text: 'Analysis of NCR Count and Defect Percentage per Supplier'
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            // Use the custom property to determine label behavior
                            if (context.dataset.isCumulativePercentage) {
                                return `${context.raw}% Defective`;
                            }
                            return `${context.raw} NCRs`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Suppliers'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of NCR Records'
                    }
                }
            }
        }
    });

    new Chart(metricRecord, {
        type: 'bar', // Base type of the chart
        data: {
            labels: supplierNames,
            datasets: [
                {
                    label: 'Number of NCR Records', // Bar chart dataset
                    data: ncrCounts,
                    backgroundColor: 'rgba(0, 122, 51, 0.7)',
                    isCumulativePercentage: false
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                subtitle: {
                    display: true,
                    text: 'Analysis of NCR Count per Supplier'
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            // Use the custom property to determine label behavior
                            if (context.dataset.isCumulativePercentage) {
                                return `${context.raw}% Defective`;
                            }
                            return `${context.raw} NCRs`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Suppliers'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of NCR Records'
                    }
                }
            }
        }
    });

    new Chart(metricDefect, {
        type: 'bar', // Base type of the chart
        data: {
            labels: supplierNames,
            datasets: [
                {
                    label: 'Cumulative Defect Percentage (%)', // Line chart dataset
                    data: cumulativeDefectPercentage,
                    backgroundColor: 'rgba(0, 86, 179, 0.7)',
                    isCumulativePercentage: true
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                subtitle: {
                    display: true,
                    text: 'Analysis of Defect Percentage per Supplier'
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            // Use the custom property to determine label behavior
                            if (context.dataset.isCumulativePercentage) {
                                return `${context.raw}% Defective`;
                            }
                            return `${context.raw} NCRs`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Suppliers'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of NCR Records'
                    }
                }
            }
        }
    });
}



//================================================================================================================
//EVENT LISTENER FOR YES/NO TO CAR RAISED AND FOLLOW-UP
//
//=================================================================================================================
let prevCarNumber = "";
let prevFollowUpType = "";
let prevFollowUpDate = "";

// Event listener for carRaised
document.getElementById('carRaised')?.addEventListener('change', (event) => {
    const carRaised = event.target.value;

    if (carRaised === "No") {
        // Store the current values before clearing them
        prevCarNumber = document.getElementById('carNumber').value;

        document.getElementById('carRaisedToggle').style.display = 'none';

        // Clear the fields
        document.getElementById('carNumber').value = "";

    } else if (carRaised === "Yes") {

        document.getElementById('carRaisedToggle').style.display = 'grid';
        // Restore previous values if "Yes" is selected
        document.getElementById('carNumber').value = prevCarNumber;
    }
});

// Event listener for followupType
document.getElementById('followUp')?.addEventListener('change', (event) => {
    const followUp = event.target.value;

    if (followUp === "No") {
        // Store the current values before clearing them
        prevFollowUpType = document.getElementById('followUpType').value;
        const prevFollowUpDateRaw = document.getElementById('followUpDate').value;
        prevFollowUpDate = prevFollowUpDateRaw ? correctDate(prevFollowUpDateRaw) : "";

        document.getElementById('followUpToggle').style.display = 'none';

        // Clear the fields
        document.getElementById('followUpType').value = "";
        document.getElementById('followUpDate').value = "";
    } else if (followUp === "Yes") {

        document.getElementById('followUpToggle').style.display = 'grid';


        // Restore previous values if "Yes" is selected
        document.getElementById('followUpType').value = prevFollowUpType;
        document.getElementById('followUpDate').value = setDate(prevFollowUpDate);
    }
});

//Code to enable/disable dark mode
// Function to toggle dark mode and update the message
function toggleDarkMode() {
    const body = document.body;
    const darkModeSettingsMessage = document.getElementById("darkModeSettingsMessage");
    const toggleSwitch = document.getElementById("toggleSwitch1");
    const logo = document.querySelector(".logo img"); 

    const isDarkMode = toggleSwitch.checked;

    // Add/remove the dark-mode class on the body
    body.classList.toggle("dark-mode", isDarkMode);

    logo.src = isDarkMode 
        ? "/images/logo-dark.png" 
        : "/images/logo.png";

    // Update the message based on the toggle state
    darkModeSettingsMessage.textContent = isDarkMode
        ? "Dark Mode enabled"
        : "Dark Mode disabled";

    // Save the state to localStorage
    localStorage.setItem("darkMode", isDarkMode);
}

// Function to initialize dark mode state on page load
function initializeDarkMode() {
    const toggleSwitch = document.getElementById("toggleSwitch1");
    const darkModeSettingsMessage = document.getElementById("darkModeSettingsMessage");
    const logo = document.querySelector(".logo img");

    // Get saved dark mode state from localStorage
    const savedState = localStorage.getItem("darkMode") === "true";

    // Apply the saved state to the body
    document.body.classList.toggle("dark-mode", savedState);

    logo.src = savedState
        ? "/images/logo-dark.png" 
        : "/images/logo.png";

    // Set the toggle switch position
    toggleSwitch.checked = savedState;

    // Update the message
    darkModeSettingsMessage.textContent = savedState
        ? "Dark Mode enabled"
        : "Dark Mode disabled";

    // Add event listener for the toggle switch
    toggleSwitch.addEventListener("change", toggleDarkMode);
}

// Call the initialization function on page load
initializeDarkMode();


function populateAdmDetailsPage(ncrNumber) {
    var ncrCurrentStatus = quality.find(q => q.ncrNumber === ncrNumber)?.ncrStatus;
    populateDetailsPage(ncrNumber)
    if (ncrCurrentStatus == "Quality") {
        document.getElementById('sectionEngineerlabel').style.display = 'none';
        document.getElementById('sectionPurchasinglabel').style.display = 'none';
        document.getElementById('sectionQuality').checked = true;

    } else if (ncrCurrentStatus == "Engineering") {
        document.getElementById('editButton').style.display = 'none';
        //populateNotificationsEng()
        populateEngDetailsPage(ncrNumber);
        document.getElementById('sectionPurchasinglabel').style.display = 'none';
        document.getElementById('sectionEngineer').checked = true;

    } else if (ncrCurrentStatus == "Purchasing") {
        populateEngDetailsPage(ncrNumber);
        populatePchDetailsPage(ncrNumber)
        document.getElementById('sectionPurchasing').checked = true;
    }
}

function populateAdmEditPage(ncrNumber) {
    var ncrCurrentStatus = quality.find(q => q.ncrNumber === ncrNumber)?.ncrStatus;
    document.getElementById('lblCreateEditNCR').innerHTML = 'Edit NCR';
    if (ncrCurrentStatus == "Quality") {
        toggleCreateEditModalN(ncrNumber, true);

    } else if (ncrCurrentStatus == "Engineering") {
        document.getElementById('secCreateEditNCR').style.display = 'none';
        populateEngEditPage(ncrNumber)
        document.getElementById('sectionPurchasinglabel').style.display = 'none';
        document.getElementById('sectionEngineer').checked = true;
        document.getElementById('btnEngSave').addEventListener('click', () => {
            saveEngNCR()
        });
        document.getElementById('btnEngSubmit').addEventListener('click', () => {
            submitEngNCR();
        });

    } else if (ncrCurrentStatus == "Purchasing") {
        document.getElementById('secCreateEditNCR').style.display = 'none';
        document.getElementById('sectionPurchasing').checked = true;
        populatePchEditPage(ncrNumber)
        document.getElementById('btnPchSave').addEventListener('click', () => {
            savePchNCR();
        });
        document.getElementById('btnPchClose').addEventListener('click', () => {
            closeNCR();
        });

    }
}


// Toggle between create and edit modals
function toggleCreateEditModalN(ncrNumber, isEditMode) {
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
        document.getElementById('btnSave').addEventListener('click', () => {
            saveNCR();
        });
        document.getElementById('btnSubmit').addEventListener('click', () => {
            submitNCR()
        });
    } else {
        createNCRModal.style.visibility = 'visible';
        qualityEditModal.style.visibility = 'hidden';
        populateSupplierDropdown('nsupplierName');
    }
}