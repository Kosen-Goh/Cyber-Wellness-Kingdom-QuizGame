// For character leaderboard
document.addEventListener("DOMContentLoaded", function () {
    const characterLeaderboard = document.getElementById("characterLeaderboard");
    const leaderboardText = document.getElementById("leaderboardText");
    const token = localStorage.getItem("token"); // Obtain the token then can check if user can see the leaderboard or no with the if(!token)
    const currentUrl = window.location.origin; // get the current url to get the fetc method

    if (!token) {
        // Hide the entire leaderboard container if no token is present
        document.getElementById("leaderboardContainer").style.display = 'none';
        leaderboardText.style.display = 'none';
        return;
    }

    // Callback to handle the API response and display character leaderboard
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus !== 200) {
            console.error('Failed to load leaderboard:', responseStatus);
            return;
        }

        characterLeaderboard.innerHTML = ''; // Clear the existing content

        // Display the message from the API
        const messageElement = document.createElement("p");
        messageElement.textContent = responseData.message;
        messageElement.className = "";
        characterLeaderboard.appendChild(messageElement);

        // Process and display leaderboard results
        responseData.results.forEach((character) => {
            const displayItem = document.createElement("div"); // Create a div
            displayItem.className = "leaderboard-item"; // set the class to style it in css
            displayItem.innerHTML = `
                <div class="leaderboard-rank">Rank: ${character.character_rank}</div> 
                <div class="leaderboard-name"> ${character.character_name}</div>
                <div class="leaderboard-level">Level: ${character.character_level}</div>
                <div class="leaderboard-battles">Battles Won: ${character.character_battles_won}</div>
            `;
            characterLeaderboard.appendChild(displayItem);
        });
    };

    // Fetch leaderboard data
    fetchMethod(currentUrl + "/api/characters/leaderboard", callback, "GET", null, token);
});
