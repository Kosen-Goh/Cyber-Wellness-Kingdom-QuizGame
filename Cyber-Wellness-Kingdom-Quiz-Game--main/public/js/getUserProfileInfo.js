// We split the user information and character information into 2 functions -> 1) fetchUserProfile, 2) fetchCharacterInformation

document.addEventListener("DOMContentLoaded", function () {
    const baseUrl = window.location.origin;
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
        console.error("No token or userId found in localStorage");
        return;
    }

    // This function helps us fetch user profile and its respective information like username and points
    function fetchUserProfile() {
        fetchMethod(`${baseUrl}/api/users/${userId}`, (status, responseData) => {
            if (status === 200) {
                document.getElementById('username').textContent = responseData.username;
                document.getElementById('points').textContent = responseData.points;
            } else {
                console.error('Failed to fetch user profile:', status);
            }
        }, 'GET', null, token);
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // This function helps fetch infromation about the characters belonging to the specific user
    function fetchCharacterInformation() {
        fetchMethod(`${baseUrl}/api/users/${userId}/character`, (responseStatus, responseData) => {
            const characterTableBody = document.getElementById('characterTableBody');
            characterTableBody.innerHTML = ''; // Clear existing content

            if (responseStatus === 200) {
                responseData.forEach(character => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${character.character_name}</td>
                        <td>${character.character_gold}</td>
                        <td>${character.character_silver}</td>
                        <td>${character.character_xp}</td>
                        <td>${character.character_level}</td>
                        <td>${character.character_battles_won}</td>
                    `;
                    characterTableBody.appendChild(row);
                });
            } else {
                console.error('Failed to fetch character information:', responseStatus);
            }
        }, 'GET', null, token);
    }
////////////////////////////////////////////////////////////////////////////////////////////////

// INITALIZE THE 2 FUNCTIONS WHICH WILL FETCH USER AND CHARACTER INFO RESPECTIVELY TO POPULATE THE PROFILE PAGE
    // This function helps us fetch user profile
    fetchUserProfile();

    // This function helps
    fetchCharacterInformation();

    
});
