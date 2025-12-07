
const pool = require('../services/db');


/////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 1

module.exports.checkUserExistByUsername = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM
    User
    where username = ?
    `
    VALUES = [data.username];
    pool.query(SQLSTATEMENT, VALUES, callback);
}






module.exports.postNewUser = (data, callback) => {

    const SQLSTATEMENT = `
    INSERT INTO User (username, points)
    VALUES (?, ?)
    `
    VALUES = [data.username, data.points];
    pool.query(SQLSTATEMENT, VALUES, callback);

}


module.exports.getNewUserInfo = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM User
    WHERE username = ?
    `
    VALUES = [data.username];
    pool.query(SQLSTATEMENT, VALUES, callback);
}

////////////////////////////////////////////////////////////////////////////
// Endpoint 2

module.exports.getAllUser = (callback) => {

    // we want a SQLSTATEMENT that gets everything from User Table
    // so just do a SELECT * FROM User where * means ALL or Everything
    const SQLSTATEMENT = `
    SELECT user_id, username, points FROM User
    `;
    // We have no VALUES to pass in as there were no params or req.body for this endpoint
    // we pool.query our SQLSTATEMENT and callback to select everything from the user table, to display all users with all their information
    // and return the callback to UserModel's GetAllUser
    pool.query(SQLSTATEMENT, callback);
}
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Endpoint 3
// cannot add "completed_qns" in the table, should be computed , and displayed in the output, not using points also, must find a way to find out the amt of completed qns, pri key is allwoed to add
// otherwaise wont work, must derive the completed qns , not using pts 


// same as checkUserExist , cuz its jus using "user_id" to see if theres a user, then controller decides what to do with the result
// but instead of username its "user_id"
module.exports.checkUserExistByUserId = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM
    User
    where user_id = ?
    `

    // accessing the user_id we stored in UserModel's checkUserExist2
    VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);

}

module.exports.GetSpecificUserInfo = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM User 
    WHERE user_id = ?
    `;

    VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
    
}

module.exports.computeCompletedQuestions = (data, callback) => {
    // so we want an SQL STATEMENT THAT SELECTS the answered_questions_Id column with user_id
    const SQLSTATEMENT = `
    SELECT answered_question_id FROM UserAnswer 
    WHERE participant_id = ? 
    `;
    
    VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
}

/////////////////////////////////////////////////////////////////////

// Endpoint 4: POST /users/{user_id}

module.exports.updateUsername = (data, callback) => {

    const SQLSTATEMENT = `
    UPDATE User SET username = ? 
    WHERE user_id = ?;
    `;

    VALUES = [data.username, data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);


}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// SECTION B

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start of User-Character Interactivity, to let User In Section A manage the characters they own in the game
// Start Of Section B 23-28 

