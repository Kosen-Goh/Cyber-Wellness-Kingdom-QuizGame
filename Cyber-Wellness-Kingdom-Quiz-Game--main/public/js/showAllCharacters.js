document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const createCharacterForm = document.getElementById("createCharacterForm");
  const userId = localStorage.getItem("userId") 
      
  if (!token) {
      alert("You must be logged in to view this page.");
      window.history.back();
      return;
  }

  // TO display all the characters
  const callbackCharacter = (responseStatus, responseData) => {
      if (responseStatus === 200) {
          const characterList = document.getElementById("characterList");

          responseData.forEach((character) => {
              const displayItem = document.createElement("div");
              displayItem.className = "col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
              displayItem.innerHTML = `
                  <div class="card">
                    <button class="btn topup-btn" id="topup-${character.character_id}">Top Up Silver</button>
                      <img src="../images/${character.character_id}.png" class="card-img-top" alt="Character-Image">
                      <div class="card-body">
                          <h5 class="card-title">${character.character_name}</h5>
                          <p class="card-text">
                              Level: ${character.character_level} <br>
                              character_xp: ${character.character_xp} <br>
                              character_silver: ${character.character_silver} <br>
                              character_gold: ${character.character_gold} <br>
                          </p>
                          <button class="btn btn-primary select-character-btn" data-character-id="${character.character_id}">Select for Battle</button>
                              <button class="btn shop-btn" id="shop-${character.character_id}">Visit Shop</button>
                            <button class="btn btn-secondary view-inventory-btn" data-character-id="${character.character_id}">View Inventory</button>
                           
                      </div>
                       <button class="btn update-btn" id="update-${character.character_id}">Update</button>
                       <button class="btn delete-btn" id="delete-${character.character_id}">Delete</button>
                  </div>
              `;
              characterList.appendChild(displayItem);

            // For update and redirect to update page

         const updateButton = document.getElementById(`update-${character.character_id}`);
         updateButton.addEventListener("click", (event) => {
          event.preventDefault();

      window.location.href = `updateCharacter.html?character_id=${character.character_id}`;
      });

      // For delete button to delete Character
      const deleteButton = document.getElementById(`delete-${character.character_id}`);
      deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        const callbackForDelete = (responseStatus, responseData) => {
          console.log("responseStatus:", responseStatus);
          console.log("responseData:", responseData);

          if(responseStatus == 204) { // once 204 is hit in backend means character has been deleted
            alert("You have successfully deleted you character: " + character.character_name)
          }
          window.location.reload();
        };

        fetchMethod(currentUrl + `/api/users/${userId}/character/${character.character_id}` , callbackForDelete, 'DELETE', null, localStorage.getItem("token"));
      });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
      // For topup button
      const topupButton = document.getElementById(`topup-${character.character_id}`); //top up specific characterId
      topupButton.addEventListener("click", (event) => {
        event.preventDefault();
        const callbackForTopUp = (responseStatus, responseData) => {
          console.log("responseStatus:", responseStatus);
          console.log("responseData:", responseData);

          if(responseStatus == 200) {
            alert(responseData.message)
          }
          if (responseStatus == 404) {
            alert(responseData.message)
          }
          window.location.reload();
        };
        // Fetch the topup endpoint to top up the specific character silver 
        fetchMethod(currentUrl + `/api/users/${userId}/character/${character.character_id}/topup` , callbackForTopUp, 'PUT', null, localStorage.getItem("token"));
      });


       // For shop button
       const shopButton = document.getElementById(`shop-${character.character_id}`);
       shopButton.addEventListener("click", (event) => {
         event.preventDefault();
         const selectedCharacterId = character.character_id;
         sessionStorage.setItem('current_character_id', selectedCharacterId);
         console.log(selectedCharacterId)
         window.location.href = 'shop.html';
       });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              // Check if this character was previously selected
              const selectedCharacterId = sessionStorage.getItem('current_character_id') || localStorage.getItem('current_character_id');
              if (character.character_id == selectedCharacterId) {
                  const button = displayItem.querySelector('.select-character-btn');
                  button.classList.add('btn-success');
                  button.textContent = 'Select for Battle';
              }

              // Add event listener for selecting the character FOR BATTLE 
              displayItem.querySelector('.select-character-btn').addEventListener('click', function() {
                  const selectedCharacterId = character.character_id;
                  sessionStorage.setItem('current_character_id', selectedCharacterId);
                  // localStorage.setItem('current_character_id', selectedCharacterId);

                  // Redirect to battles.html
                  window.location.href = "battles.html";
              });
                 // Add event listener for viewing inventory
              document.querySelectorAll('.view-inventory-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const characterId = event.target.dataset.characterId;
                    sessionStorage.setItem('current_character_id', characterId);
                    window.location.href = 'inventory.html';
                });
                
            });
            
          });
          
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      } else {
          console.error("Failed to fetch character data");
      }
  };

  // Callback to create new character
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    if (responseStatus == 201) {  // if here means character created
      // Reset the form fields
      alert(responseData.message);
      createCharacterForm.reset();
      // Check if create player was successful
      window.location.href = "characters.html";
    } else {
      alert(responseData.message);
    }
  };



/////////////////////////////////Start of Callback to get userId and then create character, this callbackUserId used by fetch(/jwt/verify) to get userId/////
  const callbackUserId = (responseStatus, responseData) => {
      if (responseStatus === 200) {
          const userId = responseData.userId;
 //IMPORTANTTT *** once get the userId get the character BY EXECUTING THE FETCH METHOD BELOW***
          fetchMethod(`/api/users/${userId}/character`, callbackCharacter, "GET", null, token);
          
         
///////Create character with the userId obtained above by going to create character route/////
          createCharacterForm.addEventListener("submit", function (event) {  // when submit, get the character name in the const character_name and send it as data to the backend
            console.log("createCharacterForm.addEventListener");
            event.preventDefault();
        
            const character_name = document.getElementById("createCharacterName").value;
        
            const data = {
              character_name: character_name
            };
    
            // send the new character name to the backend endpoint to add new character
            fetchMethod( currentUrl + `/api/users/${userId}/character`, callback, "POST", data, localStorage.getItem("token"));
          });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
     
      } else {
          console.error("Failed to verify JWT");
      }
  };

  //////////////End  of Callback to get userId and then create character/////////////////////////////////////////////////////////////////////////////////////////////////////////////



  fetchMethod("/api/jwt/verify", callbackUserId, "GET", null, token);
});


