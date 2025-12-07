const model = require('../models/userModel');

// Endpoint 1 , also used for Endpoint 3 and 4
// This functions uses username to check if the user exists
module.exports.checkUserExistByUsername = (req, res, next) => {

    // This ia an if statement to check if username empty, 2nd part of error handling
    if (req.body.username == "" || req.body.username == undefined) {
        // we return to make sure only 1 status send, cuz if not more than 1 got ERR_HTTP_HEADERS_SENT ERROR
       return res.status(400).send({message:"Request body missing username"})
    }
    
    const data = {
        username: req.body.username
    }

    const callback = (error, results, fields) => {
        // if there is a user name "x" results.length would be > 0 , so we make it land here. 
        // console.log(results)
        if (results.length !== 0) {
            console.error("Error checkUserExist:", error);
            // if user exist send 409, error handling 1, endpoint 1 and 4 wants 409 if username exists
            res.status(409).json({message:"This username already exists for a user."})
        }
        else {
            // if doesent exist can go to next fxn to insert the new user
            next();
        }
    }
    model.checkUserExistByUsername(data, callback)
}
// Endpoint 1 : the above fxn alrdy did the 2 error handling so the one below dn


// Endpoint 1
module.exports.postNewUser = (req, res, next) => {

    const data = {
        username:req.body.username,
        points:0
    }

    const callback = (error, results, fields) => {
        if (error) {
        console.error("Error: PostNewUser: ", error);
        res.status(500).json(error);
        }
        else {
            // error handling: if for some reason was not inserted in User table show 
            if (results.affectedRows == 0 ) {
                res.status(400).json({message:"The new user was not inserted likely because of bad request from client"})
            }

            next()
        }

    }

    model.postNewUser(data, callback)
}


// Endpoint 1, also used for Endpoint 4
// This functions uses username to get all of the userInfo
module.exports.getNewUserInfo = (req, res, next) => {
    const data = {
        username:req.body.username
    }

    const callback = (error, results, fields) => {
        if (error) {
        console.error("Error: PostNewUser: ", error);
        // if error or cannot get user, 500 and error 
        res.status(500).json(error);
        }
    
            // if sucess, 201 and display results containing all information about user
            else {
                // do we use 404? 
                // error handling: cannot find username with user
                if (results.length == 0) {
                    res.status(404).json({message:"This new username is not associated with any users"})
                }
                // we dont want [] so [0]
                res.status(201).json(results[0])
        }

    }

    model.getNewUserInfo(data, callback)
    }


///////////////////////////////////////////////////////////////////////////////////

// Endpoint 2 
module.exports.getAllUser = (req, res, next) => {
    // no params or req.body so dontneed data, just callback

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllUser: ", error);
            // they never specify what to put if error, so I just put 500
            res.status(500).json(error);
        }
        else {
            // error handling?
            // we display 200 OK for success and display the entire results array with all users and their information
          
             res.status(200).json(results);
      
        }
    }
    // pass our callback to UserModel's GetAllUser
    model.getAllUser(callback);
}
////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// Endpoint 3

// Part 1 of Endpoint 3

// Used for Endpoint 3 , also used for Endpoint 4
//This functions uses user_id to check if the user exists
module.exports.checkUserExistByUserId = (req, res, next) => {
    
    // store our user_id provided by client in url
    const data = {
        user_id: req.params.user_id

    }

    // basically this callback is the opposite of Endpoint 1
    const callback = (error, results, fields) => {
        
        if (error) {
            console.error("Error getAllUser: ", error);
            // they never specify what to put if error, so I just put 500
            res.status(500).json(error);
        }
        
        // if there is a user name "x" results.length would be > 0 , so we make it land here. 
        // if result length == 0 , means the SQLSTATEMENT did not get a user from the "user_id" , which means
        // that the user does not exist
        if (results.length == 0) {
            // console.log(results)
            // console.log(results.length);
            console.error("Error checkUserExist:", error);
            // if user does not exist send 404, error handling for Endpoint 3
            res.status(404).json({message:"This user does not exist. Endpoint 3 or 4 failed"})
        }
        else {
            // if user exists can go to next fxn to insert the new user
            next();
        }
    }
    model.checkUserExistByUserId(data, callback)
}


