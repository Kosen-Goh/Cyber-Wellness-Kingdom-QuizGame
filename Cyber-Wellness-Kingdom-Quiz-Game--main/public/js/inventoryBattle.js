/// This file is for characters to view their inventory while in battle and choose a weapon to battle the monster with
document.addEventListener("DOMContentLoaded", () => {
    const currentUrl = window.location.origin;
    const characterId = sessionStorage.getItem('current_character_id'); // get the character id for the fetch later on
    const token = localStorage.getItem("token");

    if (!characterId) {
        console.error('Character ID not found in sessionStorage');
        return;
    }

    // Function to handle the API response and display weapons
    const handleInventoryResponse = (responseStatus, responseData) => {
        if (responseStatus === 200) {
            console.log('Inventory data:', responseData);
            displayWeapons(responseData.weapons); // Display weapons in the inventory
        } else {
            console.error('Error fetching inventory:', responseData.message);
            alert("Error fetching inventory. Please try again later.");
        }
    };

    // Fetch character inventory
    fetchMethod(`${currentUrl}/api/characters/${characterId}/battleinstance/inventory`, handleInventoryResponse, "GET", null, token);

    // Function to display weapons inventory on the page
    function displayWeapons(weapons) {
        const inventoryItems = document.getElementById('inventoryItems');
        inventoryItems.innerHTML = '';

        weapons.forEach(weapon => {
            // Create elements to display each weapon
            const card = document.createElement('div');
            card.classList.add('card', 'mb-3');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const itemName = document.createElement('h5');
            itemName.classList.add('card-title');
            itemName.textContent = weapon.item_name;

            const itemDescription = document.createElement('p');
            itemDescription.classList.add('card-text');
            itemDescription.textContent = weapon.item_description;

            const itemDetails = document.createElement('p');
            itemDetails.textContent = `Damage: ${weapon.item_damage}, Rarity: ${weapon.item_rarity}`;

            // Create image element
            const itemImage = document.createElement('img');
            itemImage.classList.add('card-img-top');
            itemImage.src = `../images/weapon${weapon.weapon_id}.png`; // Assuming 'image_url' is a property of your weapon object

            // Create select button
            const selectButton = document.createElement('button');
            selectButton.classList.add('btn', 'btn-primary', 'float-right');
            selectButton.textContent = 'Select';
            // When user clicks the select weapon
            selectButton.addEventListener('click', () => {
                // Store selected weapon details in sessionStorage
                const selectedWeapon = {
                    damage: weapon.item_damage,
                    imageUrl: `../images/weapon${weapon.weapon_id}.png`,
                    id: weapon.weapon_id
                };
                sessionStorage.setItem('selected_weapon', JSON.stringify(selectedWeapon));
                window.history.back(); // Go back to the previous page
            });

            cardBody.appendChild(itemName);
            cardBody.appendChild(itemImage); // Append image to card body
            cardBody.appendChild(itemDescription);
            cardBody.appendChild(itemDetails);
            cardBody.appendChild(selectButton); // Append the select button to the card body

            card.appendChild(cardBody);
            inventoryItems.appendChild(card);
        });
    }
});


