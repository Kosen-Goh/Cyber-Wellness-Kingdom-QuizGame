const model = require('../models/questionModel');

// Endpoint 5: POST /questions , part 1 of Endpoint 5 is checkUsersExist2

// part 1 of Endpoint 5
module.exports.checkUserExistForQuestion = (req, res, next) => {
    
    // for endpoint 5 , error handling "if missing user_id" return 400 Bad Request
    if (req.body.user_id == undefined || req.body.user_id == "") {
       // endpoint want 400 bad request if user_id is missing
       return res.status(400).send({message: "The user_id is not specified. Can't create question. Endpoint 5"})
   }
   
   // store our user_id to pass the questionModel's checkUserExistForQuestion, to check if user exists before Inserting the question
   const data = {
       user_id: req.body.user_id
   }

   const callback = (error, results, fields) => {

       if (results.length == 0) {
        //    console.log(results)
        //    console.log(results.length);
           console.error("Error checkUserExistForQuestion:", error);
           // if user does not exist send 404, error handling for Endpoint 3, 404 -> resource not found
           res.status(404).json({message:"This user does not exist to create your question. Endpoint 5 failed"})
       }
       else {
           // if user exists can go to next fxn to insert the new user
           next();
       }

   }
   model.checkUserExistForQuestion(data, callback);
}




// part 2 of Endpoint 5

module.exports.InsertSurveyQuestion = (req, res, next ) => {
    // check if req body is missing question
    if (req.body.question == undefined || req.body.question == "") {
        // Endpoint 5 wants status 400 if question is missing frm request body
        // without ".send", and simply "res.status(400", wont work, the req in postman will hang on the loading screen
      return res.status(400).send({message:"The question is not specified. Can't create question. Endpoint 5"})
    }
    // store the question and user_id to insert in Survey questions
    const data = {
     question: req.body.question,
     user_id: req.body.user_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error InsertSurveyQuestion: ", error);
            // typicall error status 500 with error
            res.status(500).json(error);
        }
        else {
            // sicne this is the insert controller we dont need display results here, tahts for displayInsertSurveyAnswer to handle, we just next() to go to displayInsertSurveyAnswer
            next();
        }
    }
    model.InsertSurveyQuestion(data, callback);
}
 


// part 3 of Endpoint 5
module.exports.displayInsertSurveyQuestion = (req, res, next) => {

    const data = {
        question: req.body.question,
        user_id: req.body.user_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error displayInsertSurveyAnswer: " , error);
            // typicall error status 500 with error
            res.status(500).json(error);
        }
        else {
            // We want to display the SurveyQuestion we just added in InsertSurveyQuestion controller-model
            // so we use results
            res.status(201).json(results[0]);
        }

    }
    // pass the data and callback to userModel's displayInsertSurveyQuestion
    model.displayInsertSurveyQuestion(data, callback);
}


//////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////
// Endpoint 6: GET /questions

module.exports.getAllSurveyQuestions = (req, res, next) => {

    // no data since its a GET /questions


    const callback = (error, results, fields) => {
        if (error){
            console.error("Error GetAllSurveyQuestions: " , error);
             // typicall error status 500 with error
            res.status(500).json(error)
        }
        else {
            // status 200 and display all SurveyQuestions, which is in results
            res.status(200).json(results);
        }
    
    }
    // use model.GetAllSurveyQuestions, to pass in our callback to questionModel's GetAllSurveyQuestions
    model.getAllSurveyQuestions(callback);

}
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 7: PUT/questions/{questions_id}

module.exports.checkQuestionExistsByQnsId = (req, res, next ) => {

    if (req.body.question == "" || req.body.question == undefined || req.body.question == null) {
        return res.status(400).json({message: "Request body is missing question. Endpoint 7 failed"});
    }
    
    // 
    if (req.body.user_id == "" || req.body.user_id == undefined || req.body.user_id == null) {
        // need to return otherwise got more than 1 response status sent and "ERR_HTTP_HEADERS_SENT" Error
       return  res.status(400).json({message: "Request body is missing user_id. Endpoint 7 failed"});
    }

    // store "questions_id" as the param
    const data = {
        questions_id: req.params.questions_id
    }

    // store the req.body that contains "user_id" and "question"
    const data2  = {
        user_id: req.body.user_id,
        question: req.body.question
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkQuestionExists: ", error);
            // if "question_id" no exist, 404, idk if need (results.length)
            res.status(500).json(error);
        }
        else {
            // means question_id dont exists
           if (results.length == 0) {
            res.status(404).json({message:"The requested question_id does not exist. Endpoint 7 failed"})
           }
            else {    
            // if exists can move on to next controller
            next();
            }
        }

    }
    model.checkQuestionExistsByQnsId(data, data2, callback);
}



