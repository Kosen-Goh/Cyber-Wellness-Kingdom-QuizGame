document.addEventListener("DOMContentLoaded", function () {
    const postButton = document.getElementById("postButton");
    const token = localStorage.getItem("token"); // get token from storage

    if (token) { // checking if token is present, because if no token present means not logged in user cannot see the post button so "none"
        postButton.style.display = "block";
    } else {
        postButton.style.display = "none";
    }

    // when click the post button innitiate showPostModal
    postButton.addEventListener("click", () => {
        showPostModal();
    });

    const postForm = document.getElementById("postForm");
    postForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const question = document.getElementById("postQuestion").value;

        if (!token) {
            alert("You're not signed in as a user, so you can't post questions.");
            console.log("User is not authenticated. Cannot post question.");
            return;
        }

        // Verify the token and get the userId from the backend
        const verifyTokenUrl = `${currentUrl}/api/jwt/verify`;

        const verifyTokenCallback = (responseStatus, responseData) => {
            if (responseStatus === 200) {
                const userId = responseData.userId;

                const newQuestion = {
                    question: question,
                    user_id: userId
                };

                const postQuestionUrl = `${currentUrl}/api/questions`;

                const postQuestionCallback = (responseStatus, responseData) => {
                    if (responseStatus === 201) { // in backend of BED CA1 the endpoint 5 -> POST /questions is 201 for successfully posted so if here means we post the success message of the post
                        alert("You have posted a new question successfully!");
                        window.location.reload(); // reload to see the new question immediately
                    } else {
                        alert("Error: " + responseData.message);
                    }
                };

                fetchMethod(postQuestionUrl, postQuestionCallback, "POST", newQuestion, token);
            } else {
                // if here in backend is most likely reach 401 if want can add if (401) but dont need ah since its either 200 or 401 only
                alert("Error: " + responseData.message);
            }
        };

        fetchMethod(verifyTokenUrl, verifyTokenCallback, "GET", null, token);
    });
});

function showPostModal() {
    const modal = document.getElementById("postModal");
    const span = modal.querySelector(".close");

    modal.style.display = "block";

    span.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}
