document.addEventListener("DOMContentLoaded", function () {
    const currentUrl = window.location.origin; // getcurrenturl to use fetch later on
 
  
    const guideContainer = document.getElementById("guideContainer"); // get guideContainer from HTML to populate it later on
    const reviewContainer = document.getElementById("reviewContainer"); // get reviewContainer from HTML to populate it later on

    // callback for guide
    const callbackForGuide = (responseStatus, responseData) => {
        // cater any error message
        if (responseStatus !== 200) {
            console.error("Failed to load guide:", responseStatus);
            guideContainer.innerHTML = "Failed to load guide. Please try again later.";
            return;
        }

        // Populate guide content with title and steps from backend
        guideContainer.innerHTML = `
            <h1>${responseData.title}</h1>
            <p>${responseData.steps}</p>
        `;

        // Populate testimonials with review amounts, review text and review username
        reviewContainer.innerHTML = `<h2>Testimonials</h2>`;
        responseData.testimonial.forEach((review) => {
            const reviewItem = document.createElement("div");
            reviewItem.className = "review-item";
            reviewItem.innerHTML = `
                <div class="review-amount">Rating: ${review.review_amt} Stars</div>
                <div class="review-text">${review.review_text}</div>
                <div class="review-username">- ${review.username}</div>
            `;
            reviewContainer.appendChild(reviewItem);
        });
    };
    // Fetching the specific endpoint that gets us our guide and review information
    fetchMethod(currentUrl + "/api/users/guide", callbackForGuide);
});
