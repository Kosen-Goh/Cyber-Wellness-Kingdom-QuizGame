document.addEventListener("DOMContentLoaded", function () {
    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
      if (responseStatus == 200) {
        // Check if login was successful
        if (responseData.token) {

          // we want to clear any potential token/userId sessions torage characterId or weapon just anything that may still be inside we FLUSH OUT SO WE GUARENTEE THE STORAGE SYSTEM IS NEW AND RESTARTED - ++SECURITY
          localStorage.clear()
          // To ensure the character id or other stuff in sessionStorage is totally cleared from session or local storage so no way the new user can get unauthoized access to a character he doesen't own (FOR SECURITY)
          sessionStorage.clear();   // may want to add in logout too

          // Store the token in local storage
          localStorage.setItem("token", responseData.token);
          // Store the UserId in localstorage -> THIS WILL BE WIDELLYYY USED FOR MANY ENDPOINTS INCLUDING UPDATE CHARACTER /API/USERS/USERID/CHARACTERS/CHARACTER_ID
          localStorage.setItem("userId", responseData.userId)


          // Redirect or perform further actions for logged-in user
          window.location.href = "index.html";
        }
      } else {
        warningCard.classList.remove("d-none");
        warningText.innerText = responseData.message;
      }
    };
  
    const loginForm = document.getElementById("loginForm");
  
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");
    /*
    This code sets up the callback function that will handle the server's response after the login request is made. 
    It also fetches references to the necessary elements from the HTML, including the 
    form (loginForm), the warning card (warningCard), and the warning text (warningText). 
    */
    loginForm.addEventListener("submit", function (event) {
      console.log("loginForm.addEventListener");
      event.preventDefault();
      /*
        This code adds an event listener to the loginForm element to handle the form submission. The event.preventDefault() 
        prevents the default form submission behavior, allowing us to handle form validation and data submission manually. 
      */
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
    // This code adds an event listener to the loginForm element to handle the form submission. The event.preventDefault() 
    //prevents the default form submission behavior, allowing us to handle form validation and data submission manually. 
    
    const data = {
        username: username,
        password: password,
      };
      // create an object data containing the user's login details (username and password) to be sent to the server. 
      // This code creates the data object with the user's login details. 
    
      // Perform login request
      fetchMethod(currentUrl + "/api/users/login", callback, "POST", data);
      // Now, we'll perform the login request to the server using the fetchMethod function (assuming it is available from the included scripts).
      /*
      This code calls the fetchMethod function to make a POST request to the /api/login endpoint with the data object containing the user's login details. 
      The callback function defined earlier will handle the response from the server. 
      */

      // Reset the form fields
      loginForm.reset();
    });
  });


/*
This code sets up the callback function that will handle the server's response after the login request 
is made. It also fetches references to the necessary elements from the HTML, including the form (loginForm),
 the warning card (warningCard), and the warning text (warningText). 
*/
