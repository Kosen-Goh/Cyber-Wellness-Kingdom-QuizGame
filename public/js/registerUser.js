document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Perform signup logic
    if (password === confirmPassword) {
      // Passwords match, proceed with signup
      console.log("Signup successful");
      console.log("Username:", username);
      console.log("Password:", password);
      warningCard.classList.add("d-none");
      

      const data = {
        username: username,
        password: password
      };

      const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
          // Check if signup was successful
          if (responseData.token) {
                 // we want to clear any potential token/userId sessions torage characterId or weapon just anything that may still be inside we FLUSH OUT SO WE GUARENTEE THE STORAGE SYSTEM IS NEW AND RESTARTED - ++SECURITY
          localStorage.clear()
          // To ensure the character id or other stuff in sessionStorage is totally cleared from session or local storage so no way the new user can get unauthoized access to a character he doesen't own (FOR SECURITY)
          sessionStorage.clear();   // may want to add in logout too

          // Store the token in local storage
          localStorage.setItem("token", responseData.token);
          // Store the UserId in localstorage -> THIS WILL BE WIDELLYYY USED FOR MANY ENDPOINTS INCLUDING UPDATE CHARACTER /API/USERS/USERID/CHARACTERS/CHARACTER_ID
          localStorage.setItem("userId", responseData.userId)

            // // Store the token in local storage
            // localStorage.setItem("token", responseData.token);
            // Redirect or perform further actions for logged-in user
            window.location.href = "index.html";
          }
        } else {
          warningCard.classList.remove("d-none");
          warningText.innerText = responseData.message;
        }
      };

      // Perform signup request
      fetchMethod(currentUrl + "/api/users/register", callback, "POST", data);

      // Reset the form fields
      signupForm.reset();
    } else {
      // Passwords do not match, handle error
      warningCard.classList.remove("d-none");
      warningText.innerText = "Passwords do not match";
    }
  });
});