// Endpoint B24
module.exports.checkUserExistForCharacter = (data, callback) => {


    const SQLSTATEMENT = `
    SELECT * FROM User
    WHERE user_id = ?
    `
    VALUES = [data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}



// insert new Character that User created Into Character Table

module.exports.insertCharacterForUserInCharacterTable = (data, callback) => {

    // we want SQLSTATEMENT To insert new character in character tablle
    const SQLSTATEMENT = `
    INSERT INTO Characters (character_name)
    VALUES (?);

    `
    VALUES = [data.character_name]
    pool.query(SQLSTATEMENT, VALUES, callback )

} 


module.exports.insertBasicWeaponForNewCharacterInventory = (data, callback) => {

       // we want SQLSTATEMENT To insert new basic weapon in weapons tablle
       const SQLSTATEMENT = `
       INSERT INTO Inventory (owner_id, item_id)
       VALUES (?, 1);
       `
       // In the shop the first item is a wooden sword and its meant for all new characters so I put 1
       VALUES = [data.character_id]
       pool.query(SQLSTATEMENT, VALUES, callback)


}

// insert new Character id and User id (user that created the character) into CharacterUserRel Table
module.exports.insertNewCharForUserInCharUserRelTransferPoints = (data, callback) => {

    // we want SQLSTATEMNT to insert character_id and user_id into CharacterUserRel Table
    const SQLSTATEMENT = `
    INSERT INTO CharacterUserRel (character_id, user_id)
    VALUES (?, ?);

        
    UPDATE Characters 
    JOIN CharacterUserRel ON Characters.character_id = CharacterUserRel.character_id
    JOIN User ON CharacterUserRel.user_id = User.user_id
    SET Characters.character_silver = User.points, User.points = 0
    WHERE Characters.character_id = ?
    ;
    `
    // The second SQLSTATEMENT relates to our "Linking User Points and Character silver concept" so when new user creates the character, the user points must transfer to newly created character's silver
    // so this is the SQLSTATEMENT that will have with that, its basically same as the one found in init_tables, but has a WHERE to specify the specific newly created character
    // set user points = 0 after the transfer of all points to silver cuz yk is like u convert cents to dollars u cant keep the cents right u jus get the dollars
    VALUES = [data.character_id, data.user_id, data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}

// Endpoint B25

// we want a SQLSTATEMENT That selects a Characters by CharactersId
module.exports.checkCharacterExist = (data, callback) => {

const SQLSTATEMENT = `
SELECT * FROM Characters
WHERE character_id = ?
`
VALUES = [data.character_id]
pool.query(SQLSTATEMENT, VALUES, callback)
}



module.exports.checkForUserCharacterAssociation = (data, callback) => {

// we want an SQLSTATEMENT that uses userID nad character_id to select * from the characteruserrel
    // if got a result means that they are associaated
    const SQLSTATEMENT = `
    SELECT * FROM CharacterUserRel
    WHERE user_id = ? AND character_id = ?
    `
    VALUES = [data.user_id, data.character_id];
    pool.query(SQLSTATEMENT, VALUES, callback)


}


module.exports.getACharacterAssociatedWithUserInfo = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT CharacterUserRel.user_id, CharacterUserRel.character_id, User.username, Characters.character_name , Characters.character_level, Characters.character_silver, Characters.character_gold
    FROM CharacterUserRel
    INNER JOIN Characters ON CharacterUserRel.character_id = Characters.character_id
    INNER JOIN User ON CharacterUserRel.user_id = User.user_id
    WHERE CharacterUserRel.character_id = ? AND CharacterUserRel.user_id = ?
     `
    // without the AS only 1 created_On will be shown because conflcits so u may think the problem is at WHERE but is the AS
     VALUES = [data.character_id, data.user_id]
     pool.query(SQLSTATEMENT, VALUES, callback)



}

// Endpoint B26


module.exports.checkIfUserHasCharacterAssociation = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM CharacterUserRel
    WHERE user_id = ? 
    `
    VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback)

}


module.exports.getAllCharactersAssociatedWithUser = (data, callback) => {

    // we want an SQLSTATEMENT that gets stuff from characteruserel table, user table, character table
    // use AS INNER JOIN ON
    const SQLSTATEMENT = `
    SELECT CharacterUserRel.user_id, CharacterUserRel.character_id, User.username, Characters.character_name, Characters.character_level, Characters.character_silver, Characters.character_gold, Characters.character_xp, Characters.character_battles_won
    FROM CharacterUserRel
    INNER JOIN User ON CharacterUserRel.user_id = User.user_id
    INNER JOIN Characters ON CharacterUserRel.character_id = Characters.character_id
    WHERE CharacterUserRel.user_id = ?
    `
    //  need WHERE since we want select all characters associated to A SPECIFIC user 
    VALUES = [data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback);
}


// Endpoint B27

