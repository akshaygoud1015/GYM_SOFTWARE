// Function to load content from another page
function loadPageContent(pageUrl) {
    // Load content via AJAX as before...
    var xhr = new XMLHttpRequest();
    xhr.open('GET', pageUrl, true);

    // After successful response:
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Extract and replace content
            var parser = new DOMParser();
            var doc = parser.parseFromString(xhr.responseText, 'text/html');
            var mainContent = doc.querySelector('#mainContent').innerHTML;
            document.getElementById('mainContent').innerHTML = mainContent;

            // Now, append the CSS link:
            var head = document.head || document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = pageUrl.replace('.html', '.css'); // Adjust based on CSS file location
            head.appendChild(link);
        }
    };
    xhr.send();
}

// Event listener for links in the sidebar
var sidebarLinks = document.querySelectorAll('#menu .nav-link');
sidebarLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        var pageUrl = this.getAttribute('href'); // Get the target page URL
        console.log(pageUrl)
        loadPageContent(pageUrl); // Load content from the target page
    });
});


// Handle form submission on button click
// Function to collect form data
function collectFormData() {
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('number').value;
    const gender = document.querySelector('input[name="flexRadioDefault"]:checked').value;
    const address = document.getElementById('address').value;
    const age = document.getElementById('age').value;
    const fee = document.getElementById('fee').value;
    const paymentDuration = document.getElementById('dropdown').value;

    return { name, mobile, gender, address, age, fee, paymentDuration };
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent default button behavior

    // Retrieve form data
    const formData = collectFormData();

    // Send form data to the main process to insert into SQLite database
    ipcRenderer.send('insert-client', formData);
}

// Listen for response from the main process
ipcRenderer.on('insert-client-reply', (event, error) => {
    if (error) {
        console.error('Error inserting data:', error);
    } else {
        console.log('Data inserted successfully');
        // Clear form fields if needed
        document.getElementById('survey-form').reset();
    }
});