// part 2 of Endpoint 3

// To compute amount of completed questiosn for endpoint 3
module.exports.computeCompletedQuestions = (req, res, next) => {
    // so we need to pass in the answered_question_id -> which is question_id that user answered, and particpant_id -> which is user_id
    // actuall dn pass in answered_question_id, thats the column we selecting with user_id
    const data = {
        user_id: req.params.user_id
    }
    const callback = (error, results, fields) => {
        if(error) {
            console.error("Error computeCompletedQuestions: ", error);
            // they never specify what to put if error for this fxn, so I just put 500
            res.status(500).json(error);
         }
         else {
            // store our amount of compelted qns in res.locals, so the next fxn can use and display, we use results.length as thats the amount of creawted qns
           res.locals.completed_questions = results.length
           // results.length consists of the the answered_question_id ina n array like [{1}, {2}], so results.length gives us total amount of completed qns
            next();
         }
    }
    model.computeCompletedQuestions(data, callback)
}



// part 3 of Endpoint 3

module.exports.GetSpecificUserInfo = (req, res, next) => {
    // store the completed_qns whichw e computed in the previous fxn
    let completed_questions = res.locals.completed_questions

    // store our req.params user_id
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if(error) {
            console.error("Error GetSpecificUserInfo: ", error);
            // they never specify what to put if error for this fxn, so I just put 500
            res.status(500).json(error);
         }
        else {
            // display 200 OK status , with the first entry of results
            console.log(results[0].username)
            console.log(results[0].user_id)

            // we need to display "completed_qns" which is not in table. Henec we need to add it here // completed questions = completed questions we defiend in prev fxn that feteches amount of completed_questions
            res.status(200).json({user_id:results[0].user_id, username:results[0].username, completed_questions: completed_questions, points: results[0].points});
            // for now I'll hardcode completed_questions as 0 , but at least now Ik how to display it
            // need to insert data in useranswer, so that we can get how many qns a particular user has answered and add it to "completed_qns", need to fill up useranswer and user to get completed_qns.
            // basically we fill up the table then from that tabe get how many qns the user completed and display it as completed_qns , its not points, its ALL FROM useranswer and we need to answer id and the id to get the amt of compelted qns
            // but let me skip first and see if the other endpoints can help with this
        }
    }
    model.GetSpecificUserInfo(data, callback)
}

 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Endpoint 4: PUT /users/{user_id}
// using checkUserExist2 from earlier as part 1
// This endpoint relies on checkUserExist 2 , to check if user_id provided exists, as in if the user_id that the client want to update exists or not

module.exports.updateUsername = (req, res, next) => {

    // store the id and username which we will need to update the username of the provided userid with
    const data ={
        user_id: req.params.user_id,
        username: req.body.username
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error UpdatingUsername: ", error);
            // if error 500, show error
            res.status(500).json(error)
        }
        else {
            // 404 or 400?
            if (results.affectedRows == 0) {
             res.status(404).json({message:"The user's username was not updated"})   
            }

            // display 200 status, next(), to go to the getuserid with the provided user id
            next();
        }

    }
    model.updateUsername(data, callback);
    // Just Now ERROR I put "model.exports"
}

// since getNewUser was 201 when success, and qn wants 200 for success, make a new get user but for update so we can get 200 if success

module.exports.getUpdatedUserInfo  = (req, res, next) => {
    const data = {
        username:req.body.username
    }

    const callback = (error, results, fields) => {
        if (error) {
        console.error("Error: PostNewUser: ", error);
        // if error or cannot get user, 409 and error 
        res.status(500).json(error);
        }
    
            // if sucess, 201 and display results containing all information about user
            else {
                // need error handling
                // identical to getNewUser info but instead of 201 its 200
                res.status(200).json(results[0])
        }

    }
    // I think can use the same model as getNewuser since the status 200 is the only thing we changing
    model.getNewUserInfo(data, callback)
    }

