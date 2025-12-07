document.addEventListener("DOMContentLoaded", function () {
    const battlecardContainer = document.getElementById("battlecardContainer");
    const currentUrl = window.location.origin;
    const token = localStorage.getItem("token");
    const currentCharacterId = sessionStorage.getItem('current_character_id');

    if (!token || !currentCharacterId) {
        alert("You must be logged in and have a selected character to view this page.");
        window.history.back(); // Go back to the previous page
        return;
    }

    // Function to handle API responses
    const handleResponse = (responseStatus, responseData, successCallback, errorCallback) => {
        if (responseStatus === 200) {
            successCallback(responseData);
        } else {
            errorCallback(`Error ${responseStatus}: ${responseData.message || 'An error occurred'}`);
        }
    };

    // Function to verify token and get user ID
    function verifyTokenAndGetUserId(callback) {
        fetchMethod(currentUrl + `/api/jwt/verify`, (responseStatus, responseData) => {
            handleResponse(responseStatus, responseData, (data) => {
                console.log("Token verified. User ID:", data.userId);
                callback(null, data.userId);
            }, (errorMessage) => {
                console.error('Error verifying token:', errorMessage);
                callback(new Error(errorMessage));
            });
        }, "GET", null, token); // Explicitly specify method "GET"
    }
////////////////////////////////START OF FETCH SILVER FOR WHEN BATTLE CARD IS CLICK AT BOTTOM CODE LABELLED "CLICK BATTLE"//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function to fetch character silver
    function fetchCharacterSilver(characterId, callback) {
        fetchMethod(currentUrl + `/api/characters/${characterId}`, (responseStatus, responseData) => {
            handleResponse(responseStatus, responseData, (data) => {
                callback(null, data.character_silver);
            }, (errorMessage) => {
                console.error('Error fetching character silver:', errorMessage);
                callback(new Error(errorMessage));
            });
        }, "GET", null, token); // Explicitly specify method "GET"
    }
///////////////////////////////////////////////END OF FETCH SILVER FOR WHEN BATTLE CARD IS CLICK AT BOTTOM CODE LABELLED "CLICK BATTLE"///////////////////////////////////////////////////////////////////////////////////////////

    // Function to fetch battles
    function fetchBattles(callback) {
        fetchMethod(currentUrl + `/api/battles`, (responseStatus, responseData) => {
            handleResponse(responseStatus, responseData, (data) => {
                const battles = data.battles_available;
                callback(null, battles);
            }, (errorMessage) => {
                console.error('Error fetching battles:', errorMessage);
                callback(new Error(errorMessage));
            });
        }, "GET", null, token); // Explicitly specify method "GET"
    }

    // Function to display battles
    function displayBattles(battles) {
        battlecardContainer.innerHTML = ''; // Clear previous content
        battles.forEach(battle => {
            const card = createBattleCard(battle);
            battlecardContainer.appendChild(card);
        });
    }

    // Function to create battle card, specify class as property-image to style it in css to look very cool as a battle card
    function createBattleCard(battle) {
        const card = document.createElement('div');
        card.className = 'center property-card m-3';
        card.innerHTML = `
            <div class="property-image">
                <img src="../images/beast${battle.battle_id}.png" alt="Battle-Image">
            </div>
            <div class="property-description">
                <h5>${battle.battle_name}</h5>
                <p>
                    Battle Number: ${battle.battle_id} <br>
                    Cost: ${battle.battle_cost} silver<br>
                    Reward: ${battle.battle_reward} gold<br>
                    Monster HP: ${battle.battle_monster_hp} HP <br>
                    Steps: ${battle.battle_steps} <br>
                </p>
            </div>
        `;

////////START OF "CLICK BATTLE"/////////////////////////////////////////////////////////////////////////////////////////////////////////
        card.addEventListener('click', () => {
            const selectedBattleId = battle.battle_id;
            fetchCharacterSilver(currentCharacterId, (error, characterSilver) => {
                if (error) {
                    console.error('Error checking silver:', error);
                    return;
                }

                const selectedBattleName = battle.battle_name;
                const selectedBattleCost = battle.battle_cost;
                if (characterSilver >= selectedBattleCost) {
                    participateInBattle(currentCharacterId, selectedBattleId, selectedBattleName, selectedBattleCost);
                } else {
                    alert(`Insufficient silver! You need ${selectedBattleCost} silver to play this battle.`);
                }
            });
        });

        return card;
    }
///////////////////////////////////////////////END OF CLICK BATTLE////////////////////////////////////////////////////////////////////////////////////

    // Function to participate in battle
    function participateInBattle(characterId, battleId, battleName, battleCost) {
        fetchMethod(currentUrl + `/api/characters/${characterId}/battles`, (responseStatus, responseData) => {
            if (responseStatus === 200) {
                console.log(`Successfully participated in battle ${battleId}.`);
                sessionStorage.setItem('current_battle_id', battleId);
                alert(`You have successfully chosen to fight ${battleName}. ${battleCost} silver was deducted.`);
                window.location.href = `singleBattleInstance.html?battle_id=${battleId}`; // REDIRECT TO THE SPECIFIC BATTLE INSTANCE ONCE CLICKED
            } else {
                console.error('Error participating in battle:', responseData.message);
                alert(`Failed to participate in battle: ${responseData.message || 'An error occurred'}`);
            }
        }, "PUT", { battle_id: battleId }, token); // Explicitly specify method "PUT"
    }

    verifyTokenAndGetUserId((error, userId) => {
        if (error) {
            console.error('Initialization failed:', error);
            return;
        }
        fetchBattles((error, battles) => {
            if (error) {
                console.error('Error fetching battles:', error);
                return;
            }
            displayBattles(battles);
        });
    });
});




//https://medium.com/@abdalrhmanabohamza151/13-css-blog-cards-6454ba441a62  -> reference for battle cards