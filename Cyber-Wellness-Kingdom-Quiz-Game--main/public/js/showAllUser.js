document.addEventListener("DOMContentLoaded", function () {
  const userList = document.getElementById("userList"); // get the userList from the html to populate it with users
  const currentUrl = window.location.origin;
  const token = localStorage.getItem("token"); // GET TOKEN FROM STORAGE

  if (!token) {
      alert("You must be logged in to view this page.");
      window.history.back();
      return;
  }

  // Function to handle the API response and display users
  const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
    
      // For user cards
      responseData.forEach((user) => {
          const displayItem = document.createElement("div");
          displayItem.className = "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
          displayItem.innerHTML = `
              <div class="card">
                  <div class="card-body" style="max-width: 800px; max-height: 800px; overflow: auto;">
                      <h5 class="card-title">${user.username}</h5>
                      <p class="card-text">
                          points: ${user.points} <br>
                      </p>
                      <a href="singleUserInfo.html?user_id=${user.user_id}" class="btn btn-primary">View Details</a>
                  </div>
              </div>
          `;
          userList.appendChild(displayItem);
      });
  };

  // Fetch user data from /api/usres
  fetchMethod(currentUrl + "/api/users", callback, "GET", null,  token);
});