///////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 5: POST /questions , part 1 of Endpoint 5 is checkUsersExist2
// part 2 of Endpoint 5

module.exports.InsertSurveyQuestion = (req, res, next ) => {
    // check if req body is missing question
    if (req.body.question == undefined || req.body.question == "") {
        // Endpoint 5 wants status 400 if question is missing frm request body
      return res.status(400)
    }
    // store the question and user_id to insert in Survey questions
    const data = {
     question: req.body.question,
     user_id: req.body.user_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error InsertSurveyQuestion: ", error);
            // typicallerror status 500 with error
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
            // typical error status 500 with error
            res.status(500).json(error);
        }
        else {
            // We want to display the SurveyQuestion we just added in InsertSurveyQuestion controller-model
            // so we use results
            res.status(201).json(results);
        }

    }
    // pass the data and callback to userModel's displayInsertSurveyQuestion
    model.displayInsertSurveyQuestion(data, callback);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start of User-Character Interactivity, to let User In Section A manage the characters they own in the game
// Start Of Section B 24 - 29

// Endpoint 24
module.exports.checkUserExistForCharacter = (req, res, next) => {

   
    // store user_id from params
    const data = {
        user_id: req.params.user_id // make sure this matches routes user_id
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("checkUserExistForCreateCharacter", error);
            // typical error 500
            res.status(500).json(error)
        }
        else {
            // if results.length == 0 means nothing was selected and user dont exist
            if (results.length == 0) {
                res.status(404).json({message:"This user with user_id: " + data.user_id + " does not exist"})
            }
            else {
                // if here means user exist
                res.locals.user_points_to_transfer = results[0].points
                next();
            }


        }






    }

    model.checkUserExistForCharacter(data, callback)
}


// Add the Character to Character Table first
module.exports.insertCharacterForUserInCharacterTable = (req, res, next) => {
    if (req.body.character_name == undefined || req.body.character_name == ""|| req.body.character_name == null) {
        return res.status(400).json({message:"Input missing. Please put character_name: x. Where x is the name you wish to name your character"})
    }
    // store new Character details - which is just the name
    const data = {
        character_name: req.body.character_name
    }
    console.log("test")

    const callback = (error, results, fields) => {

        
        if (error) {
            console.error("insertCharacterForUserInCharacterTable", error);
            // typical error 500
            res.status(500).json(error)
        }
        else {
            // check if anything was inserted ofc
            if (results.affectedRows == 0) {
                res.status(400).json("Character was not inserted in Characters Table.")
            }
            else {
               // we have inserted character into character table now insert in CharacterUserRel
                //we need CharacterId to give next fxn
                res.locals.newCharacterIdForCharacterUserRel = results.insertId
                console.log(results.insertId) //check
                next();
            }


        }

    }
    model.insertCharacterForUserInCharacterTable(data, callback)
}

// Insert a basic weapon for new character so they can fight bosses and then earn gold then buy their own weapon

module.exports.insertBasicWeaponForNewCharacterInventory = (req, res, next) => {

        // store new Character details - which is just the name
        const data = {
            character_name: req.body.character_name,
            character_id: res.locals.newCharacterIdForCharacterUserRel
        }

        const callback = (error, results, fields) => {

        
            if (error) {
                console.error("insertBasicWeaponForNewCharacter", error);
                // typical error 500
                res.status(500).json(error)
            }
            else {
                // check if anything was inserted ofc
                if (results.affectedRows == 0) {
                    res.status(400).json("Basic Weapon was not inserted in Weapons Table.")
                }
                else {
                  // if here means basic weapon has been added to the weapons table with the new character id 
                  // store the character name that they want to name the character so can edit the message for create character in website
                  res.locals.new_character_name = data.character_name;
                    next();
                }
    
    
            }
    
        }
        model.insertBasicWeaponForNewCharacterInventory(data, callback);
}


