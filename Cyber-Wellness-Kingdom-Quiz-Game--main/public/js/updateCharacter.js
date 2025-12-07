document.addEventListener("DOMContentLoaded", function () {
    const url = new URL(document.URL);
    const urlParams = url.searchParams;
    const characterId = urlParams.get("character_id");
    const form = document.getElementById("updateCharacterForm"); // get the updateCharacterForm from html
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const currentUrl = window.location.origin; // Ensure this is set correctly

    console.log("currentUrl:", currentUrl);
    console.log("userId:", userId);
    console.log("characterId:", characterId);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // This is a simple callback For Updating the character name and displaying respective error message
        const callbackForUpdate = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            //  success is 200
            if (responseStatus === 200) {
                alert(responseData.message);
                window.location.href = "characters.html"; // or can redirect to exsting page , but like that allows u to see the change
            } else {
                // To display error message
                alert(responseData.message);
            }
        };

        const character_name = document.getElementById("newCharacterName").value; // get the character name value that they want to update to add in data to pass to backend and update the character name
        console.log("Character Name:", character_name);

        const data = {
            "character_name": character_name
        };

        fetchMethod(`${currentUrl}/api/users/${userId}/character/${characterId}`, callbackForUpdate, "PUT", data, token);
    });

    
});

// This file links to updateCharacter.html and serves purpose to let the user have a nice page to update their character name which they will use for battles shop etc so important to have a nice page to update the character name