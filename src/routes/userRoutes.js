const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');  // for logging in and registering
const bcryptMiddleware = require('../middlewares/bcryptMiddleware'); // for logging in and registering




//////////////////////////////////////////////////////////////////////////////////////////////////
// For Registering, Logging in, authentication of user

//////////////////////////////////////////////////////////////////////////////////////////

router.post("/login", controller.login , bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);


router.post("/register", controller.checkUsernameExist, bcryptMiddleware.hashPassword, controller.register, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
/////////////////////////////////////////////////////////////////////////////////////////////////////




// New Endpoint For CA2 -> /guide 
// Endpoint B46
router.get("/guide", controller.guide)
///////////////////////////////////////


// use results.affected rows == 0 for update/

// Advanced Endpoint For Section A -> Leaderboard to rank users with points
router.get('/leaderboard', controller.getUserLeaderboard)
////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
// Endpoint 1: POST /users
router.post('/', jwtMiddleware.verifyToken, controller.checkUserExistByUsername, controller.postNewUser, controller.getNewUserInfo);
// '/' cuz we are in /users cuz we in userRoutes, so we dn go anywhere, jus here in '/users' and post a new user
/////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// Endpoint 2: GET /users
// Retrieve a list of all users with their respective user_id, username, and points
router.get("/", jwtMiddleware.verifyToken, controller.getAllUser);
// we need to GET all users with their information (do)
// no params  (params)
// no req.body (req.body)
// with no params and body, we dont have to validate anyt , so Just 1 controller-model
/////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
// Endpoint 3: GET /users/{user_id}
//Retrieve details of a specific user by providing their user_id. The response should
// must /:user_id cuz that specifies will be a number          // to shoq user_id              // to show completed qn
router.get('/:user_id', jwtMiddleware.verifyToken, controller.checkUserExistByUserId, controller.computeCompletedQuestions, controller.GetSpecificUserInfo) ;
/* Questione explicity write 'user_id' so we follow
include username, points, number of 
completed questions and points earned by the user
// we need to retrieve the details of a SPECIFIC user by their user_id  (do)
// parmas: 1 parmam : user_id (param)
// req.body : don't have (req.body)
// we need to validate the user_id , to see if the user exists (validation)
// We need 2 controller-models, 1 to check user exist, 1 to get the user details (controller-models)
// we already made a checkUserExist in Endpoint 1, by right we should reuse it, but that one when user not found, displays 409 as per 
// qn wants, but this Endpoint 3 wants it to be a 404 Not Found status, so I will make a new one caled checkUserExist2. Nah im trolling, wwe
// cannot use endpoint1 checkuserexist cuz that aims to , if user exist then error, endpoint 3 is if user doesent exist then error
// to compute the completed qns and points , need to use amount of rows 
// must compute the completed_qns and points
)

for this one completed_qns was not a column in the table. Also, we needed to make sure the output had "completed_questions" between the username and points. In userController's GetSpecificUser, we managed to get the output corretly, but we havent compute the completed_questions properly. We jus set itt as results[0] points 

*/
//////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////
// Endpoint 4: PUT /users/{user_id}
router.put('/:user_id', jwtMiddleware.verifyToken, controller.checkUserExistByUserId, controller.checkUserExistByUsername, controller.updateUsername, controller.getUpdatedUserInfo)
// flow: checkUserExist by user_id, check user exist by username, Update the username with specified "user_id", get the new user with its information
// we need to update user details by providing user_id in the URL and updating username in the request body
// parmas: user_id (parmas)
// body: username (req.body)
// we need to validate user_id, to see if user exists







/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start of User-Character Interactivity, to let User In Section A manage the characters they own in the game
// Start Of Section B 24 - 29
// starts at /users so dont include it below

// Endpoint B24 POST req to create a new character and associate with user , need to have a controller to give the character a basic weapon
router.post('/:user_id/character/' , jwtMiddleware.verifyToken, controller.checkUserExistForCharacter, controller.insertCharacterForUserInCharacterTable, controller.insertBasicWeaponForNewCharacterInventory, controller.insertNewCharForUserInCharUserRelTransferPoints )

// Endpoint B25 GET req to get a specific character associated with specific user
router.get('/:user_id/character/:character_id/', controller.checkUserExistForCharacter, controller.checkCharacterExist, controller.checkForUserCharacterAssociation, controller.getACharacterAssociatedWithUserInfo)



// Endpoint B26 GET to retrieve ALL Characters associated with a user
router.get('/:user_id/character/', controller.checkUserExistForCharacter, controller.checkIfUserHasCharacterAssociation, controller.getAllCharactersAssociatedWithUser)



// Endpoint B27 PUT req to update a specific character associated with a user
router.put('/:user_id/character/:character_id', jwtMiddleware.verifyToken,  controller.checkUserExistForCharacter, controller.checkCharacterExist, controller.checkForUserCharacterAssociation, controller.updateSpecificCharacterAssociatedWithUser )


// Endpoint B28 delete a specific Character associated with a User
router.delete('/:user_id/character/:character_id',  jwtMiddleware.verifyToken, controller.checkUserExistForCharacter, controller.checkCharacterExist, controller.checkForUserCharacterAssociation, controller.deleteCharacterFromCharacterTable, controller.deleteCharacterFromCharacterUserRelTable)


// // Endpoint B29 GET Info about ALL Characters using the CharacterUserRel table
// // -> its in /characters so go to characters Routes


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CA2 New Route to top up silver for Characters
// Endpoint B44
router.put('/:user_id/character/:character_id/topup', jwtMiddleware.verifyToken, controller.checkUserExistForCharacter, controller.checkCharacterExist, controller.checkForUserCharacterAssociation, controller.getUserPointsForTopUp,  controller.topupsilverforUserCharacter )
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////























module.exports = router