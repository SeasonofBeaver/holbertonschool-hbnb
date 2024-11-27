document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    document.getElementById('price-filter').addEventListener('change', filterPlaces);

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

document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const token = checkAuthentication();
    const placeId = getPlaceIdFromURL();

    if (reviewForm) {
        reviewForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const reviewText = document.getElementById('review-text').value;
            const reviewRating = document.getElementById('review-rating').value;

            if (!reviewText || !reviewRating) {
                alert('Please fill out all fields.');
                return;
            }

            submitReview(token, placeId, reviewText, reviewRating);
        });
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.querySelector('.login-button');

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        fetchPlaces(token);
    }
}

async function fetchPlaces(token) {
    try {
        const response = await fetch('/place', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const places = await response.json();
        displayPlaces(places);
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.innerHTML = `
            <h3>${place.name}</h3>
            <p>Price per night: $${place.price}</p>
            <button class="details-button">View Details</button>
        `;
        placesList.appendChild(placeCard);
    });
}

function filterPlaces() {
    const selectedPrice = document.getElementById('price-filter').value;
    const placeCards = document.querySelectorAll('.place-card');

    placeCards.forEach(card => {
        const price = parseInt(card.querySelector('p').textContent.replace('Price per night: $', ''), 10);
        if (selectedPrice === 'all' || price <= parseInt(selectedPrice, 10)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

async function loginUser(email, password) {
    const apiUrl = '/';
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

function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('placeId');
}

async function submitReview(token, placeId, reviewText, reviewRating) {
    try {
        const response = await fetch(`/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: reviewText,
                rating: parseInt(reviewRating),
            }),
        });

        if (response.ok) {
            alert('Review submitted successfully!');
            document.getElementById('review-form').reset(); // Clear the form
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || 'Failed to submit review'}`);
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}
