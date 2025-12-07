document.addEventListener("DOMContentLoaded", function () {
    const url = new URL(document.URL);
    const urlParams = url.searchParams;
    const currentUrl = window.location.origin;
    const battleId = urlParams.get("battle_id");
    const characterId = sessionStorage.getItem('current_character_id'); // Retrieve characterId from sessionStorage
    const token = localStorage.getItem("token");

    if (!battleId) {
        console.error("Battle ID not found in the URL");
        return;
    }
    // Start of getting required HTML elements to populate in singleBattleInstance
    const monsterInfoElement = document.getElementById("monsterInfo");
    const monsterImageElement = monsterInfoElement.querySelector(".MonsterImage");
    const monsterNameElement = document.getElementById("monsterName");
    const monsterHPElement = document.getElementById("hpValue");
    const healthBarElement = document.getElementById("healthBar");
    // End of getting required HTML elements to populate in singleBattleInstance

// Start of function that fetches monster and displays them in the respective elements -> monsterName, monsterImage, monsterHP, healthBatElement ///////////////////////////////////////
    function fetchMonsterInfo() {
        const imagePath = `../images/beast${battleId}.png`;

        const handleMonsterResponse = (responseStatus, responseData) => {
            if (responseStatus === 200) {
                monsterNameElement.textContent = responseData.battle_name;
                monsterImageElement.style.backgroundImage = `url('${imagePath}')`;
                monsterHPElement.textContent = `HP: ${responseData.battle_monster_hp}`;
                //  BASICALLY IF U GO TO THE "CLICK MONSTER TO DEAL DAMAGE" THEN "HELPS TO LOWER THE HEALTHABAR" WHICH IS A FXN CALLING THIS, IT WILL GIVE THE NEW HP TO WHICH THE CALCULATION BELOW WILL SHOW THE AMOUNT OF GREEN IN THE HEALTH BAR, CSS ALSO PLAYS A PART
                healthBarElement.style.width = `${(responseData.battle_monster_hp / responseData.battle_monster_default_hp) * 100}%`;
                // Set initial monster health in sessionStorage
                // NEED TO FIX ISSUE WHERE U ATTACK MONSTER UNTIL CERTAIN HEALTH LOGOUT AND LOGIN STILL THAT HP ,, NOOOOOT SUPPOSE TO LIKE THAT
            } else {
                console.error("Error fetching monster info:", responseData.message);
                monsterInfoElement.innerHTML = `Error fetching monster info: ${responseData.message}`;
            }
        };

        fetchMethod(currentUrl + `/api/battles/${battleId}`, handleMonsterResponse,  "GET", null, token);
    }

    fetchMonsterInfo();
    // END of function that fetches monster and displays them in the respective elements -> monsterName, monsterImage, monsterHP, healthBatElement ///////////////////////////////////////





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ALL CLICK MONSTER TO DEAL DAMAGE
// Function to handle clicking on the monster image
    monsterImageElement.addEventListener('click', () => {
        const selectedWeaponJSON = sessionStorage.getItem('selected_weapon');
        if (!selectedWeaponJSON) {
            console.error('Selected weapon data not found in sessionStorage');
            return;
        }

        const selectedWeapon = JSON.parse(selectedWeaponJSON);
        const selectedWeaponId = selectedWeapon.id; // Retrieve weapon_id from selected_weapon

        // Define the callback function
        const handleResponse = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            if (responseStatus === 200) {
                // Update monster HP on success response
                fetchMonsterInfo(); // Update UI with new monster HP -> HELPS TO LOWER THE HEALTH BAR, Once click and go to the endpoint that deal damage will initalize that function again to get updated health bar
                console.log('Damage dealt successfully:', responseData);

                // If here means that the boss has been defeated as the final message is in a "message: " format which is our success message for defeating monster and we will show it
                if (responseData.message) {
                    alert(responseData.message);
                    // after we tell them congrats we redirect them home so the whole battle-battleinstance logic repeats
                    window.location.href = "characters.html"; // Redirect to index.html
                    return;
                }

                // Generate and display alert message based on responseData
                let damageMessage = responseData.damage_dealt;
                if (responseData.results && responseData.results.length > 0) {
                    const result = responseData.results[0];
                    // display more stuff in front end
                    damageMessage += `\n\nBattle Name: ${result.battle_name}\nMonster: ${result.battle_body}\nMonster HP: ${result.battle_monster_hp}`;

                    console.log('Monster HP:', result.battle_monster_hp); // Log the monster HP

                    // Check if the monster is defeated
                }
                alert(damageMessage);


            } else {
                console.error('Error dealing damage:', responseData);
                // Display error message or handle accordingly
                alert(`Error dealing damage: ${responseData.message}`);
            }
        };

        // Set up data with selectedWeaponId which will be used by backend to get weapon damage and deal damage to the monster
        const data = { weapon_id: selectedWeaponId };

        // Call fetchMethod to the backend endpoint that deals damage to the monster ->  Backend Endpoint B18. PUT /characters/character_id/battleinstance  
        fetchMethod(currentUrl + `/api/characters/${characterId}/battleinstance`, handleResponse, "PUT", data, token);
    });

// ALL CLICK MONSTER TO DEAL DAMAGE (ENDDD)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////START Of Inventory Battle/////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////Part 1 Viewing Inventory///////////////////////////////////////////////////////////
    const viewInventoryButton = document.getElementById('viewInventoryButton');
    if (viewInventoryButton) {
        viewInventoryButton.addEventListener('click', () => { // when click on view inventory it will bring to InvetoryBattle.html to choose a weapon
            // Redirect to InventoryBattle.html
            window.location.href = 'inventoryBattle.html';
        });
    } else {
        console.error('viewInventoryButton not found in the document');
    }
////////////////////////////////END of Part 1 Viewing Inventory///////////////////////////////////////////////////////////////////


//////////////////////////////START Part 2 DisplaySelectedWeapon////////////////////////////////////////////////////////////////////////////////
    // Retrieve selected weapon data from sessionStorage
    function displaySelectedWeapon() {
        const selectedWeaponJSON = sessionStorage.getItem('selected_weapon');
        if (selectedWeaponJSON) {
            const selectedWeapon = JSON.parse(selectedWeaponJSON);
            const weaponNameElement = document.getElementById("weaponName");
            const weaponDamageElement = document.getElementById("weaponDamage");
            const weaponImageElement = document.getElementById("weaponImage");

            weaponNameElement.textContent = "Selected Weapon"; // Example text, replace with actual weapon name logic
            weaponDamageElement.textContent = `Damage: ${selectedWeapon.damage}`;
            weaponImageElement.src = selectedWeapon.imageUrl;  // Set image source to the stored URL
        } else {
            console.error('Selected weapon data not found in sessionStorage');
        }
    }

    // Call displaySelectedWeapon initially to display any selected weapon
    displaySelectedWeapon();


//////////////////////////////END Part 2 DisplaySelectedWeapon////////////////////////////////////////////////////////////////////////////////

///////START OF These codes will listen for changes in `sessionStorage` to update the displayed weapon information dynamically and clears the selected weapon from `sessionStorage` when the user leaves the page.//////////
    // Listen for changes in sessionStorage to update selected weapon info dynamically
    window.addEventListener('storage', (event) => {
        if (event.key === 'selected_weapon') {
            displaySelectedWeapon();
        }
    });

    // Clear selected weapon from sessionStorage when leaving the page
    window.addEventListener('beforeunload', () => {
        sessionStorage.removeItem('selected_weapon');
    });


///////END OF These codes will listen for changes in `sessionStorage` to update the displayed weapon information dynamically and clears the selected weapon from `sessionStorage` when the user leaves the page.//////////



////////////////////START OF HEAL MONSTER/////////////////////////////////////////////////////////////////////////////////////////////
    // Heal Monster when character leave the page
    // So this is for when the character leave, then we want to heal the monster back up to full hp in the backend which is Endpoing B45!
    window.addEventListener('beforeunload', () => {
       
        const healMonster = (responseStatus, responseData) => {
            if (responseStatus === 204) {  // in our backend we put 204
                console.log('Monster healed successfully');
            } else {
                console.error('Error healing monster:', responseData.message);
            }
        };

        fetchMethod(currentUrl + `/api/characters/${characterId}/battleinstance/healMonster`, healMonster, "PUT", null, token);
////////////////////END OF HEAL MONSTER/////////////////////////////////////////////////////////////////////////////////////////////
    
});
    
});