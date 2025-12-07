document.addEventListener("DOMContentLoaded", function () {
    const url = new URL(document.URL);
    const urlParams = url.searchParams;
    const userId = urlParams.get("user_id"); // get userId from storage
    const token = localStorage.getItem("token");

    if (!userId) { //check if userId is in the storage
        console.error("User ID not found in the URL");
        return;
    }
 
    const userInfoElement = document.getElementById("userInfo");  // get the respective elements from the html page to populate it
    const characterList = document.getElementById("characterList"); // get the characterList from the html page to populate it 


    // callback to get the user info
    const callbackForUserInfo = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        // if got 404 for some reason display the message
        if (responseStatus === 404) {
            userInfoElement.innerHTML = `${responseData.message}`;
            return;
        }

        // Make the Card for User 
        userInfoElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p class="card-text">
                        Username: ${responseData.username} <br>
                        Points: ${responseData.points} <br>
                    </p>
                </div>
            </div>
        `;
    };


    // Callback For User Characters, call it players here for simplicty.
    const callbackForUserPlayers = function(responseStatus, responseData) {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        // if 404 means no characters and we should set the html to let the user no they have not create any character
        if (responseStatus === 404) {
            characterList.innerHTML = `${"You have not created any characters."}`;
            return;
        }

        characterList.innerHTML = ""; // Clear existing content
        // populating the character list with user characters and their respective information
        responseData.forEach(function(character) {
            const characterHtml = `
                <div class="card character-card">
                    <img src="../images/${character.character_id}.png" class="card-img-top" alt="Character-Image">
                    <div class="card-body">
                        <h5 class="card-title">${character.character_name}</h5>
                        <p class="card-text">
                            Character Level: ${character.character_level} <br>
                            Character Silver: ${character.character_silver} <br>
                            Character Gold: ${character.character_gold} <br>
                        </p>
                    </div>
                </div>
            `;
            characterList.innerHTML += characterHtml; // Append character info
        });
    };

    // To get user information
    fetchMethod(currentUrl + `/api/users/${userId}`, callbackForUserInfo, "GET", null, token);
    // To get user's character information
    fetchMethod(currentUrl + `/api/users/${userId}/character/`, callbackForUserPlayers, "GET", null, token);
});



  
  
   











  