// Insert the Character Into CharacterUserRel for the asssociation and relationship you know what I mean
module.exports.insertNewCharForUserInCharUserRelTransferPoints = (req, res, next) => {

      // we jus need to insert character_id and user_id into CharacterUserRel nothing else 
      const data = {
        character_id: res.locals.newCharacterIdForCharacterUserRel,
        user_id: req.params.user_id,
        user_points_to_transfer: res.locals.user_points_to_transfer,
        character_name:  res.locals.new_character_name 
    }
    console.log(data)

    const callback = (error, results, fields) => {

        if (error) {
            console.error("insertNewCharacterForUserInCharacterUserRel", error);
            // typical error 500
            res.status(500).json(error)
        }


        else {
            // if results.affectedRows == 0 means nothing was inserted
            if (results.affectedRows == 0) {
                res.status(400).json("Failed to insert Character_id and User_id into CharacterUserRel Table")
            }
            else {
                // it was character id but we change to character name as per chers suggestion
                res.status(201).json({message:"Character: " + data.character_name + " created successfully! Your " + data.user_points_to_transfer + " points have been converted to silver for your character to play battles. As you play battles, you'll earn gold and xp which you can use in the shop and rank up respectively!" + " Enjoy playing Battle Berzerk: Heroic Clash! "})
            }
        }


    }
    model.insertNewCharForUserInCharUserRelTransferPoints(data, callback)

}

// Endpoint B25

module.exports.checkCharacterExist = (req, res, next) => {

    // store character_id to use to select a character to check if character exist
    const data = {
        character_id: req.params.character_id
    }


    const callback = (error, results, fields) => {

        if (error) {
            console.error("checkCharacterExist", error);
            // typical error 500
            res.status(500).json(error) 
        }
        else {
            // if results.length == 0 means character does not exist
            if (results.length == 0) {
                res.status(404).json({message:"This Character with character_id: " + data.character_id + " does not exist"})
            }
            else {
                // if here means results.length !== 0 and character does exist
                next();
            }
        }


    }
    model.checkCharacterExist(data, callback)
}

// check if Character really associated with user in CharacterrUserRel
module.exports.checkForUserCharacterAssociation = (req, res, next) => {


        // we need both user_id and character_id
        const data = {
            user_id: req.params.user_id,
            character_id: req.params.character_id
        }
        console.log(data)
        
        const callback = (error, results, fields) => {
    
            if (error) {
                console.error("checkForUserCharacterAssociation", error);
                // typical error 500
                res.status(500).json(error) 
            }
    
            else {
                // means user and character not associated 
                if (results.length == 0) {
                 
                    res.status(400).json({message:"Character is not associated with the User"})
                }
                else {
                    // console.log(results) //check
                    next();
                }
    
            }
    
    
        }
        model.checkForUserCharacterAssociation(data, callback)



}


module.exports.getACharacterAssociatedWithUserInfo = (req, res, next) => {

    
    // store the character_id and user_id
    const data = {
        user_id: req.params.user_id,
        character_id: req.params.character_id
    }

    // console.log("hi")

    const callback = (error, results, fields) => {

        
        if (error) {
            console.error("getACharacterAssociatedWithUserInfo", error);
            // typical error 500
            res.status(500).json(error) 
        }
      
        else {
            if (results.length == 0) {
                console.log(results)
                res.status(400).json({message:"failed to get Character associated with user information"})
            }
            else {
                res.status(200).json(results[0])
            }

        }


    }
    model.getACharacterAssociatedWithUserInfo(data, callback)


}



// Endpoint B26



