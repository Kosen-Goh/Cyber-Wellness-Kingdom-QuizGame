document.addEventListener("DOMContentLoaded", function () {
    const baseUrl = window.location.origin;
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found in localStorage");
        return;
    }

    // Function to verify JWT token and get the user ID
    function verifyTokenAndGetUserId(callback) {
        fetchMethod(`${baseUrl}/api/jwt/verify`, (responseStatus, responseData) => {
            if (responseStatus === 200) {
                console.log("Token verified. User ID:", responseData.userId);
                callback(null, responseData.userId);
            } else {
                console.error('Token verification failed:', responseData);
                callback(new Error('Token verification failed: ' + responseData.message));
            }
        }, "GET", null, token);
    }

    // Function to fetch user's characters based on userId
    function fetchUserCharacters(userId) {
        fetchMethod(`${baseUrl}/api/users/${userId}/character`, (responseStatus, characters) => {
            if (responseStatus === 200) {
                const characterDropdownMenu = document.getElementById('characterDropdownMenu');

                // Clear existing options
                characterDropdownMenu.innerHTML = '';

                // Populate dropdown with fetched characters
                characters.forEach(character => {
                    const option = document.createElement('li');
                    option.classList.add('dropdown-item');
                    option.textContent = character.character_name; // Adjust based on your character object structure
                    option.setAttribute('data-character-id', character.character_id); // Adjust based on your character object structure
                    option.addEventListener('click', () => {
                        // Handle character selection here, e.g., redirect to inventoryBattle.html
                        const characterId = character.character_id;
                        window.location.href = `inventoryBattle.html?character_id=${characterId}`;
                    });
                    characterDropdownMenu.appendChild(option);
                });
            } else {
                console.error('Failed to fetch user characters:', characters);
            }
        }, "GET", null, token);
    }

    // Event listener for the button click to fetch and populate characters
    const selectCharacterButton = document.getElementById('characterDropdown');
    if (selectCharacterButton) {
        selectCharacterButton.addEventListener('click', () => {
            verifyTokenAndGetUserId((error, userId) => {
                if (error) {
                    console.error('Error selecting character:', error);
                } else {
                    fetchUserCharacters(userId);
                }
            });
        });
    }
});
