const express = require('express');
const router = express.Router();
const controller = require('../controllers/questionController');
const controller2 = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');// for when user post a answer in frontend
// const { checkQuestionExists } = require('../models/questionModel');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 5 POST/questions
// dont need put "/questions" here cuz we alrdy in questions, if u put Postman request wont work and will hang or wont work.
router.post(`/`, jwtMiddleware.verifyToken, controller.checkUserExistForQuestion, controller.InsertSurveyQuestion, controller.displayInsertSurveyQuestion  )
// Wants us to create a new survey question, response shoild have question_id, creator_id , where creator_id is user_id (do)
// params: none (params)
// body: question, user_id (req.body)
// validation: check if user_id exists
// insert the question and user_id to the SurveyQuestion table then display the question that u added, the question_id will auto increament and be displayed
// flow: check if user_id given by client exists, Insert the Qn into SurveyQuestions, Get the Question that was just added in SurveyQuestion

// we cannot use UserController's checkUserExist2 , cuz that uses "req.params.user_Id", Endpoint 5 is to check for "req.body.user_id", so we make our own
// Forgot export the router below, every router fie need this below
////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////
// Endpoint 6: GET /questions
// dont need to verify token for get all questions ->
// Retreive a list of all questions with their respective "question_id" and "creator_id"
router.get('/', controller.getAllSurveyQuestions);
// They want us get all the questions from SurveyQuestions 
// params: none (params)
// body: none (req.body)
// validation: none cuz its a get (validation)
// flow: just a "GetAllSurveyQuestions" will do (flow)


//////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 7: PUT /questions/{question_id}
// Update the question details by providing
 router.put('/:questions_id', jwtMiddleware.verifyToken, controller.checkQuestionExistsByQnsId, controller.checkCreatorId, controller.updateQuestionByQuestionsId, controller.displayQuestionByQuestionId)
 // we need to update the question details of a question with the "questions_id"
 // paramas: {questions_id} (params)
 //  body: "user_id", "question" (req.body)
 // validation: we need to check if theres a questions associated with the "questions_id" provided
 // flow: check if "questions_id" exists, check if stuff in req.body is missing, if the user_id provided dont match creator_id 403 , update qn
 // the 2nd error handling requirement, can actually jus be an if statement in "checkQuestionEcists"
 // add a checkCreator
 // for 3rd error handling which is to see if "creator_id " is diff , we need to use the "questions_id" provided and select the "creator_id" from the SurveyQuestion table THEN compare it with user_id
////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 8: DELETE /questions/{question_id}
// Delete a question by providing its question_id. The questions's associated user answer, if any, should also be deleted
router.delete('/:question_id', jwtMiddleware.verifyToken, controller.checkQuestionExistsByQnId, controller.deleteSurveyQuestion) // **** need to delete the Answer associated to the SurveyQuestion
// so they want us to delete a question and the answer that it has attached to it
// paramas: question_id (params)
// body: none (req.body)
// validation: check if question exists
// So we have to delete the question and the answer(s)
// flow: checkQuestionExists, DeleteSurveyQuestion 
// ENDPOINT 7 AND 8 DIFFER IN PLURAR AND SINGGULAR, BECAREFUL
// we can use checkQuestionExists in endpoint 7 to help for this
// By right should have a delete user answers at the end, but since useranswers is empty now, and 9 and 10 seems to show us how to fill it up , we do 9 and 10 first then come back to 8 and also 3 .
///////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 9: POST /questions/{questions_id}/answers   used to be checkQuestionExists3
// router.post('/:questions_id/answers', controller.checkQuestionExistsForAnswers, controller.checkUserExistsForAnswer, controller.insertUserAnswer, controller.giveUserPointsForAnswer, controller.displayNewUserAnswer);
// Create an answer from a user (marking a survey question complete) by providing question_id
// in URL parameter and (user_id, answer, creation_date, and additional_notes in the request body)
// params: questions_id (params)
// body: user_id, answer, creation_date, additional notes (req.body)
// validation: check if question_id exists, check if user_id exists, check if req.body missing creation date
// Tables:  UserAnswer , User
// We need to add the answer and all the info into useranswers, then add 5 points to user
// put /answers here first if want can make answers routes-controller-model next time
// the check if creation data missing from req.body can be added to InsertUserAnswer
// both error handling done, now need give the user 5 points and display the answer using userAnswer Table
// so give user 5 points already, now need display the new answer using 
// Additional : User earns 5 points after completing the qn id or user_Id



///////////////////////////////////////////////////////////////////////////////////
// Endpoint 10: GET /questions/{questions_id}/answers
router.get('/:questions_id/answers', controller.checkQuestionExistsForAnswers, controller.GetAllUserAnswerByQuestionId)
// retrive all answers from /questions/{questions_id} which is a specfic question
// we kinda did this in endpoint 9 by accident before changing it back, it was when we select all and use "results" instead of "results[0" so we use results
// params: questions_id (params)
// body: none (req.body)
// validation: check if "questions_id" really exists and have a question
// GET Everything from UserAnswer where question_id = ?, question_id == answered_question_id
// Tables: UserAnswer
// we use checkQuestionsExists3 because it uses "questions_id" NOT "question_id" or have anything else above we don't need
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CA2 Frontend - link to back end For posting an answer
// This for posting an answer and verifying if token exist
router.post('/:questions_id/answers',  jwtMiddleware.verifyToken,  controller.checkQuestionExistsForAnswers, controller.checkUserExistsForAnswer, controller.insertUserAnswer, controller.giveUserPointsForAnswer, controller.displayNewUserAnswer )


// This is to help updating a question and verifying if token exist, need a endpoint to get the specific question details to update dn verify token cuz its jus to get the question unless its update then need 
// we need to edit these codes below to make sure no what req.body validation cuz its in front end theres no req.body so lets go NVM THATS FOR PUT THIS IS GET
// Misunderstanding: You dont have to change the backend like comment out req.body cuz if do correctly ur frontend should have the right names and req.body so dont have to comment out 
router.get('/:questions_id', jwtMiddleware.verifyToken, controller.checkQuestionExistsForAnswers, controller.getSpecficQuestion )







module.exports = router