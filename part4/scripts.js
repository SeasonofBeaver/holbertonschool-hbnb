document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            // Get the email and password from the form
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Call the function to make the API request
                await loginUser(email, password);
            } catch (error) {
                console.error('Error during login:', error);
                displayErrorMessage('An error occurred while trying to log in.');
            }
        });
    }
});

async function loginUser(email, password) {
    const apiUrl = 'https://your-api-url/login'; // Replace with your API URL
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();

            // Store the JWT token in a cookie
            document.cookie = `token=${data.access_token}; path=/; Secure`;

            // Redirect to the main page
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            displayErrorMessage(errorData.message || 'Invalid login credentials.');
        }
    } catch (error) {
        displayErrorMessage('Failed to connect to the server. Please try again later.');
    }
}

function displayErrorMessage(message) {
    const errorContainer = document.getElementById('error-message'); // Assume an element with this ID exists
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        alert(message); // Fallback if no error container exists
    }
}
