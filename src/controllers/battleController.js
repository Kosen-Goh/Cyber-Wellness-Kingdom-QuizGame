const model = require('../models/battleModel');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B1 get all battle
module.exports.getAllBattles = (req, res, next) => {

   const callback = (error, results, fields) => {

    if (error) {
    console.error("Error getAllBattles:" , error)
    res.status(500).json(error)
    }
    else {
        res.status(200).json({battles_available: results, create_battle:"First, ensure your character is level 10 and you know it's character_id! To create or update a battle please change the request to post or put and provide the following: character_id, battle_name, battle_body. The other number values will be auto generated for your battle!"})
    }
  
   } 
   model.getAllBattles(callback)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B2
module.exports.checkBattleExistsByBattleId = (req, res, next) => {

    const data = {
        battle_id: req.params.battle_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkBattlesExistsByBattleId", error);
            res.status(500).json(error)
        }
        else {
            if (results.length == 0) {
                // 404 -> resource not found
                res.status(404).json({message:"Battle with battle_id: " + data.battle_id + " not found!"})
            }
            // go to next fxn after verified quest exists
            next();
        }

    }
    model.checkBattleExistsByBattleId(data, callback)
}


module.exports.getBattlesByBattleId = (req, res, next) => {

    // earlier alrdy check if battle_id exists so dont need results.length == 0 here
    const data = {
        battle_id: req.params.battle_id
    }

    const callback = (error, results, fields) => {

    if (error) {
        console.error("Error getBattlesByBattleId");
        res.status(500).json(error)
    }
    else {
        res.status(200).json(results[0])

    }

}

    model.getBattlesByBattleId(data, callback);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B3 if character level 10 , insert new battle
// will check the character name and see if its level 10 , if level 10 can post, if not , cannot
module.exports.checkCharacterLevelForPostBattle = (req, res, next) => {

    if (req.body.character_id == "" || req.body.character_id == undefined || isNaN(req.body.character_id)) {
        // we return to make sure only 1 status send, cuz if not more than 1 got ERR_HTTP_HEADERS_SENT ERROR
       return res.status(400).send({message:"Request body missing character_id"})
    }


    const data = {
        character_id: req.body.character_id
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error checkCharacterLevelForPostBattle", error);
            res.status(500).json(error)
        }
        else {
   
            if (results.length == 0) {
                res.status(404).json({message:'Character with id: ' + data.character_id +" not found. 404 resource not found"})
            }

             // Accessing the character_level from here so we can check if it is more than = 10 cuz only level 10 can add battles
            if (results[0].character_level < 10) { // if less than 10 , cant post quest, if 10 or > 10, can post battles
                res.status(400).json({message:"Character must have a minimum level of 10 to post battles!"})
            }

            else {
                next();
        }
    }
    
  }
    model.checkCharacterLevelForPostBattle(data, callback)
}



// This fxn used to validate the battle  body and check if the battle name provided is alrdy a quest inside Table Quests, if it is res 400 
module.exports.checkIfBattleExistsForPost = (req, res, next) => {

    if (req.body.battle_name == "" || req.body.battle_name == undefined || req.body.battle_body == "" || req.body.battle_body == undefined) {
       // we return to make sure only 1 status send, cuz if not more than 1 got ERR_HTTP_HEADERS_SENT ERROR
      return res.status(400).send({message:"Request body missing battle name or body"})
   }

   const data = {

    battle_name: req.body.battle_name

   }

   const callback = (error, results, fields) => {
       if (error) {
           console.error("Error validateBattleBodyForPut: ", error)
           res.status(500).json(error)
       }
       else {
           // if results length > 0 means that the battle_name already exist in Table Battles so character can't post this battle
       if (results.length !== 0) {
           console.error("Error checkIfBattleExistsForPost: ", error)
           res.status(409).json({message:"This battle name already exists please try again"})
       }
       // if results.length == 0 , means the "battle_name" doesen't exist in Table Battles so cahracter can make this battle
       else {
        
           next()
       }

       }
   }
   model.checkIfBattleExistsForPost(data, callback)
}


