document.addEventListener("DOMContentLoaded", function () {
    const questionList = document.getElementById("surveyList");
    const currentUrl = window.location.origin;
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // get userId for some endpoints in Survey needing userId

 //////////////////////////////Start of MAIN CALLBACK  initalized at the very bottom with /questions//////////////////////////////////////////////////////////////////
    // Function to handle the API response and display questions
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        
        // Create table structure
        const table = document.createElement("table");
        table.className = "table table-bordered table-hover";
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Number</th>
                    <th>Question</th>
                    <th>Creator Name</th>
                    ${isAuthenticated() ? `<th>Actions</th>` : ''}
                </tr>
            </thead>
            <tbody></tbody>
        `;

        // Populate table with questions
        const tableBody = table.querySelector("tbody");
        let questioncounter = 1;

        responseData.forEach((question) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${questioncounter}</td>
                <td>${question.question}</td>
                <td>${question.username}</td>
                ${isAuthenticated() ? `
                <td>
                    <button class="accept-button" style="background-color: green" data-question-id="${question.question_id}">Answer</button>
                    ${userId == question.creator_id ? `
                    <button class="delete-button" style="background-color: red" data-question-id="${question.question_id}">Delete</button>
                    <button class="update-button" style="background-color: gold" data-question-id="${question.question_id}">Update</button>
                    ` : ''}
                    <button class="view-answer-button" style="background-color: magenta" data-question-id="${question.question_id}">View Answers</button>
                </td>
                ` : ''}
            `;
            questioncounter++; // increment counter so it will be in order
            tableBody.appendChild(row);
        });

        questionList.appendChild(table);

        // Add event listeners
        addEventListeners();
    };
 //////////////////////////////END  of MAIN CALLBACK  initalized at the very bottom with /questions//////////////////////////////////////////////////////////////////


///////////////////////////////////////////START OF EVENT LISTENERS TO DETECT SURVEY ACTIONS AND TEHN INITALIZE THEM/////////////////////////////////////////////////////////////   

    // Function to add event listeners for ALL ACTIONS THAT THE USER CAN POSSIBLY DO TO A SURVEY QUESTION
    function addEventListeners() {
        // Answer buttons 
        // when they click answer initalize the showAnswerModal for them to fill up the Answer
        document.querySelectorAll(".accept-button").forEach(button => {
            button.addEventListener("click", () => {
                showAnswerModal(button.getAttribute("data-question-id"));
            });
        });

        // Delete buttons
         // when they click delete initalize the deleteQuestion function to delete the question
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", () => {
                deleteQuestion(button.getAttribute("data-question-id"));
            });
        });

        // Update buttons
         // when they click update initalize the showUpdateModal for them to fill up the Update modal
        document.querySelectorAll(".update-button").forEach(button => {
            button.addEventListener("click", () => {
                showUpdateModal(button.getAttribute("data-question-id"));
            });
        });

        // when they click Viewanswer initalize the viewAnswers function to view answers
        document.querySelectorAll(".view-answer-button").forEach(button => {
            button.addEventListener("click", () => {
                viewAnswers(button.getAttribute("data-question-id"));
            });
        });
    }

    // Check if user is authenticated
    function isAuthenticated() {
        // the token exists (not null or undefined), it returns true; otherwise, it returns false.
        // converts to boolean 
        return !!token;
    }
///////////////////////////////////////////END OF EVENT LISTENERS TO DETECT SURVEY ACTIONS AND TEHN INITALIZE THEM/////////////////////////////////////////////////////////////   





///////////////////////////////////////////START OF MODALS OR FUNCTIONS THAT ARE INITALIZED BY THE CLICK ACTIONS ABOVE/////////////////////////////////////////////////////////////   

    // Function to show the modal for answering a question
    function showAnswerModal(questionId) {
        const modal = document.getElementById("answerModal");
        const span = modal.querySelector(".close");
        modal.style.display = "block";
        document.getElementById("questionId").value = questionId;
        span.onclick = () => modal.style.display = "none";
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    }

    // Function to delete a question
function deleteQuestion(questionId) {
    fetchMethod(`${currentUrl}/api/questions/${questionId}`, (status, questionDetails) => {
        if (status == 200 && questionDetails.creator_id == userId) {
            fetchMethod(`${currentUrl}/api/questions/${questionId}`, (status) => {
                if (status === 204) {
                    document.querySelector(`button[data-question-id="${questionId}"]`).closest("tr").remove();
                    alert(`Question ${questionId} deleted successfully!`);
                } else {
                    alert("Failed to delete question.");
                }
            }, "DELETE", null, token);
        } else {
            alert("You can only delete your own questions.");
        }
    }, "GET", null, token);
}


    // Function to show the modal for updating a question
    function showUpdateModal(questionId) {
        const modal = document.getElementById("updateModal");
        const span = modal.querySelector(".close");
        modal.style.display = "block";
        document.getElementById("updateQuestionId").value = questionId;
        span.onclick = () => modal.style.display = "none";
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };

        // Handle form submission for updating the question
        const updateForm = document.getElementById("updateForm");
        updateForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const updatedQuestion = {
                question: document.getElementById("updateQuestionInput").value,
                user_id: userId
            };
            fetchMethod(`${currentUrl}/api/questions/${questionId}`, (status) => {
                if (status === 200) {
                    alert(`Question ${questionId} updated successfully!`);
                    window.location.reload();
                } else {
                    alert("Failed to update question.");
                }
            }, "PUT", updatedQuestion, token);
        });
    }

    // Function to view answers of a question
    function viewAnswers(questionId) {
        fetchMethod(`${currentUrl}/api/questions/${questionId}/answers`, (status, answers) => {
            if (status === 200) {
                const modal = document.getElementById("viewAnswersModal");
                const modalContent = modal.querySelector(".modal-content");
                modalContent.innerHTML = `
                    <span class="close">&times;</span>
                    <h2>Answers for Question: ${answers[0].question}</h2>
                    <div id="answersList"></div>
                `;
                const answersList = modal.querySelector("#answersList");
                answers.forEach(answer => {
                    const answerElement = document.createElement("div");
                    answerElement.innerHTML = `
                        <p><strong>Answer:</strong> ${answer.answer ? 'True' : 'False'}</p>
                        <p><strong>Additional Notes:</strong> ${answer.additional_notes}</p>
                        <p><strong>Participant_name:</strong> ${answer.username}</p>
                        <hr>
                    `;
                    answersList.appendChild(answerElement);
                });
                modal.style.display = "block";
                const span = modal.querySelector(".close");
                span.onclick = () => modal.style.display = "none";
                window.onclick = (event) => {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                };
            } else {
                alert("This question has no answers.");  // may want to use backend 404 GetAllUserAnswerByQuestionId
            }
        });
    }
///////////////////////////////////////////END  OF MODALS OR FUNCTIONS THAT ARE INITALIZED BY THE CLICK ACTIONS ABOVE/////////////////////////////////////////////////////////////   



    // Fetch questions and initialize the page -> The callback will be at the start
    fetchMethod(`${currentUrl}/api/questions`, callback, "GET", null, token);

});
