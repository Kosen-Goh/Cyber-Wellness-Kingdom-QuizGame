const pool = require('../services/db');


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Endpoint 5: POST /questions, For models, part 1 of Endpoint 5 was checkUsersExist2 model, Part 2 is this
// InsertSurveyQuestion

module.exports.checkUserExistForQuestion = (data, callback) => {
    // We want an SQLSTATEMENT to get all info on a user using user_id, then our controller can use results.length to see if really got a user
    const SQLSTATEMENT = `
    SELECT * FROM User
    WHERE user_id
    `;

    VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);

}



module.exports.InsertSurveyQuestion = (data, callback) => {

    const SQLSTATEMENT = `
    INSERT INTO SurveyQuestion (creator_id, question)
    VALUES (?, ?)
    `;
    // remember qn say user_id = creator_id, since we not inserting question_id cuz we letting the SurveyTable autoincrement and autoassign the number we dont need it in the SQLSTATEMENT
    VALUES = [data.user_id, data.question];
    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.displayInsertSurveyQuestion = (data, callback) => {

    // we want an SQLSTATEMENT That selects the question that was just added by InsertSurveyQuestion above
    const SQLSTATEMENT = `
    SELECT question_id, question, creator_id FROM SurveyQuestion
    WHERE creator_id = ?
    AND question = ?
    `;
    // remember question said "creator_id" = "user_id"
    // using user_id only gives me all questions by that user with "user_id = 1". But question seems to only want to show the newly generated question, so use the "data.question" to ensure we get the specific NEWLY created question
    // ** Apparently can add more than 1 WHERE Statement by using "AND"
    VALUES = [data.user_id, data.question];
    pool.query(SQLSTATEMENT, VALUES, callback);
}
///////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////

// Endpoint 6: GET /questions

// Ask cher if okay to edit backend like that to get the username
module.exports.getAllSurveyQuestions  = (callback ) => {

    // we want an SQLSTATEMENT, that SELECTS Everything from SurveyQuestion
    const SQLSTATEMENT = `
    SELECT SurveyQuestion.question_id, SurveyQuestion.question, SurveyQuestion.creator_id, User.username FROM SurveyQuestion 
    INNER JOIN User ON SurveyQuestion.creator_id = User.user_id

    `

    pool.query(SQLSTATEMENT, callback);

}

///////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 7: PUT /questions/{questions_id}

module.exports.checkQuestionExistsByQnsId = (data, data2, callback) => {

    // we want SQLSTATEMENT to use the "question_id" and check the SurveyQuestion Table if the question exists
    const SQLSTATEMENT = `
    SELECT * FROM SurveyQuestion
    WHERE question_id = ?
    `

    VALUES = [data.questions_id]
    pool.query(SQLSTATEMENT, VALUES, callback);
}


module.exports.checkCreatorId = (data, data2, callback) => {

    // we want a SQLSTATEMENT That uses the "questions_id" to get the creator_id and pass to the callback to see if its = to user_id
    const SQLSTATEMENT = `
    SELECT creator_id FROM SurveyQuestion
    WHERE question_id = ?
    `
    VALUES = [data.questions_id];
    pool.query(SQLSTATEMENT, VALUES, callback);

}


module.exports.updateQuestionByQuestionsId = (data, data2, callback) => {

    // we want an SQLSTATEMENT to update the question 
    const SQLSTATEMENT = `
    UPDATE SurveyQuestion SET question = ?
    WHERE question_id = ?
    `

    // pass in the "questions_id" for the WHERE , and the "question" to be the new question
    VALUES = [data2.question, data.questions_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
}


module.exports.displayQuestionByQuestionId = (data, callback) => {

    // we want an SQLSTATEMENT to get updated question by "questions_id"
    const SQLSTATEMENT = `
    SELECT * FROM SurveyQuestion
    WHERE question_id = ?
    `
    VALUES = [data.questions_id];
    pool.query(SQLSTATEMENT, VALUES, callback)

}
////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////
// Endpoint 8: DELETE /questions/{question_id}

module.exports.checkQuestionExistsByQnId  = (data, callback) => {
    // we want SQLSTATEMENT to use the "question_id" and check the SurveyQuestion Table if the question exists
    const SQLSTATEMENT = `
    SELECT * FROM SurveyQuestion
    WHERE question_id = ?
    `

    VALUES = [data.question_id]
    pool.query(SQLSTATEMENT, VALUES, callback);

}


module.exports.deleteSurveyQuestion = (data, callback) => {

    // We want an SQLSTATEMENT To delete the question and all associated user answers
    // answered_question_id in UserAnswer = question_id in SurveyQuestion
    // This will be to delete the question the next controller-model will delete all associated user answer to that question
    const SQLSTATEMENT = `
    DELETE FROM SurveyQuestion
    WHERE question_id = ?
    `
    VALUES = [data.question_id];
    pool.query(SQLSTATEMENT, VALUES, callback);

}


/////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 9: POST /questions/{questions_id}/answers

module.exports.checkQuestionExistsForAnswers = (data, callback) => {


  // we want SQLSTATEMENT to use the "questions_id" and check the SurveyQuestion Table if the question exists
  const SQLSTATEMENT = `
  SELECT * FROM SurveyQuestion
  WHERE question_id = ?
  `

  VALUES = [data.questions_id]
  pool.query(SQLSTATEMENT, VALUES, callback);

}



module.exports.checkUserExistsForAnswer = (data, callback) => {

    // we want an SQLSTATEMENT that uses "user_id" to get the user
    const SQLSTATEMENT = `
    SELECT * FROM User
    WHERE user_id = ?
    `;

    VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);

}







module.exports.insertUserAnswer = (data, data2, callback) => {

    // we want SQLSTATEMENT to insert the answer information to Useranser table
    //  participant_id = user_id
    // answered_question_id = question_id , not answer_id = question_Id
    const SQLSTATEMENT = `
    INSERT INTO UserAnswer (participant_id, answer, creation_date, additional_notes, answered_question_id)
    VALUES (?, ?, ?, ?, ?)
    `
    // need add the question_id from param as "answered_question_id" in useranswer table
    VALUES = [data2.user_id, data2.answer, data2.creation_date, data2.additional_notes, data.questions_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
    

}


module.exports.giveUserPointsForAnswer = (data, callback) => {

    // we want an SQLSTATEMENT that adds 5 points to the "points" attribute of Tabe user
    const SQLSTATEMENT = `
    UPDATE User
    SET points = points + 5
    WHERE user_id = ?
    `
    VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);

}

module.exports.displayNewUserAnswer = (data , data2, callback) => {

    // we want an SQLSTATEMENT that uses "user_id" and "questions_id" to get the newly creater Answer
    const SQLSTATEMENT = `
    SELECT * FROM UserAnswer
    WHERE participant_id = ?
    AND
    answered_question_id  = ?
    `;
    // cuz  participant_id = user_Id, answered_question_id  = questions_id
    VALUES = [data2.user_id , data.questions_id];
    pool.query(SQLSTATEMENT, VALUES, callback);

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 10: GET /questions/{questions_id}/answers

module.exports.GetAllUserAnswerByQuestionId = (data, callback) => {

    // we want an SQLSTATEMENT that gets ALL Answers from a specific question using question_id
    // keep in mind that "questions_id" from SurveyQuestion Table equals to UserAnswer's answered_question_id
    // Table: UserAnswer
    const SQLSTATEMENT = `
    SELECT UserAnswer.answer_id, UserAnswer.answered_question_id, SurveyQuestion.question, UserAnswer.participant_id, User.username, UserAnswer.answer, UserAnswer.creation_date, UserAnswer.additional_notes
    FROM UserAnswer
    INNER JOIN User ON UserAnswer.participant_id = User.user_id
    INNER JOIN SurveyQuestion ON UserAnswer.answered_question_id = SurveyQuestion.question_id
    WHERE answered_question_id = ?
    `;
    // here is "questions_id" cuz "questions_id" = "answered_questions_id"
    VALUES = [data.questions_id];
    pool.query(SQLSTATEMENT, VALUES, callback)


}
/*
  SELECT SurveyQuestion.question_id, SurveyQuestion.question, SurveyQuestion.creator_id, User.username FROM SurveyQuestion 
    INNER JOIN User ON SurveyQuestion.creator_id = User.user_id

  "answer_id": 1,
        "answered_question_id": 1,
        "participant_id": 1,
        "answer": 1,
        "creation_date": "2024-12-05 00:00:00",
        "additional_notes": "I hate it"
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////\


// For CA2 Updating used to get question so that can update
module.exports.getSpecficQuestion = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM SurveyQuestion
    WHERE question_id = ?
    `

  VALUES = [data.questions_id]
  pool.query(SQLSTATEMENT, VALUES, callback);
    
}

