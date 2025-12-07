document.addEventListener("DOMContentLoaded", function () {
    // Define the isAuthenticated function
    function isAuthenticated() {
        const token = localStorage.getItem("token");
        return !!token;
    }

    // Check if the user is authenticated
    if (!isAuthenticated()) {
        // Get the navigation items to hide
        const navItemsToHide = document.querySelectorAll(".nav-item");

        // Hide each navigation item
        navItemsToHide.forEach(navItem => {
            const link = navItem.querySelector(".nav-link").getAttribute("href");
            if (link === "users.html" || link === "characters.html" ) {
                navItem.style.display = "none";
            }
        });
    }
});
// || link === "reviews.html" -> dont hide it cuz we want non logged in users to see reviews