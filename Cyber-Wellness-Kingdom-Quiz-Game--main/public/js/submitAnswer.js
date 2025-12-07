document.addEventListener("DOMContentLoaded", function () {
  const answerForm = document.getElementById("answerForm"); // get the Answer form to use 

  answerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const questionId = document.getElementById("questionId").value; // get the questionId value the user inputted to access the specific backend with teh questioId in the database
    const answer = document.querySelector('input[name="answer"]:checked');  // get the answer value the user inputted to pass to backend and insert in database
    const additionalNotes = document.getElementById("additionalNotes").value; // get the additionaNotes value the user inputted to pass to backend and insert in database

    // Validate if a user is signed in
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You're not signed in as a user, so you can't answer questions.");
      return;
    }

    // Validate if an answer is selected
    if (!answer) {
      alert("Please select an answer.");
      return;
    }



    // Map 'true' or 'false' to 1 or 0 , in database they have 1 or 0 but we want to display True or False so we map true or falsae to 1 or 0 respectively
    const answerValue = answer.value === 'true' ? 1 : 0;

    // Format creation date as YYYY-MM-DD  , we are following the database as there are creationd date in the database for answers
    const currentDate = new Date();
    const creationDate = currentDate.toISOString().slice(0, 10); // This code will convert the current date to an ISO 8601 formatted string and extracts the date part in `YYYY-MM-DD` format.

    const data = {
      answer: answerValue,
      additional_notes: additionalNotes,
      creation_date: creationDate
    };

    // Perform the POST request to submit the answer
    fetchMethod(`${currentUrl}/api/questions/${questionId}/answers`, handleSubmitResponse, "POST", data, token); // token send to backend for the jwt.verifytoken to verify token, if we never add token here will have 401 cuz our backend got jwt.verifytoken. For frontend authentication flow is if unot logged in we hide buttons or prevent u from visiting the authorized sites, but for backend is the use of "jwtmiddleware.verifytoken" to get the token from the front end which is created when u register in the backend, and verify the token.
  });

  // Callback function to handle the API response
  function handleSubmitResponse(responseStatus, responseData) {
    if (responseStatus === 201) {
      console.log("Answer submitted successfully:", responseData);
      alert("You have submitted your answer successfully. You have earned 5 points!");
      // Optionally handle success response here (e.g., close modal, show message)
      answerForm.reset(); // Reset form fields
      document.getElementById("answerModal").style.display = "none"; // Close modal
    } else {
      console.error("Error submitting answer:", responseData);
      alert("Failed to submit answer. Please try again."); // Display error to user
    }
  }

  // Event listener for closing the modal
  document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('answerModal').style.display = 'none';
  });
});