module.exports.checkIfUserHasCharacterAssociation = (req, res, next) => {

    // store user_id in data
    // we want to see if this specific user has associations with any characters in characteruserrel table, so we only need user_id here and in the sql 
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {

           
        if (error) {
            console.error("checkIfUserHasCharacterAssociation", error);
            // typical error 500
            res.status(500).json(error) 
        }
        else {
            // if results.length == 0 means the User doesent assocaite to any character
            if (results.length == 0) {
                res.status(404).json({message:"This user with user_id: "  + data.user_id + " does not associate to any character. Please create a character and try again"})
            }
            else {
                // if here means user associates to characters
                next();
            }

        }

    }
    // apparanetly use the same model as checkForUserChracterAssociation
    model.checkIfUserHasCharacterAssociation(data, callback)
}


module.exports.getAllCharactersAssociatedWithUser = (req, res, next) => {


    // store the userId
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("getAllCharactersAssociatedWithUser", error);
            // typical error 500
            res.status(500).json(error) 
        }
        else {
            if (results.length == 0) {
                console.log(results)
                res.status(400).json({message:"Cannot get User's Character"})
            }
            else {
                res.status(200).json(results)

            }
        }

    }   
    model.getAllCharactersAssociatedWithUser(data, callback)
}

// Endpoint B27

module.exports.updateSpecificCharacterAssociatedWithUser = (req, res, next) => {
    if (req.body.character_name == undefined || req.body.character_name == ""|| req.body.character_name == null) {
        return res.status(400).json({message:"character_name is missing!"})
    }
    const data = {
        character_id: req.params.character_id,
        user_id: req.params.user_id
    }

    // store the details to update the player associated with a user with
    const data2 = {
        character_name: req.body.character_name
        // cuz all fields in character is earned in the section B game so shouldnt give the user ability to update gold, silver, level, inventory etc, maybe later on can give them chance to update but we'll see
    }


    const callback = (error, results, fields) => {

        if (error) {
            console.error("updateSpecificCharacterAssociatedWithUser", error);
            // typical error 500
            res.status(500).json(error) 
        }

        else {
            // if results.affectedRows == 0 means nothing was updated
            if (results.affectedRows == 0) {
                res.status(400).json({message:"Character Associated With User was not updated"})
            }
            else {
                res.status(200).json({message:"Character Updated Successfully!"})
                    // this use to display id in message but change for frontend purpose
            }


        }

    }
    model.updateSpecificCharacterAssociatedWithUser(data, data2, callback)
}


// Endpoint B28

module.exports.deleteCharacterFromCharacterTable = (req, res, next) => {

    const data = {
        character_id: req.params.character_id
    }


    const callback = (error, results, fields) => {

        if (error) {
            console.error("deleteCharacterFromCharacterTable", error);
            // typical error 500
            res.status(500).json(error) 
        }

        else {
            // if results.affectedRows == 0 means it wasnt deleted
            if (results.affectedRows == 0) {
                res.status(400).json({message:"This character was not deleted from Character Table"})

            }
            else {
                // if here means succewssfully deleted player from player table now need go enxt fxn to delete player from playeruserrel
                next();
            }

        }


    }

    model.deleteCharacterFromCharacterTable(data, callback)
}



module.exports.deleteCharacterFromCharacterUserRelTable = (req, res, next) => {

    // store player and user id
    const data = {
        character_id: req.params.character_id,
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("deleteCharacterFromCharacterUserRelTable", error);
            // typical error 500
            res.status(500).json(error) 
        }
        else {

            if (results.affectedRows == 0) {
                res.status(400).json({message:"This Character was not deleted from characteruserrel table"})
            }
            else {
                // if here means player successfully deleted from both player and playeruserrel which should be because want to erase plaeyr what
                // 204 means nothing will be sent, no output 
                res.status(204).send()
            }

        }

    }

    model.deleteCharacterFromCharacterUserRelTable(data, callback)
    
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// Advanced Endpoint For Section A
 module.exports.getUserLeaderboard = (req, res, next) => {



    const callback = (error, results, fields) => {

        if (error) {
            console.error("deleteCharacterFromCharacterUserRelTable", error);
            // typical error 500
            res.status(500).json(error) 
        }
        else {

            if (results.length == 0) {
                res.status(404).json({message:"The leaderboard for ranking user points in section A is unavailable"})
            }
            else {
        
                res.status(200).json({message:"This is the User Leaderboard ranked by points, continue doing questions and see where you land!", results});
            }

        }

    }
    model.getUserLeaderboard(callback);

 }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END OF CA1 , BELOW IS FOR CA2 ALRDY
