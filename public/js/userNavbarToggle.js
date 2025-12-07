document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");
    const profileButton = document.getElementById("profileButton");
    const logoutButton = document.getElementById("logoutButton");
  
    // Check if token exists in local storage
    const token = localStorage.getItem("token");
    if (token) {
      // Token exists, show profile button and hide login and register buttons
      loginButton.classList.add("d-none");
      registerButton.classList.add("d-none");
      profileButton.classList.remove("d-none");
      logoutButton.classList.remove("d-none");
    } else {
      // Token does not exist, show login and register buttons and hide profile and logout buttons
      loginButton.classList.remove("d-none");
      registerButton.classList.remove("d-none");
      profileButton.classList.add("d-none");
      logoutButton.classList.add("d-none");
    }
  
    logoutButton.addEventListener("click", function () {
      // Remove the token from local storage and redirect to index.html
      localStorage.removeItem("token");

     // we want to clear any potential token/userId sessions torage characterId or weapon just anything that may still be inside we FLUSH OUT SO WE GUARENTEE THE STORAGE SYSTEM IS NEW AND RESTARTED - ++SECURITY
       localStorage.clear()
     // To ensure the character id or other stuff in sessionStorage is totally cleared from session or local storage so no way the new user can get unauthoized access to a character he doesen't own (FOR SECURITY)
      sessionStorage.clear();   // may want to add in logout too
      
      window.location.href = "index.html";
    });
  });


  // The idea of the codes above is to ensure that appropriate buttons are displayed in 2 situations:
  // if user has token , and user has no token
  // if he have token means he logged on and authenticated so shouldnt show him the login and register button
  // but if he dont have token means that he is not logged on and not authenticated so should show him the login and register button
  /* The last code "logout button event listener" sets up an event listener for the logoutButton.
    When user click logout button, the event listener triggers a fxn to remove the token
    from the local storage and redirect the user to index.html page. Which
    effectively logs the user out of the application. And next time he visits the webpage he will not be 
    logged on and not be authenticated so will should show the login and register buttons.

  */