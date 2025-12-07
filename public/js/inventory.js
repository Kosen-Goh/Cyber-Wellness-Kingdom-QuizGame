document.addEventListener("DOMContentLoaded", function () {
    const inventoryContainer = document.getElementById("inventory"); // get the inventoryContainer to populate it later on
    const currentUrl = window.location.origin;
    const token = localStorage.getItem("token");
    const currentCharacterId = sessionStorage.getItem('current_character_id'); // get the characterId from the sessionStorage to use in the fetch to backend endpoints that need characterId

    if (!token) {
        alert("You must be logged in to view this page.");
        window.history.back();
        return;
    }

    if (!currentCharacterId) {
        alert("No character selected.");
        window.history.back();
        return;
    }

    // Function to handle the backend response from fetch and display inventory items
    const displayInventory = (inventory, message, sort_rules, filter_rules, delete_items) => {
        inventoryContainer.innerHTML = ""; // Clear existing inventory

        // editing the inventory message part of the html hte rectangle in the page with all important information about inventory
        const inventoryMessage = document.createElement("div");
        inventoryMessage.className = "col-12 mb-3";
        inventoryMessage.innerHTML = `
            <div class="alert alert-info">
                <h4>${message}</h4>
                <p>${sort_rules}</p>
                <p>${filter_rules}</p>
                <p>${delete_items}</p>
            </div>
        `;
        inventoryContainer.appendChild(inventoryMessage);

        // Getting each item from inventory and styling it and organizing it accordingly
        inventory.forEach((item) => {
            const rarityClass = `rarity-${item.item_rarity.toLowerCase()}`; // For Weapon Card Color Rarity Grading, lowercase so its all accurate
            const itemDiv = document.createElement("div");
            itemDiv.className = "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
            itemDiv.innerHTML = `
                <div class="card h-100">
                    <img src="../images/weapon${item.item_id}.png" class="card-img-top ${rarityClass}" alt="${item.item_name}">
                    <div class="card-body ${rarityClass}" data-item-id="${item.item_id}">
                        <h5 class="card-title">${item.item_name}</h5>
                        <p class="card-text">
                            Description: ${item.item_description} <br>
                            Damage: ${item.item_damage} <br>
                            Type: ${item.item_type} <br>
                            Rarity: ${item.item_rarity} <br>
                        </p>
                        <button class="btn btn-secondary" onclick="sellItem(${item.item_id})">Sell</button>
                    </div>
                    <button class="btn delete-btn btn-primary" id="delete-${item.item_id}">Delete</button>
                </div>
            `;
            // append the inventoryContainer where the items should be at with itemDiv which is a stylized card of the current item
            inventoryContainer.appendChild(itemDiv);

            // For delete weapon button, when click delete button fetch backend endpoint with delete method, send message and reload webpage
            const deleteButton = document.getElementById(`delete-${item.item_id}`);
            deleteButton.addEventListener("click", (event) => {
                event.preventDefault();
                const callbackForDelete = (responseStatus, responseData) => {
                    console.log("responseStatus:", responseStatus);
                    console.log("responseData:", responseData);

                    if (responseStatus == 204) {
                        alert("You have successfully deleted your " + item.item_name);
                    }
                    window.location.reload();
                };

                const data = { item_id: item.item_id };
                fetchMethod(`${currentUrl}/api/characters/${currentCharacterId}/inventory`, callbackForDelete, 'DELETE', data, token);
            });
        });
    };

    // Function to fetch and display inventory based on the provided endpoint
    const fetchInventory = (endpoint) => {
        const callback = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            if (responseStatus === 200) {
                const { message, sort_rules, filter_rules, delete_items, inventory } = responseData;
                displayInventory(inventory, message, sort_rules, filter_rules, delete_items);
            } else {
                alert(responseData.message);
            }
        };
        // base on what endpoint was selected below, fetch that endpoint 
        fetchMethod(endpoint, callback, "GET", null, token);
    };

    // Fetch initial inventory
    fetchInventory(`${currentUrl}/api/characters/${currentCharacterId}/inventory`);

/////////////SORTING/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Event listener for sorting
    document.getElementById("sort").addEventListener("change", function () {
        const sortOption = this.value;
        let endpoint; // depending on what sort option the user choose, change the endpoint to ...

        // For sorting, we use a switch to
        switch (sortOption) { // switch views sortOption which shows the option the user selected for sort and goes through every one to see which one it matches
            case 'rarity-asc':
                endpoint = `${currentUrl}/api/characters/${currentCharacterId}/inventory/rarity/ascending`;
                break;
            case 'rarity-desc':
                endpoint = `${currentUrl}/api/characters/${currentCharacterId}/inventory/rarity/descending`;
                break;
            case 'damage-asc':
                endpoint = `${currentUrl}/api/characters/${currentCharacterId}/inventory/damage/ascending`;
                break;
            case 'damage-desc':
                endpoint = `${currentUrl}/api/characters/${currentCharacterId}/inventory/damage/descending`;
                break;
            default:
                endpoint = `${currentUrl}/api/characters/${currentCharacterId}/inventory`;
        }

        fetchInventory(endpoint);
    });
/////////////END OF SORTING//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////FILTERING////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    // Event listener for filtering by rarity
    // since Rarity is just adding the rarity at then end its more simpler jus get the element by id and then put the rarity at the endpoint
    document.getElementById("filter-rarity").addEventListener("change", function () {
        const rarity = this.value;
        const endpoint = rarity ? `${currentUrl}/api/characters/${currentCharacterId}/inventory/rarity/${rarity}` : `${currentUrl}/api/characters/${currentCharacterId}/inventory`;
        fetchInventory(endpoint);
    });

    // Event listener for filtering by type
    document.getElementById("filter-type").addEventListener("change", function () {
        const type = this.value;
        const endpoint = type ? `${currentUrl}/api/characters/${currentCharacterId}/inventory/type/${type}` : `${currentUrl}/api/characters/${currentCharacterId}/inventory`;
        fetchInventory(endpoint);
    });
}); // need explain more and why ?
///////////////END OF FILTERING////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////Start of ITEM SELLING//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to handle item selling
function sellItem(itemId) {
    const currentUrl = window.location.origin;
    const token = localStorage.getItem("token");
    const currentCharacterId = sessionStorage.getItem('current_character_id');

    const requestBody = { item_id: itemId };

    fetchMethod(
        currentUrl + `/api/characters/${currentCharacterId}/shop/sell`, 
        (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
            if (responseStatus == 200) {
                alert(responseData.message);
                document.querySelector(`[data-item-id="${itemId}"]`).parentElement.parentElement.remove();
            } else {
                alert(responseData.message);
            }
        },
        "POST",
        requestBody,
        token
    );
}
//////////////////////////////////////////////////////END OF ITEM SELLING///////////////////////////////////////////////////////////////////////////////////////