////////////////////////////////////////////////////////////////////////////////////////////////////////////


 // For user authentication -> register and login
// From Practical 6 
//////////////////////////////////////////////////////
// CONTROLLER FOR LOGIN
//////////////////////////////////////////////////////
// This function is responsible for handling login logic.
// It checks if the username and password are provided in the req body -> 400
// It then queries the database to find the user with the provided username. If dont have 404
// If the user exists, store the infromation in res.locals for later use
module.exports.login = (req, res, next) => {

    // check if req.body got username and password
    if (req.body.username == "" || req.body.username == undefined || req.body.username == null || req.body.password == "" || req.body.password == undefined || req.body.password == null) {
       return res.status(400).json({message:"Username or password is not provided"})
    }

    const data = {
        username : req.body.username,
        password: req.body.password
    }


    const callback = (error, results, fields) => {

        if (error) {
            res.status(500).json("Error login: ", error)
        }

        else {

            if (results.length == 0) {
                // if here means the user with username does not exist, cannot be found in the database
                res.status(404).json({message:"User not found"})
            }
            else {
                //if here means user found can go next, store the user information for later use
                res.locals.hash = results[0].password
                res.locals.userId = results[0].user_id
                console.log(res.locals.password)
                console.log(res.locals.userId)
                next();
                // i dont think need the other timestamps as information
                // email and password are actually the user informationn
            }

        }


    }
    model.login(data, callback)
}
 //////////////////////////////////////////////////////
// CONTROLLER FOR REGISTER
//////////////////////////////////////////////////////

// This function is responsible for handling the registration logic.
// It checks if the required fields (username, email, and password) are provided in the request body
// It then inserts the new user into the database with the hashed password.
// If the inserton is successful, it stores the user's ID in res.locals for later user
module.exports.register = (req, res, next) => {
    
    // checks if the required fields (username, email, and password) are provided with request body
    if (req.body.username == "" || req.body.username == undefined || req.body.username == null || req.body.password == "" || req.body.password == undefined) {
        console.log("username:" + req.body.username)
        return res.status(400).json({message:"The required field(s) (username and password) are not provided in the request body. Please register again with the required fields (username, email, and password)."})
    }

    // we need to insert the new user with the fields (username, email, and password) Also we need hashed password from prev fxn with res.locals
    const data = {
        username: req.body.username,
        password: req.body.password,
        hashed_password: res.locals.hash
    }

    console.log(data)

    const callback = (error, results, fields) => {

        if (error) {
           return res.status(500).json({message:"Error register:", error})
        }

        else {

            if (results.affectedRows == 0 ) {
                // if here means nothing was inserted , 400 error
               return res.status(400).json({message:"Insertion failed. New user was not register"})
            }
            else {
                // if here means isnert passed
                // store the user's id in res.locals for later use
                res.locals.userId  = results.insertId
                res.locals.message = "User " + data.username + " created successfully."
                next();
            }

        }



    }
    model.register(data, callback)

}

//////////////////////////////////////////////////////
// MIDDLEWARE FOR CHECK IF USERNAME OR EMAIL EXISTS
//////////////////////////////////////////////////////
module.exports.checkUsernameExist = (req, res, next) => {

    // store the username 
    const data = {
        username: req.body.username
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUsernameOrEmailExist", error);
        }
        else {
            if (results.length !== 0) {
                // if here means the username provided already exists so 409 conflict
                res.status(409).json({message: "Username already exists"})
            }
            else {
                // if here means that username or email is not in the database so its unique and can register
                next();
            }
            
        }

    }

    model.checkUsernameExist(data, callback)
}

