
// For user leaderboard
document.addEventListener("DOMContentLoaded", function () {
    const userLeaderboard = document.getElementById("userLeaderboard");
    const leaderboardContainer = document.getElementById("leaderboardContainer");// for user Leaderboard
    const leaderboardText = document.getElementById("leaderboardText");
    const currentUrl = window.location.origin;
    const token = localStorage.getItem("token");

    if (!token) {
        // Hide the entire leaderboard container if no token is present
        leaderboardContainer.style.display = 'none';
        leaderboardText.style.display = 'none';
        return;
    }

    // Function to handle the API response and display users
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus !== 200) {
            console.error('Failed to load leaderboard:', responseStatus);
            return;
        }

        userLeaderboard.innerHTML = ''; // Clear the existing content

        // Display the message from the API
        const messageElement = document.createElement("p");
        messageElement.textContent = responseData.message;
        messageElement.className = "";
        userLeaderboard.appendChild(messageElement);

        // Process and display leaderboard results
        responseData.results.forEach((user) => {
            const displayItem = document.createElement("div");
            displayItem.className = "leaderboard-item";
            displayItem.innerHTML = `
                <div class="leaderboard-rank">Rank: ${user.user_rank}</div>
                <div class="leaderboard-username">${user.username}</div>
                <div class="leaderboard-points">Points: ${user.points}</div>
            `;
            userLeaderboard.appendChild(displayItem);
        });
    };

    // Fetch leaderboard data
    fetchMethod(currentUrl + "/api/users/leaderboard", callback, "GET", null, token);
});

