document.addEventListener("DOMContentLoaded", function () {
    const reviewTableBody = document.querySelector("#reviewTable tbody");
    const reviewForm = document.getElementById("reviewForm");
    const currentUrl = window.location.origin;
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

      // Check if user is authenticated
      function isAuthenticated() {
        // the token exists (not null or undefined), it returns true; otherwise, it returns false.
        // converts to boolean 
        return !!token;
    }
    // blocking non logged in users from seeing the review form and stars

    if (isAuthenticated()) {
        reviewForm.style.display = 'block';
    } else {
        reviewForm.style.display = 'none';
    }

    // Function to handle the backend response and display reviews in a table
    const displayReviews = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus === 200) {
            reviewTableBody.innerHTML = '';
            // Make counter for Review Number
            let reviewcounter = 1;
            responseData.forEach((review) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${reviewcounter}</td>
                    <td>${review.review_amt} stars</td>
                    <td>${review.username}</td>
                    <td>${review.review_text}</td>
                    <td>
                        ${review.user_id == userId ? `
                            <button class="update-review" data-id="${review.id}">Update</button>
                            <button class="delete-review" data-id="${review.id}">Delete</button>
                        ` : 'N/A'}
                    </td>
                `;
                reviewcounter++;
                reviewTableBody.appendChild(row);
            });
        } else {
            alert("Error fetching reviews.");
        }
    };

    // Fetch reviews data
    fetchMethod(`${currentUrl}/api/review`, displayReviews, "GET", null, token);

    // Handle form submission for new reviews
    reviewForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const rating = document.querySelector('input[name="rating"]:checked');
        const reviewText = document.getElementById('review').value;

        if (rating) { // used to be reating and revview true but since now review_text is NOT NEEDED we remove the review_text  // END OF BIG IF HERE TO CHECK STARS AND REVIEW TEXT
            const requestData = {
                review_amt: rating.value,
                user_id: userId,
                review_text: reviewText
            };

            const postCallback = (responseStatus, responseData) => {
                if (responseStatus === 201) {
                    alert("Review submitted successfully.");
                    fetchMethod(`${currentUrl}/api/review`, displayReviews); // Refresh reviews
                    reviewForm.reset(); // Reset the form after submission
                } else {
                    if (responseStatus === 400) {
                        alert(responseData.message);
                    } else {
                        alert("Error submitting review.");
                    }
                }
            };

            fetchMethod(`${currentUrl}/api/review`, postCallback, 'POST', requestData, token);
        } else {
            // to validate if they try to submit without anything 
            // if here means rating definitely false (not present), but text they could have written something or never but the most impt is the stars so we need to tell them to have stars 
            alert("Please provide a valid rating using the stars!")
        }
    });

    // Update and delete review event listeners
    reviewTableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('update-review')) {
            const reviewId = event.target.dataset.id;
            const newRating = prompt("Enter new rating (1-5):");
            const newReviewText = prompt("Enter new review text:");

            // need to check if rating is true cuz most important, new review test is not complusory so dont need
            // you'll see when u post a new review and you try to update it, you don't need to write a review text to go through THE MOST IMPORTANT IS THE review_amt
            if (newRating) {
                const updateData = {
                    review_amt: newRating,
                    review_text: newReviewText,
                    user_id: userId
                };

                const updateCallback = (responseStatus, responseData) => {
                    if (responseStatus === 204) {
                        alert("Review updated successfully.");
                    // reload after review updated so can see effect immediately
                    window.location.reload();
                    } else {
                        if (responseStatus === 400) {
                            alert(responseData.message)
                        } else {
                            alert("Error updating review.");
                        }
                    }
                };

                

                fetchMethod(`${currentUrl}/api/review/${reviewId}`, updateCallback, 'PUT', updateData, token);
            } else {
                // If here means newRating is definitely false which means not there , seen as review_amt (newRating or Rating) is the most important part of this reviews we need to tell them to provide a rating 
                alert("Please provide a rating from 1 - 5");
            }
        }

        if (event.target.classList.contains('delete-review')) {
            const reviewId = event.target.dataset.id;

            const deleteCallback = (responseStatus, responseData) => {
                if (responseStatus === 204) {
                    // if here means deleted alrdy so referesh page
                    alert("Review deleted successfully.");
                // reload after review deleted so can see effect immediately
                window.location.reload();
                    fetchMethod(`${currentUrl}/api/review`, displayReviews); // Refresh reviews
                } else {
                    if (responseStatus === 400) {
                        alert(responseData.message);
                    } else {
                        alert("Error deleting review.");
                    }
                }
            };

            fetchMethod(`${currentUrl}/api/review/${reviewId}`, deleteCallback, 'DELETE', null, token);
        }
    });
});