//////////////////////////////////////////////////////
// MIDDLWARE FOR CHECK IF PLAYER BELONGS TO USER
//////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







// This is for user creating character
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Advanced Exercise Task 2

module.exports.checkPlayerBelongsToUser = (req, res, next) => {

    const data = {
        playerId: req.params.playerId,
        userId: res.locals.userId // this comes from verify token, the first fxn. The verify token fxn will have the userId but we must /jwt/generate with the "id: userId" in req.body to ensure it will have userId encoded
        
    }


    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error checkPlayerBelongsToUser", error)
            res.status(500).json({message:"Internal Server Error"})
        }
        else {
            if (results.length == 0) {
                res.status(404).json({message: "This player with playerId: " + data.playerId + " does not belong to user with userId: " + data.userId })
            }
            else {
                next();
            }
        }


    }

    model.checkPlayerBelongsToUser(data, callback)

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CA2 New Route to top up silver for Characters
// Endpoint B44
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.getUserPointsForTopUp = (req, res, next) => {


    const data = {
        user_id: req.params.user_id
    }

    
    const callback = (error, results, fields) => {

        if (error) {
            console.error("updateSpecificCharacterAssociatedWithUser", error);
            // typical error 500
            res.status(500).json(error) 
        }

        else {
            // if results.affectedRows == 0 means nothing was updated
            if (results.length == 0) {
                res.status(404).json({message:"This user does not have any points."})
            }
            else {
              res.locals.pointsTopUp = results[0].points
              console.log(res.locals.pointsTopUp)
              next();
            }


        }

    }

    model.getUserPointsForTopUp(data, callback)
}




module.exports.topupsilverforUserCharacter = (req, res, next) => {
 
    const data = {
        character_id: req.params.character_id,
        user_id: req.params.user_id,
        pointsTopUp: res.locals.pointsTopUp
    }



    const callback = (error, results, fields) => {

        if (error) {
            console.error("updateSpecificCharacterAssociatedWithUser", error);
            // typical error 500
            res.status(500).json(error) 
        }

        else {
            // if results.affectedRows == 0 means nothing was updated
            if (data.pointsTopUp == 0) {
                res.status(404).json({message:"This user has no points for a silver top up!"})
            }
        
            else {
                res.status(200).json({message: data.pointsTopUp + " silver was topped up for your character successfully!"})
            }


        }

    }
    model.topupsilverforUserCharacter(data, callback)
}


// New CA2 Route for Guid
// Endpoint B46 Guide
module.exports.guide = (req, res, next) => {

    const callback = (error, results, fields) => {
        // Making the steps constant to be nicely aligned so the front end will be nice
        const steps = "1. Register a User Account.\n\n" +
                      "2. Answer the Cyber Wellness Survey Questions to earn points Research is key!.\n\n" +
                      "3. Create a Character once you have a decent amount of points. Your points will be converted into silver.\n\n" +
                      "4. Battle Monsters using silver and earn gold and xp.\n\n" +
                      "5. Spend Gold to buy weapons in the shop and spin for items of varying rarity.\n\n" +
                      "6. View Your Inventory with various sorting and filtering options. You can also sell and delete items as you wish.\n\n" +
                      "7. Check Your Ranking anytime with the User and Character Leaderboards.\n\n" +
                      "8. Battle and Answer Your Way to Level 10 to become a certified master!";
    
        const formattedSteps = steps.replace(/\n/g, '<br>');
        // replace every \n with a <br> so that our frotn end will display the numbers in an aligned manner
        
    
        res.status(200).json({
            title: "How to Play Cyber Wellness Kingdom - Quiz Game",
            steps: formattedSteps,
            review: "Do leave a review of your experience playing Cyber Wellness Kingdom!",
            testimonial: results
        });
    };
    

    model.guide(callback)

}