module.exports.checkCreatorId = (req, res, next) => {

     // store "questions_id" as the param
     const data = {
        questions_id: req.params.questions_id
    }

    // store the req.body that contains "user_id" and "question"
    const data2  = {
        user_id: req.body.user_id,
        question: req.body.question
    }

    const callback = (error, results, fields) => {
        // prob must use questions to get creator_id and see if = user_Id
        // if error means the user_id is different from creator_id
        if (error) {
            res.status(500).jso(error);
        }
        else {

            if (data2.user_id != results[0].creator_id) {
                console.log("userId is " + data2.user_id)
                console.log("creatorId is " + results[0].creator_id)
                // 3rd error handling this is if creator_id and user_id dont match 
                res.status(403).json({message: "The creator_id is different from user_id. Owner of question incorrect. Endpoint 7 failed"})
            }

            else {
                // go to last controller which is updateQuestionByQuestionsId
                next();
            }
        }
    }
    model.checkCreatorId(data, data2, callback)
}






// Once all validations done, update the question 
module.exports.updateQuestionByQuestionsId = (req, res, next) => {

  
    // store "questions_id" as the param
    const data = {
        questions_id: req.params.questions_id
    }

    // store the req.body that contains "user_id" and "question"
    const data2  = {
        user_id: req.body.user_id,
        question: req.body.question
    }

    const callback = (error, results, fields) => {
        if (error) {
            // No more error handling requirements so just a typical error 500
            console.error("Error updateQuestionByQuestionsId:", error);
            res.status(500).json(error);
        }
        else {
            // ERROR HANDLING?????
            // since this is an update controller, we cant display it must pass to another controller to display it, so next()
            next();
        }

    }
    model.updateQuestionByQuestionsId(data, data2, callback);
}

// Once you update the question (above), display it


module.exports.displayQuestionByQuestionId = (req, res, next) => {


    // store "questions_id" as the param
    const data = {
        questions_id: req.params.questions_id
    }

   const callback = (error, results, fields) => {
    if(error) {
        console.error("Error displayQuestionByQuestionId: ", error);
        res.status(500).json(error);
    }
    else {
        // Dont need error handling here cuz should have the question if reach here 

        // Display the results with the updated question and status 200
        // display it in the format they want 
        res.status(200).json({question_id:results[0].question_id, question:results[0].question, creator_id:results[0].creator_id });
    }

   }

   model.displayQuestionByQuestionId(data, callback);
}

//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
// Endpoint 8: DELETE /questions/{question_id}


module.exports.checkQuestionExistsByQnId = (req, res, next) => {

     // store "question_id" nNOT "questions_id" must always follow what the routes out as the param , if not ur code will use an undefined value which makes your code malfunction
     const data = {
        question_id: req.params.question_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkQuestionExists2: ", error);
            // if "question_id" no exist, 404, idk if need (results.length)
            res.status(404).json(error);
        }
        else {
            // means question_id dont exists
           if (results.length == 0) {
            res.status(404).json({message:"The requested question_id does not exist. Endpoint 7 failed"})
           }
            else {    
            // if exists can move on to next controller
            next();
            }
        }

    }
    model.checkQuestionExistsByQnId(data, callback);
}





module.exports.deleteSurveyQuestion = (req, res, next) => {

    const data = {
        question_id: req.params.question_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteSurveyQuestion:", error);
            res.status(500).json(error)
        }
        else {
            res.status(204).json({message:"The Question and all associated user answers have been deleted."})

        }
    }

    model.deleteSurveyQuestion(data, callback);
}
/////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 9: POST /questions/{questions_id}/answers


module.exports.checkQuestionExistsForAnswers = (req, res, next) => {



  // store "questions_id"
  const data = {
    questions_id: req.params.questions_id,
    userId: res.locals.userId // this comes from verify token, the first fxn. The verify token fxn will have the userId but we must /jwt/generate with the "id: userId" in req.body to ensure it will have userId encoded
}

const callback = (error, results, fields) => {
    if (error) {
        console.error("Error checkQuestionExists3: ", error);
        // if "question_id" no exist, 404, idk if need (results.length)
        res.status(404).json(error);
    }
    else {
        // means question_id dont exists
       if (results.length == 0) {
        // console.log(results)
        res.status(404).json({message:"The requested question_id does not exist. Endpoint 7 failed"})
       }
        else {    
        // if exists can move on to next controller
        // console.log(results)
        next();
        }
    }

}
model.checkQuestionExistsForAnswers(data, callback);
}