module.exports.updateSpecificCharacterAssociatedWithUser = (data, data2, callback) => {

    // we want an SQLSTATEMENT that updates a specific character that associates with a user, only character_name can be updated 
    const SQLSTATEMENT = `
    UPDATE Characters
    SET character_name = ?
    WHERE character_id = ?
    `
    VALUES = [data2.character_name, data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
    // do we need to update jus the character table or also the characteruserrel, cuz characterId doesent change jus the details of character, so i dont think so 



}

// Endpoint B28


module.exports.deleteCharacterFromCharacterTable = (data, callback) => {

    // we want an SQLSTATEMENT that deletes character from the character table
    const SQLSTATEMENT = `
    DELETE FROM Characters
    WHERE character_id = ?
    `
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}



module.exports.deleteCharacterFromCharacterUserRelTable = (data, callback) => {

    // we want an SQLSTATEMENT that deletes Character from CharacterUserRel Table
    const SQLSTATEMENT = `
    DELETE FROM CharacterUserRel
    WHERE character_id = ? AND user_id = ?
    `
    VALUES = [data.character_id, data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}


///////////////////////////////////////////////////////////////////////////////////////////////////

// Advanced Endpoint For Section A
module.exports.getUserLeaderboard = (callback) => {

    const SQLSTATEMENT = `
    SELECT 
    user_id,
    username,
    points,
    RANK() OVER (ORDER BY points DESC) AS user_rank
    FROM 
    User
    ORDER BY 
    user_rank ASC;

    `
    pool.query(SQLSTATEMENT, callback)
}






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// For login and registering
//////////////////////////////////////////////////////
// SELECT USER BY USERNAME
//////////////////////////////////////////////////////
// For login
module.exports.login = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM User
    WHERE username = ?
    `
    VALUES = [data.username]
    pool.query(SQLSTATEMENT, VALUES, callback)

}

//////////////////////////////////////////////////////
// SELECT USER BY USERNAME OR EMAIL
//////////////////////////////////////////////////////
module.exports.checkUsernameExist = (data, callback) => {

    // we want an SQL STATEMENT To select a user base on their username or email
    const SQLSTATEMENT = `
    SELECT * FROM User
    WHERE username = ? 
    `
    // use OR instead of AND because its for registering a user. When he give his username we want to check if this username exist, and if he give his email we want to check if this email exist so its OR not AND 
    VALUES = [data.username]
    pool.query(SQLSTATEMENT, VALUES, callback)
}



///////////////////////////////////////////////////////////////
// Insert a new user into the database with the hashed password
module.exports.register = (data, callback) => {

    // we want an SQLSTATEMENT to insert the new user into the database with the hashed password
    const SQLSTATEMENT = `
    INSERT INTO User (username, password)
    VALUES (?, ?)
    `
    VALUES = [data.username, data.hashed_password]
    pool.query(SQLSTATEMENT, VALUES, callback)

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CA2 New Route to top up silver for Characters
// Endpoint B44

module.exports.getUserPointsForTopUp = (data, callback) => {
    // we want an SQLSTATEMENT to get the user points
    const SQLSTATEMENT = `
    SELECT points 
    FROM User
    WHERE user_id = ?
    `
    VALUES = [data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}


module.exports.topupsilverforUserCharacter = (data, callback) => {
    // we want an SQLSTATEMENT to update a character's silver based on the points we just got from previous controller
    const SQLSTATEMENT =  `
    UPDATE Characters
    SET character_silver = character_silver + ?
    WHERE character_id = ?;


    UPDATE User 
    SET points = points - ?
    WHERE user_id = ?
    `
    VALUES = [data.pointsTopUp, data.character_id, data.pointsTopUp, data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}

// after top up silver, need deduct the points from user so he has to do more surveys to top up his character


// New CA2 Endpoing - Guide, this modal will get good testimonial for our guide

module.exports.guide = (callback) => {

    // we want an SQLSTATEMENT to get a testimonal in the reviews table
    const SQLSTATEMENT = `
    SELECT Reviews.review_amt, Reviews.review_text, User.username FROM Reviews 
    INNER JOIN User ON Reviews.user_id = User.user_id
    WHERE review_amt = 5
    ORDER BY RAND() 
    LIMIT 3
    `
// we only want the 5 star review test to show the people want to dispaly the stars also
// WE limit 3 only cuz we dont want to much. We order by rand cuz I want random 5 star reviews to be populated every time so the non logged in user can see all the uniquely different good reviews
// make a inner join to get the username of the particular review
    pool.query(SQLSTATEMENT, callback)
}