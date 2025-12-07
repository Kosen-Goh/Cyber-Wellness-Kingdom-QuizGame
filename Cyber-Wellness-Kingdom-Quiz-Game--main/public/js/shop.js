document.addEventListener("DOMContentLoaded", function () {
    const shopContainer = document.getElementById("shop");
    const currentUrl = window.location.origin;
    const token = localStorage.getItem("token");
    const currentCharacterId = sessionStorage.getItem('current_character_id');

    if (!token) {
        alert("You must be logged in to view this page.");
        window.history.back();
        return;
    }

    // Callback for handling shop items response, populates shop message and shop items display
    const handleShopResponse = (responseStatus, responseData) => {
        if (responseStatus === 200) {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            const { message, gold, shop, lucky_spin, rarity_system} = responseData;
            // Start of SHop message display
            const shopMessage = document.createElement("div");
            shopMessage.className = "col-12 mb-3";
            shopMessage.innerHTML = `
                <div class="alert alert-info">
                    <h4>${message}</h4>
                    <p>${gold}</p>
                      <p>${rarity_system}</p>
                    <p>${lucky_spin}</p>
                </div>
            `;
            shopContainer.appendChild(shopMessage);

            // Start of shop items display
            shop.forEach((item) => {
                const rarityClass = `rarity-${item.item_rarity.toLowerCase()}`; // For Weapon Card Color Rarity Grading, lowercase so its all accurate
                const itemDiv = document.createElement("div");
                itemDiv.className = "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3"; // add rarityClass for card rarity grading coloring
                itemDiv.innerHTML = `
                    <div class="card h-100">
                        <img src="../images/weapon${item.item_id}.png" class="card-img-top ${rarityClass}" alt="${item.item_name}">
                        <div class="card-body ${rarityClass}" style="max-width: 800px; max-height: 800px; overflow: auto;">
                            <h5 class="card-title">Name: ${item.item_name}</h5>
                            <p class="card-text">
                                Description: ${item.item_description} <br>
                                Cost: ${item.item_cost} gold <br>
                                Damage: ${item.item_damage} <br>
                                Type: ${item.item_type} <br>
                                Rarity: ${item.item_rarity} <br>
                            </p>
                            <button class="btn btn-primary" onclick="purchaseItem(${item.item_id})">Buy</button>
                        </div>
                    </div>
                `;
                shopContainer.appendChild(itemDiv);
            });
        } else {
            console.error("Error loading shop items:", responseData.message);
            alert("Error loading shop items. Please try again later.");
        }
    };

    // Fetch shop items
    fetchMethod(currentUrl + `/api/characters/${currentCharacterId}/shop`, handleShopResponse), "GET", null, token;
});

// Function to handle item purchase
function purchaseItem(itemId) {
    const currentUrl = window.location.origin;
    const token = localStorage.getItem("token");
    const currentCharacterId = sessionStorage.getItem('current_character_id');

    // Callback for handling purchase response
    const handlePurchaseResponse = (responseStatus, responseData) => {
        if (responseStatus === 200) {
            console.log(responseData);
            alert(responseData.message || "Item purchased successfully!");
        } else {
            if (responseStatus === 403) { 
            // Backend: checkCharacterGoldEnough -> 403
            alert(responseData.message) // you do not have enough gold  
            }
            else {
            console.error("Error purchasing item:", responseData.message);
            alert("Error purchasing item. Please try again.");
            }
        }
    };

    // Perform the PUT request to purchase item
    fetchMethod(currentUrl + `/api/characters/${currentCharacterId}/shop`, handlePurchaseResponse, "PUT", { item_id: itemId }, token);
}