module.exports.checkUserExistsForAnswer = (req, res, next) => {

    const data = {
        user_id: res.locals.userId // this comes from verify token, the first fxn. The verify token fxn will have the userId but we must /jwt/generate with the "id: userId" in req.body to ensure it will have userId encoded
    }

    console.log("User_id received:" + data.user_id)
    const callback = (error, results, fields) => {
        if(error) {
            console.error("Error checkUserExistsForAnswer:", error)
            res.status(500).json(error);
        }
        else {
            // if results.length 0, means the select did not select a user with the user_id, meaning user doesent exist
            if (results.length == 0) {
                // error handling 1 of endpoint 9
                // console.log(results)
                res.status(404).json({message: "The user does not exist for the Answer. Endpoint 9 failed"})
            }
            else {
                // once check for user and user exits, go next function
                next();
            }


        }


    }

    model.checkUserExistsForAnswer(data, callback)
}





module.exports.insertUserAnswer = (req, res, next) => {

    // error handling 2, if req.body missing creation_data, 400
    if (req.body.creation_date == "" || req.body.creation_date == undefined || req.body.creation_date == null) {
        // display 400 , error handling 2
       return res.status(400).json({message:"The request body is missing creation_date for UserAnswer. Endpoint 9 failed"})
    }


    // store the "questions_id"
    const data = {
        questions_id: req.params.questions_id
    } 

    // store everything from the req.body
    const data2 = {
        user_id: res.locals.userId, // from prev fxn verifyToken
        answer: req.body.answer,
        creation_date: req.body.creation_date,
        additional_notes: req.body.additional_notes
    }

    const callback = (error, results, fields) => {
        // if insertion fails
        if (error) {
            console.error("Error insertUserAnswer:", error)
            res.status(500).json(error);
        }
        else {
          
            next();
        }

        // may need reuslts.length to check if its inserted, results.affected_rows

    }
    model.insertUserAnswer(data, data2, callback);
}

module.exports.giveUserPointsForAnswer = (req, res, next) => {


    // this function aims to go to User table and add 5 to the points 
    // store the "user_id" which we will need to knwow which user to add 5 points to
    const data = {
        user_id: res.locals.userId // from prev fxn verifyToken
    }

    const callback = (error, results, fields) => {
        // if add points fails
        if (error) {
            console.error("Error giveUserPointsForAnswer:", error)
            res.status(500).json(error);
        }
        else {
            console.log("giveUserPointsForAnswer:" + results)
            next();
        }

}
    model.giveUserPointsForAnswer(data, callback);
}

module.exports.displayNewUserAnswer = (req, res, next) => {
    
     // store the "questions_id"
     const data = {
        questions_id: req.params.questions_id
    } 

    // store everything from the req.body
    const data2 = {
        user_id: res.locals.userId, // from prev fxn verifyToken
        answer: req.body.answer,
        creation_date: req.body.creation_date,
        additional_notes: req.body.additional_notes
    }


    const callback = (error, results, fields) => {
        // if insertion fails
        if (error) {
            console.error("Error insertUserAnswer:", error)
            res.status(500).json(error);
        }
        else {
          // dislay status 201 with the newly created answer as the response
          // should be results[0] cuz only one to see the one u JUST added, not the whole array 
            console.log(results) // shows all data of answer inserted by user
          res.status(201).json(results[0]);
        }

    }
    model.displayNewUserAnswer(data, data2, callback);
}


//////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 10: GET /questions/{questions_id}/answers

module.exports.GetAllUserAnswerByQuestionId = (req, res, next) => {

    // store our "questions_id"
    const data = {
        questions_id: req.params.questions_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error GetAllUserAnswerByQuestionId:", error);
            // typical error status 500 with error
            res.status(500).json(error);
        }
        else {
            // for Error Handling's If the requested question_id does not have any answer, return 404 Not Found.
            // display 404 if the question that client trying to see answers for has NO answers
            // just now validated "questions_id" if link to any questions in checkQuestionExists3, oops, but still good to have ah
            if (results.length == 0) {
             return res.status(404).json({message:"The requested question_id does not have any answer. Endpoint 10 failed"})
            }
            // display all answers related to the specific question with status 200
            // we use results instead of results[0] cuz we want the whole array
            res.status(200).json(results);

        }
    }
    model.GetAllUserAnswerByQuestionId(data, callback);
}










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// For getting specific question
module.exports.getSpecficQuestion = (req, res, next) => {

    const data = {
        questions_id: req.params.questions_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error GetAllUserAnswerByQuestionId:", error);
            // typical error status 500 with error
            res.status(500).json(error);
        }
        else {
            // for Error Handling's If the requested question_id does not have any answer, return 404 Not Found.
            // display 404 if the question that client trying to see answers for has NO answers
            // just now validated "questions_id" if link to any questions in checkQuestionExists3, oops, but still good to have ah
            if (results.length == 0) {
             return res.status(404).json({message:"The requested question_id does not have any answer. Endpoint 10 failed"})
            }
            // display all answers related to the specific question with status 200
            // we use results instead of results[0] cuz we want the whole array
            res.status(200).json(results[0]);

        }
    }
    model.getSpecficQuestion(data, callback);



}