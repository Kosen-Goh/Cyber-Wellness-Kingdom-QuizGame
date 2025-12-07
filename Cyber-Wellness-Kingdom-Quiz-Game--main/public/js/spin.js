document.addEventListener("DOMContentLoaded", function () {
    const spinButton = document.getElementById("spinButton"); // get teh spin button so that can detect when it is clicked and then fetch the spin backend

    spinButton.addEventListener("click", function () {
        const currentCharacterId = sessionStorage.getItem("current_character_id");
        if (!currentCharacterId) {
            alert("Character ID not found. Please log in again.");
            return;
        }


        // Callback function to handle the response
        const spinCallback = (responseStatus, responseData) => {
            if (responseStatus === 200) { // display 200 to show spun item
                alert(responseData.message);
            } else if (responseStatus === 403) {
                alert("Forbidden: " + responseData.message);
            } else {
                alert("Unexpected error: " + responseData.message);
            }
        };

        // Make the PUT request to the spin backend to get a spin item, inside will check also enough gold etc
        fetchMethod(`/api/characters/${currentCharacterId}/shop/spin`, spinCallback, "PUT", null, localStorage.getItem("token"));
    });
});
