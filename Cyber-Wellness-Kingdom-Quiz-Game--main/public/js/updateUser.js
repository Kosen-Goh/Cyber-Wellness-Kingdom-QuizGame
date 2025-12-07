document.addEventListener("DOMContentLoaded", function() {
    // Event listener for the update user button
    const updateUserButton = document.getElementById("updateUserButton"); // get the updateUserButton to add eventListener in next line

    // eventListener for updateUserButton so can update username
    updateUserButton.addEventListener("click", function() {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // Get userId from localstorage to update the specific user

        if (!token || !userId) {
            alert("You're not signed in. Please log in to update your username.");
            return;
        }

        // Function to handle response and will be initialized later in the fetch
        const handleResponse = (responseStatus, responseData, successCallback, errorCallback) => {
            if (responseStatus === 200) {
                successCallback(responseData);
            } else {
                errorCallback(`Error ${responseStatus}: ${responseData.message || 'An error occurred'}`);
            }
        };

        // prompt to key in username
        const newUsername = prompt("Enter your new username:");

        // store username obtained from the prompt to pass into the backend later on
        if (newUsername) {
            const updatedUser = {
                username: newUsername
            };

            // Perform the PUT request to update the user's username, if they provide a username that already exist in user database, will get a alert(Failed to update username ${errormessage})
            fetchMethod(`${currentUrl}/api/users/${userId}`, (responseStatus, responseData) => {
                handleResponse(
                    responseStatus,
                    responseData,
                    () => {
                        // Handle success
                        console.log("Username updated successfully.");
                        alert("Username updated successfully!");
                        // Optionally update the UI or perform other actions
                        document.getElementById("username").textContent = newUsername;
                    },
                    (errorMessage) => {
                        // If they key in same username will be ->  Error 409: This username already exists for a user.
                        alert(`Failed to update username: ${errorMessage}`);
                    }
                );
            }, "PUT", updatedUser, token);
        } else {
            alert("Username update cancelled.");
        }
    });
});