module.exports.postBattle = (req, res, next) => {

    // check for input
    if (req.body.battle_name == "" || req.body.battle_name == undefined || req.body.battle_body == "" || req.body.battle_body == undefined) {
        // we return to make sure only 1 status send, cuz if not more than 1 got ERR_HTTP_HEADERS_SENT ERROR
       return res.status(400).send({message:"Request body missing battle name or body"})
    }



    let randomCost = Math.floor(Math.random() * 30) + 10;    // 1 - 100 // cost should be 10 - 30 // so 10 - 30 
    let randomReward = Math.floor(Math.random() * 70) + 30;   // should be between 30 - 70
    let randomXp = Math.floor(Math.random() * 300 ) + 100     // should be between 100 - 300
    let randomMonsterHp = Math.floor(Math.random() * 1500) + 500 // should be between 500 - 1500
    let battle_steps = "Check your weapons by going adding /inventory to the route.";
   
    // store the battle information that character want to insert
    const data = {
        battle_name: req.body.battle_name,
        battle_cost: randomCost,
        battle_reward: randomReward,
        battle_xp: randomXp,
        battle_body: req.body.battle_body,
        battle_monster_hp: randomMonsterHp,
        battle_steps: battle_steps
  
    }
    console.log(data)
    /*
    sample POST 
       { 
      "character_id": 5,
        "battle_name": "The Dark Knight",
        "battle_body": "The Large Dark Knight is approaching you",

   }

    */

    const callback = (error, results, fields) => {
        if (error) {
            console.error("postBattle: ", error)
        }
        else { 
            if (results.affectedRows == 0) {
                res.status(400).json({message:"Nothing was inserted in Battles Table. New battle not posted"})
            }
        // posted question , go next fxn to display it
        next()
        }

    }
    model.postBattle(data, callback);
}

module.exports.getNewlyPostedBattle = (req, res, next) => {

    // use quest_name to ge tthe NewlyPostedQuest details
    const data = {
        battle_name: req.body.battle_name
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("getNewlyPostedBattle: ", error);
            res.status(500).json(error)
        }
        else {
            // 201 Created
            res.status(201).json({success: "Here is the new battle you posted!", new_battle: results[0]})
        }


    }
    model.getNewlyPostedBattle(data, callback);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B4: Update Quests details. Only level 10 Character

// part 1 check quest exists by quest_id is above in Endpoint B2


module.exports.updateBattle = (req, res, next) => {
    
    if (req.body.character_id == "" || req.body.character_id == undefined || isNaN(req.body.character_id)) {
        // we return to make sure only 1 status send, cuz if not more than 1 got ERR_HTTP_HEADERS_SENT ERROR
       return res.status(400).send({message:"Request body missing character_id"})
    } 
      // check for input
      if (req.body.battle_name == "" || req.body.battle_name == undefined || req.body.battle_body == "" || req.body.battle_body == undefined) {
        // we return to make sure only 1 status send, cuz if not more than 1 got ERR_HTTP_HEADERS_SENT ERROR
       return res.status(400).send({message:"Request body missing battle name or body"})
    }


    // just need update the battle name and battle body
    const data = {
        battle_id: req.params.battle_id,
        battle_name: req.body.battle_name,
        battle_body: req.body.battle_body,
 
  
    }

    const callback = (error, results, fields) => {

        if(error) {
            console.error("putBattle: ", error);
            res.status(500).json(error);
        }
        else {
            if(results.affectedRows == 0) {
              return  res.status(400).json({message:"The battle was not updated"})
            }
            else {
            next();
            }
        }
    }

    model.updateBattle(data, callback)
}


module.exports.getNewlyUpdatedBattle = (req, res, next) => {

       const data = {
        battle_id: req.params.battle_id
    }

    const callback = (error, results, fields) => {

    if (error) {
        console.error("Error getBattlesByBattleId");
        res.status(500).json(error)
    }
    else {
        // PUT is 200
        res.status(200).json({message:"Here is your newly updated battle" , results: results[0]})

    }

}

    model.getNewlyUpdatedBattle(data, callback);


}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B5: DELETE /quests/quest_id

module.exports.deleteBattle = (req, res, next) => {

    const data = {
        battle_id: req.params.battle_id
    }


    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteBattle:", error)
            res.status(500).json(error)
        }

        else {
            // 204 no content for delete
            res.status(204).send();

        }
    }

    model.deleteBattle(data, callback)
}
//////////////////////////////////////////////////////////////////////////