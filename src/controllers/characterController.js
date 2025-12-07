const model = require('../models/characterModel');



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B6 - getAllCharacters
module.exports.getAllCharacters = (req, res, next) => {

    const callback = (error, results, fields) => {
        if (error) {
            console.error("getAllCharacters: ", error);
            res.status(500).json(error);
        }
        else {
            res.status(200).json(results);
        }
    }
    model.getAllCharacters(callback);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B7 get character by character Id

module.exports.checkCharacterExistByCharId = (req, res, next) => {

    // store the character_id
    const data = {
        character_id: req.params.character_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("checkCharacterExistsByCharId: ", error)
            res.status(500).json(error);
        }
        else {

            if (results.length == 0) {
                // results.length == 0 means char dont exist, so 404 not found
                res.status(404).json({message:"Character with character_id: " + data.character_id + " does not exist!"})
            }
             else {
            // if there is a character go next fxn
                next();
             }
        }
    }
    model.checkCharacterExistByCharId(data, callback);
}


module.exports.getCharacterByCharId = (req, res, next) => {

      // store the character_id
   const data = {
        character_id: req.params.character_id
    }

    const callback = (error, results, fields) => {

        if(error) {
            console.error("Error getCharacterByCharId:", error);
            res.status(500).json(error)
        }
        else {
            res.status(200).json(results[0]);
        }
    }
    model.getCharacterByCharId(data, callback)
}





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B8 DELETE Characters
// part 1 to check if character exist by ID, use the B7'S checkCharacterExistById

module.exports.deleteCharacter = (req, res, next) => {

    const data = {
        character_id: req.params.character_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteCharacter: ", error)
            res.status(500).json(error)
        }
        else {
            // 204 no reply 
            res.status(204).send();
        }

    }

    model.deleteCharacter(data, callback);
}

//////////////////////////////////////////////////////////////////////////////////////////////////


// Endpoint B9 -> get all battles for character to select
// We want to get all battles for character to see and select one later on

// To make the battle interface more peersonalized
module.exports.getCharacterInfoForBattleInterface = (req, res, next) => {

    const data = {
        character_id: req.params.character_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getCharacterInfoForBattleInterface: ")
            res.status(500).json("Internal Server error")
        }
        else {
            // double check
            if (results.length == 0) {
                res.status(404).json({message:"Character Info for character_id: " + data.character_id + " not found!"})
            }
            else {
                // name, silver
                res.locals.character_name = results[0].character_name
                res.locals.character_silver = results[0].character_silver
                next();
            }

        }


    }
    model.getCharacterInfoForBattleInterface(data, callback)
}


module.exports.getAllBattlesForCharacter = (req, res, next) => {

    const data = {
        character_name: res.locals.character_name,
        character_silver: res.locals.character_silver
    }

    // no need any data cuz its jus selecting from battles

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error getAllBattlesForCharacter: ", error)
            res.status(500).json(error)
        }
        else {
            res.status(200).json({message:"Greetings " + data.character_name + "! Here are the available battles.", Info: "Each battle will cost you a certain amount of silver which can be seen from the battle_cost" , Guide: "To accept a battle please use a PUT request and place the battle_id of your desired battle in the request body", silver:"You have " + data.character_silver + " silver", battle_list: results})
        }
        // actually also can use "AS" in sql to change the column name to "silver_needed" in display but eh
    }

    model.getAllBattlesForCharacter(callback);

}

/////////////////////////////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 10 Accept battle for Character

// get the character_silver (silver) to check if character can accept this battle
module.exports.getCharacterSilver = (req, res, next) => {
    const data = {
        character_id: req.params.character_id
    }



    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error getCharacterSilver: ", error)
            res.status(500).json(error)
        }

        else {
            // double check
            if (results.length == 0) {
                res.status(404).json({message:"The character silver for character_id: " + data.character_id + " not found!"})
            }
    
            else {
            res.locals.character_silver = results[0].character_silver
            next();
            }

        }

}
    model.getCharacterSilver(data, callback)
}




// get the battle_cost (silver) to be deducted from the character after he accept this quest
module.exports.getCostOfBattle = (req, res, next) => {
    
    // need the character_battle_id to get that battles battle_cost , character_battle_id = battle_id
    const data = {
        character_battle_id: req.body.battle_id,
        character_id: req.params.character_id,
        character_silver: res.locals.character_silver
    }
    
    
    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error getCostOfBattle: ", error)
            res.status(500).json(error)
        }

        else {
              if (results.length == 0 ) {
                return res.status(404).json({message:"Battle cost for Battle with battle_id: " + data.character_battle_id + " not found!"})
              }
              // need to check if the person have enough silver to play battle, then subtract silver
              // 403 forbidden cannot accept the battle cuz not enough silver  
              console.log(data)
              if (results[0].battle_cost > data.character_silver) {
               return res.status(403).json({message:"You do not have enough silver to accept this battle. Battle with battle_id: " + data.character_battle_id + " was not accepted!"})
           
            }
            // console.log(results);
            else {
            res.locals.battle_cost = results[0].battle_cost
            next();
         }
        }

}
    model.getCostOfBattle(data, callback)
}


module.exports.updateBattleIdAndDeductSilverForCharacter = (req, res, next) => {
    // validating battle_id. If character put a nonexistent battle_id or put some random "" or unwanted input thenn validate
    if (req.body.battle_id == undefined || req.body.battle_id == "" || req.body.battle_id == null || isNaN(req.body.battle_id)) {
        return res.status(400).json({message:"The battle_id provided does not exist or is not acceptable input. Battle not Accepted!"})
    } 

    // store the battle_id that character put in req.body, also the character Id that u want to update the character_battle_id la
    const data = {
        character_battle_id: req.body.battle_id,
        character_id: req.params.character_id,
        battle_cost: res.locals.battle_cost,
        character_silver: res.locals.character_silver
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error updateBattleIdAndDeductSilverForCharacter: ", error)
            res.status(500).json(error)
        }
        // need to cater for if the battle_id did not select anything
        // need to cater for the cost of each battle which will be in SQL 
        else {
        
            res.status(200).json({message:"Battle with battle_id: " + data.character_battle_id + " has been accepted!", cost: data.battle_cost + " silver has been deducted from character " + data.character_id })
 
        }   // if want cna make message more personal with user and character name but for now nah , "u have x silver left answer more qns in survey to get more silver"
            // problem: if user completes more qns in the runing instance it may not translate to silver immediately because theres no action to trigger the update to link them
    }
    model.updateBattleIdAndDeductSilverForCharacter(data, callback)
    
}








/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint 16 GET /characters/character_id/battleinstance
// GET the battleinstance that the character has attached to him 


module.exports.selectCharacterBattleId = (req, res, next) => {

    // store character_id to select the character_battle_id
    const data = {
        character_id: req.params.character_id
    }

    const callback = (error, results, fields) => {
        if(error) {
            console.error("Error selectCharacterQuestId", error)
            res.status(500).json(error);
        }
        else {
            // if results.length == 0 means never select properly
            if (results.length == 0 ) {
                res.status(404).json({message:"This character does not have any accepted battle"})
            }
            else {
                //selecting [{battle_ID: 100}] -> the battle_id part
                res.locals.character_battle_id = results[0].character_battle_id
                next();
            }


        }
  
    }

    model.selectCharacterBattleId(data, callback)

}



// This fxn gets the battleinstance interface for the character to see and start playing the battle uses the Battle table with the stuff that was in BattleInstance but put all in Battles for more efficient and prevent duplication s
module.exports.getBattleInstanceByBattleId = (req, res, next) => {


    // store character battle id to get battle instance
    const data = {
        character_battle_id: res.locals.character_battle_id
    }
    console.log(data)


    const callback = (error, results, fields) => {

        if(error) {
            console.error("Error getBattleInstanceByBattleId", error)
            res.status(500).json(error);
        }
    
        else {
            if (results.length == 0) {
                res.status(404).json({message:"This character does not have any accepted battle. Character_battle_id: " + data.character_battle_id , how_to_battle: "Please go to /battles and accept a battle!"})
            }

            else { 
            // displays the battleinstance interface with the monster hp for character to start playing the battle
            res.locals.battle_name = results[0].battle_name
            res.status(200).json(results[0])
            }
        }


    }

    model.getBattleInstanceByBattleId(data, callback)

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B17 get All character weapons

module.exports.getWeaponsOwnedByCharacter = (req, res, next) => {

    // character_id use to find the character weapon
    const data = {
        character_id: req.params.character_id
    }

    
    const callback = (error, results, fields) => {

        if(error) {
            console.error("Error getWeaponsOwnedByCharacter", error)
            res.status(500).json(error);
        }

        else {
           if (results.length == 0) {
            res.status(404).json({message:"Character with character_id: " + data.character_id + " does not have a weapon"})
           }
           else {
            res.status(200).json({message: "Here are your weapons in your inventory. Choose a weapon, and make a PUT request using weapon_id: x (where x is the id of your selected weapon), removing '/inventory' from the url.", weapons:results})
           }
        }


    }
    model.getWeaponsOwnedByCharacter(data, callback)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B18
// last part to insert damage, defeat boss, get gold etc
// now to insert weapon damage, receive the weapon id in the req.body get the numerical damage value and minus from the boss and then get the new boss hp

module.exports.getWeaponDamage = (req, res, next) => {

    if (req.body.weapon_id == undefined || req.body.weapon_id == "" || req.body.weapon_id == null) {
        return res.status(400).json({message:"weapon_id field missing. Please put weapon_id: followed by the weapon_id of your weapon to deal damage to the boss"})
    }

    // get the weapon id given in req.body
    const data = {
        weapon_id:req.body.weapon_id,
        character_id:  req.params.character_id
    }
    
    const callback = (error, results, fields) => {

        if(error) {
            console.error("Error getWeaponsOwnedByCharacter", error)
            res.status(500).json(error);
        }
        else {
            if (results.length == 0) {
                res.status(404).json({message:"No weapon_damage was found. This could be because your character does have a weapon with id: " + data.weapon_id + " in his/her inventory."})
            }
            else {
               // store weapon damage in res.locals
               res.locals.weapondamage = results[0].item_damage
               console.log(results[0])
               console.log(res.locals.weapondamage) // so the damage is here and we pass it to the next fxn and subtract that from boss health
              next();
            }

        }


    }
    model.getWeaponDamage(data, callback)
}



module.exports.insertWeaponDamageToMonster = (req, res, next) => {

    // store weapon damage we stored earlier in prev fxn, we declare as inflicted_damage to the boss
    // also got battle_id from the earlier endpoint to select correct battleid
    const data = {
        inflicted_damage: res.locals.weapondamage,
        character_battle_id: res.locals.character_battle_id
    }
    
    const callback = (error, results, fields) => {
        
        if(error) {
            console.error("Error getWeaponsOwnedByCharacter", error)
            res.status(500).json(error);
        }
        else {
            if (results.affectedRows == 0) {
                res.status(400).json({message:"You have already defated this monster. No damage was inflicted to the boss. Error"})
            }
            else {

                // go to next fxn to see what happen after u dealt damage with your weapon!!
                next();

            }
        }

    }


    model.insertWeaponDamageToMonster(data, callback)
}

// get affected battle instance to see now the new hp once we dealt damage from the previous fxn

module.exports.getAffectedBattleInstance = (req, res, next) => {

    const data = {
        inflicted_damage: res.locals.weapondamage,
        character_battle_id: res.locals.character_battle_id
    }


    const callback = (error, results, fields) => {
        
        if(error) {
            console.error("Error getWeaponsOwnedByCharacter", error)
            res.status(500).json(error);
        }
        else {
            // if the hp is 0 means the character defeated the boss , we do a next so we can give the character the reward 
            if (results[0].battle_monster_hp == 0 || results[0].battle_monster_hp <= 0) {
              
           // if here means monster has been defeated and we need go next fxns to get reward, check level etc
                res.locals.battle_name = results[0].battle_name
                next();
            }
            else {
                // if here means monster has not been defeated and we dont need go next fxn
                return res.status(200).json({damage_dealt: "You have inflicted " + data.inflicted_damage + " hp of damage!", results})
            }
        }

    }
    model.getAffectedBattleInstance(data, callback)

}


module.exports.getCompletedBattleRewards = (req, res, next) => {

    // we need the  character_battle_id to get rewards, character_id to delete the battle so character can abuse the button once its finisj
    const data = {
        battle_id:res.locals.character_battle_id,
        character_id: req.params.character_id
    }
    const callback = (error, results, fields) => {

        if(error) {
            console.error("Error getCompletedBattleRewards", error)
            res.status(500).json(error);
        }
        else {

            if (results.length == 0 ) {
                // If results.length == 0 means resource not found and must 404
                res.status(404).json({message:"Unable to find battle rewards for battle_id: " + data.battle_id})
            }
            else {
                // lets store the rewards so we can give our character
                res.locals.goldToGiveCharacter = results[0].battle_reward
                res.locals.xpToGiveCharacter = results[0].battle_xp
                next();
            }
        }

    }
    model.getCompletedBattleRewards(data, callback)

}


module.exports.giveRewardsAndNullCharBattleId = (req, res, next) => {

    // store the character battle id which we may or may not need 
    // what we definitely need is character_id to add gold to
    // battle_name for our congrats message
    const data = {
         character_battle_id: res.locals.character_battle_id,
         character_id: req.params.character_id,
         battle_name:  res.locals.battle_name,
         gold_earned: res.locals.goldToGiveCharacter,
         xp_earned: res.locals.xpToGiveCharacter
        
    }
    console.log(data)
   

    const callback = (error, results, fields) => {

        if(error) {
            console.error("Error displayCongratsMessageAndGiveGold", error)
            res.status(500).json(error);
        }

        else {
            // means gold was not added to the character
            if (results.affectedRows == 0) {
                res.status(400).json({message:"No Gold was added to User. Error"})
            }
            else {
             
                // currently if character spam te button they can keep getting gold so how do I make sure after, I can mark this battle as complete, I can set the character_battle_id to null 
                // return res.status(200).json({message:"Congratualations! You defeated " + data.battle_head + " You earned " +  data.gold_earned + " gold" + " and " + data.xp_earned + " xp!"})
                next();
                
            
            }

        }

    }

    model.giveRewardsAndNullCharBattleId(data, callback)
}


module.exports.checkLevelForCharacter = (req, res, next) => {
    // this controller helps check what level the character is after earning xp from the boss
    const data = {
        character_battle_id: res.locals.character_battle_id,
        character_id: req.params.character_id,
        battle_name:  res.locals.battle_name,
        gold_earned: res.locals.goldToGiveCharacter,
        xp_earned: res.locals.xpToGiveCharacter
    }

    const callback = (error, results, fields) => {
    
        if(error) {
            console.error("Error getWeaponsOwnedByCharacter", error)
            res.status(500).json(error);
        }
    
    
        else {
            // always need to check if our sql statement did anyt
            if (results[0].length == 0) {
                res.status(400).json({message:"Error Failed to Select Character with character_id: " + data.character_id + " character_xp"})
            }

            let newLevel = 0;
            for (i= 1; i <= 10; i++) {
                xp = i * 100
                console.log('Checking level:', i, 'with XP threshold:', xp); // threshold means value
                if (results[0].character_xp == xp || results[0].character_xp >= xp ) {
                    newLevel = i;
                    console.log('New level:', newLevel);
                }
                else {
                    break;
                }

            }
            newLevel = Math.min(newLevel, 10); // Ensure the level doesn't exceed 10 // Math.min() is a built-in function in JavaScript that returns the smallest of zero or more numbers. 
            console.log('Final New Level:', newLevel); // Debugging: Check final level value
            res.locals.character_new_level = newLevel // store new level for next controller to access it
            res.locals.character_name = results[0].character_name // store character name so next controller can access it
            res.locals.character_current_level = results[0].character_level // need store character current level for next controller to see if 
            console.log('Stored New Level:', res.locals.character_new_level);
            console.log('Stored Character Name:', res.locals.character_name);
            console.log('Stored Current Level:', res.locals.character_current_level);
        
            next();
          
     }

    }

    model.checkLevelForCharacter(data, callback)
}


module.exports.updateLevelRegenMonsterAndDisplayCongratsMessage = (req, res, next) => {
    // this controller will update the character level, cuz previous controller determined that character has levelled up, if here mans character level up and need to update the character level
    // and display the level up message

    // store the new level from res.locals in previous controller and stuff we need to make a congrats message in the scenario where level up occurs
    const data = {
        character_battle_id: res.locals.character_battle_id,
        character_id: req.params.character_id,
        battle_name:  res.locals.battle_name,
        gold_earned: res.locals.goldToGiveCharacter,
        xp_earned: res.locals.xpToGiveCharacter,
        character_new_level: res.locals.character_new_level,
        character_name:  res.locals.character_name ,
        character_current_level: res.locals.character_current_level
    }


    const callback = (error, results, fields) => {
        if(error) {
       
            console.error("Error displayCongratsMessageAndGiveGold", error)
            res.status(500).json(error);
        }

        else {
        // means nothing was updated
        if (results.affectedRows == 0) {
            res.status(400).json({message:"Character level was not updated. Error for updateLevelAndDisplayCongratsMessage"})
        }

            // if character did not level up
            if (data.character_new_level == data.character_current_level) {
             // we display a message without level-up , which is original dislayCongratsMessageAndGiveRewards Message
               // currently if character spam te button they can keep getting gold so how do I make sure after, I can mark this battle as complete, I can set the character_battle_id to null 
               return res.status(200).json({message:"Congratualations! You defeated " + data.battle_name + " You earned " +  data.gold_earned + " gold" + " and " + data.xp_earned + " xp!"})
          }

            // need to account for when they reach level 10 then they message must be slightly different to tell them they are a master
            if (data.character_new_level >= 10) {
                return res.status(200).json({message:"Congratualations " + data.character_name + "! You defeated " + data.battle_name + " You have earned " +  data.gold_earned + " gold" + " and " + data.xp_earned + " xp!", level_up: "Excellent!"  + " you have reached level " + data.character_new_level + "! You are now a Master " + data.character_name + "! Your character now has the {master} title. You can now post new battles and post your items in the shop. Congrats!"})

            }
            else {
                console.log("character_new_level: " + data.character_new_level)
            // now we display the congrats message and all that , same as the previous controller jus that we need add a level up message for this scenario since there is a level up
            return res.status(200).json({message:"Congratualations " + data.character_name + "! You defeated " + data.battle_name + " You have earned " +  data.gold_earned + " gold" + " and " + data.xp_earned + " xp!", level_up: "Bravo!"  + " you have reached level " + data.character_new_level + "! You're on your way to becoming a Master"})
            }    
        
    }


    }
    // controller jus merely shows message and new level but model is the one to update the actual character level with the new level tabulated in previous controller
    model.updateLevelRegenMonsterAndDisplayCongratsMessage(data, callback);
}
 









// we need to reset the boss health so I thinking we should res.locals from 1 part and then regenerate it once player done 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////<START OF ChARACTER-SHOP INTERACTIVITY -> BUY, SELL, LUCKY SPIN>

// Character-Shop Interactivity -> for characters to buy items
// Endpoint B19 (view shop)

module.exports.getCharacterInfoForShopInterface = (req, res, next) => {
    // this controller used to get character name and gold so the shop later can use to display character name and gold , making it s more personalized and dynamic and interactive shop.
    const data = {
        character_id: req.params.character_id
    }
    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error getShopForCharacter", error)
            res.status(500).json(error);
        }
        else {
            // previous fxn alrdy check if character with character id exists
            // store the character_name and character_gold in res.locals
            res.locals.character_name = results[0].character_name
            res.locals.character_gold = results[0].character_gold
            // now our next controlller can access 
            next();
        }

    }

    model.getCharacterInfoForShopInterface(data, callback)
}


module.exports.getShopForCharacter = (req, res, next) => {

    // store character_id and access the res.locals we declare in previous controlller to get character_name and character_gold for shop interface
    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        character_gold: res.locals.character_gold
    }
   
    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error getShopForCharacter", error)
            res.status(500).json(error);
        }
        else {
            
            // Can show character name and gold in respond to make it a more personalised and interactive shop++ lets add chareacter name and gold first then later we do more
            // An interactive and personalized shop showing unique character name and gold
            res.status(200).json({message:"Greetings " + data.character_name + "." + " Welcome to the Tavern-Shop! " , gold: "You have " + data.character_gold +" gold!" , rarity_system: "Legendary = Gold, Epic = Purple, Rare = Red, Uncommon = Grey, Common = White", purchaseGuide: "Use a PUT request and enter item_id: x where x is the item_id", shop: results, sell_items: "First, ensure your character is level 5 and you take note of the item_id of the item you want to sell. To sell an item please do a POST and add /sell to the url and provide the following: item_id.", lucky_spin:"Try your luck and spin the wheel to get a random item of random rarity from the shop! Legendary and Epic items await you! Each spin costs 50 gold" })
        }


    }

    model.getShopForCharacter(data, callback)
}

//


// Endpoint B20 (Character-Shop Interactivity) -> for character to actually buy items
// Endpoint B20 (For character to buy the item) =

module.exports.checkIfItemExists = (req, res, next) => {

    if (req.body.item_id == undefined || isNaN(req.body.item_id) || req.body.item_id == null) {
        return res.status(400).json({message:"Missing item_id in req.body"})
    }

    const data = {
        item_id: req.body.item_id
    }

    const callback = (error, results, fields) => {
        
        if(error) {
            console.error("Error checkIfItemExists", error)
            res.status(500).json(error);
        }
        else {
            if (results.length == 0) {
                res.status(404).json({message: "The item you are trying to buy with item_id: " + data.item_id + " is not found!"})
            }
            else {
                next();
            }
        }
    }
    model.checkIfItemExists(data, callback)

}

module.exports.checkIfCharacterOwnsItemAlready = (req, res, next) => {


// check to see if Character already own the item he is trying to buy
    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        character_gold: res.locals.character_gold,
        item_id: req.body.item_id // we need the item_id to get the item_cost and do the math to see if the character can buy
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error checkIfCharacterOwnsItemAlready: ", error);
            res.status(500).json(error);
        }
         // if character inventory empty , if they delete everyt for e.g. or use a preddefined character with empty inventory, by right at the start every new character has a wooden sword in inventory
         if (results.length == 0) {
            // means inventory empty and dn check if alrdy have item , go next fxn
            next();
        }
      //  logic flow correctly handles cases where the results array is empty and avoids accessing properties of an undefined object.
      else {


        console.log(data.item_id, results[0].item_id);
        // Check if the item is already owned by the character; if here, means inventory is not empty
        for (let i = 0; i < results.length; i++) {
            if (data.item_id == results[i].item_id) {
                // because the item_id in shop reflects the item_id in the Inventory so can do this check
                return res.status(403).json({message: "Forbidden! You have already bought this item! You cannot buy an item more than once!"});
            }
        }
        next();
    }
              
          }   
        

    model.checkIfCharacterOwnsItemAlready(data, callback)

}

module.exports.checkCharacterGoldEnough = (req, res, next) => {
    

        const data = {
            character_id: req.params.character_id,
            character_name: res.locals.character_name,
            character_gold: res.locals.character_gold,
            item_id: req.body.item_id // we need the item_id to get the item_cost and do the math to see if the character can buy
        }

        const callback = (error, results, fields) => {

            if (error) {
                console.error("Error checkAndSubtractCharacterGold: ", error);
                res.status(500).json(error);
            }
       
            else {
                // here is the actual calculation once we get the item_cost
                if (data.character_gold < results[0].item_cost) {
                    // add item name to response so nicer
                    let gold_lacking = results[0].item_cost - data.character_gold
                    // may want to change to 403 forbidden
                    res.status(403).json({message:"You do not have enough gold to purchase " + results[0].item_name, gold_needed:"You need " + gold_lacking + " more gold!"})
                }

                else {

                    if (results.length == 0) {
                        return res.status(404).json({message:"This item with item_id: " + data.item_id + " does not exist"})
                    }

                    // check if the item the person trying to be its his own listed item
                    if (results[0].item_owner_id == data.character_id) {
                        // check if the item that the character buying is an item he listed 
                        return res.status(400).json({message:"You can't buy an item that you have listed." + " item_owner_id: " + results[0].item_owner_id + " matches " + "character_id: " + data.character_id})
                    }


                // if they have enoguh gold
                if (data.character_gold >= results[0].item_cost) {
                // go to next controller to subtract gold from character and add the owner_id and item_id into inventory/weapons yk
                    res.locals.item_name = results[0].item_name
                    res.locals.item_cost = results[0].item_cost
                    res.locals.item_owner_id = results[0].item_owner_id
                    next();

                }
            }

            }


        }

        // check if enough gold

        model.checkCharacterGoldEnough(data, callback)

}

module.exports.subtractGoldAndAddItemForCharacterInventory = (req, res, next) => {

    // store all the stuff we need
    const data = {
        character_id: req.params.character_id,  //will be owner_id in Inventory
        character_name: res.locals.character_name,
        character_gold: res.locals.character_gold,
        item_id: req.body.item_id,    // will be item_id in Inventory
        item_name: res.locals.item_name,
        item_cost: res.locals.item_cost,
        item_owner_id: res.locals.item_owner_id
        
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error subtractGoldAndAddItemForCharacter: ", error);
            res.status(500).json(error);
        }
        else {
            // subtract and add the item to characters WEAPONS -> all in the model so we dont need do anyt here jus check if it actually did so
            if (results.affectedRows == 0) {
                res.status(400).json({message:"Transaction failed. Unable to purchase this item. As a result, no gold was taken from your account"})
            }
            //if here means it did subtract and update
            else {

                // for buying other character stuff, item_owner_id != null  means its a item that another character posted
                console.log(data.item_owner_id)
                // If the item is another character's listed item, must give the gold to the seller and remove the thing from item shop
                if (data.item_owner_id != null) {
                    next();
                }

                else {
                // success message thanks for shopping
                res.status(200).json({message: "You have purchased " + data.item_name + "! Thanks for shopping with Tavern-Shop!"})
                }    
            }

        }



    }
    model.subtractGoldAndAddItemForCharacterInventory(data, callback)
}

module.exports.giveGoldtoSellerAndRemoveFromShop = (req, res, next) => {

       // store all the stuff we need
       const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        character_gold: res.locals.character_gold,
        item_id: req.body.item_id,
        item_name: res.locals.item_name,
        item_cost: res.locals.item_cost,
        item_owner_id: res.locals.item_owner_id
        // item_damage: res.locals.item_damage,
        // item_description:  res.locals.item_description ,
        // item_type: res.locals.item_type,
        // item_rarity: res.locals.item_rarity
    }

    
   

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error giveGoldtoSellerAndRemoveFromShop: ", error);
            res.status(500).json(error);
        }
        else {
            // subtract and add the item to characters WEAPONS -> all in the model so we dont need do anyt here jus check if it actually did so
            if (results.affectedRows == 0) {
                res.status(400).json({message:"Failed to give gold to item owner"})
            }

      

            //if here means it did subtract and update
            else {
              res.status(200).json({message: "You have purchased " + data.item_name + " from character with character_id: " + data.item_owner_id + ". Thanks for shopping with Tavern-Shop!"})
                    
            }

        }



    }
    model.giveGoldtoSellerAndRemoveFromShop(data, callback)


}

// SELL
// Endpoint B21
///////////////////////////////////////////////////////////////////////////////////<SELL>
module.exports.checkCharacterLevelToSell = (req, res, next) => {

    const data = {
        item_id: req.body.item_id,
        character_id: req.params.character_id
     }
 
     const callback = (error, results, fields) => {
 
         if (error) {
             console.error("Error checkIfCharacterOwnItem: ", error);
             res.status(500).json(error);
         }
         else {
             // subtract and add the item to characters WEAPONS -> all in the model so we dont need do anyt here jus check if it actually did so
             if (results.length == 0) {
                 // if here means the character id dont own the item id
                 res.status(404).json({message:"Failed to get character level to check if can post " })
             }
             //if here means it did subtract and update
             else {
                 // check if character level = 5
            

                  if (results[0].character_level < 5) {
    
                  return res.status(400).json({message:"Your character must be level 5 to sell items! " + "Your character_id: " + data.character_id + " is only level: " + results[0].character_level })
                   }

                   else {
                     next();
                   }

                 }
 
         }
 
     }
     model.checkCharacterLevelToSell(data, callback)


    }



module.exports.checkIfCharacterOwnItem = (req, res, next) => {

    // if (req.body.item_id == undefined || isNaN(req.body_item_id) || req.body.item_id == null || req.body.item_id == "") {
    //     return res.status(400).json({message:"Invalid input. Please enter item_id followed by an item_id of an item you want to sell. You can check /inventory if you are not sure what items you own"})
    // }

    const data = {
       item_id: req.body.item_id,
       character_id: req.params.character_id
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error checkIfCharacterOwnItem: ", error);
            res.status(500).json(error);
        }
        else {
            // subtract and add the item to characters WEAPONS -> all in the model so we dont need do anyt here jus check if it actually did so
            if (results.length == 0) {
                // if here means the character id dont own the item id
                res.status(404).json({message:"Your character does not own item_id: " + data.item_id + " sale of item failed." })
            }
            //if here means it did subtract and update
            else {
                let itemFound = false;
                for (let i = 0; i < results.length; i++) {
                    console.log(data.item_id, results[i].item_id)
                    if (data.item_id == results[i].item_id) {
                      
                        // because the item_id in shop reflects the item_id in the Inventory so can do this check
                      console.log("Character " + data.character_id + " wanted to sell item: " + data.item_id + " and he does own item: " + results[i].item_id +" as after combing thorugh the item_id where owner_id: " + data.character_id + " we found item: " + data.item_id)
                      itemFound = true;
                       break;
                    }
                }

                if (!itemFound) {
                    return res.status(404).json({ message: "The character does not own the item with item_id: " + data.item_id + " cannot sell item with item_id: " + data.item_id });
                }
            
                next();
                
                }

        }

    }
    model.checkIfCharacterOwnItem(data, callback)
}

module.exports.getCharacterItemInfoToPost = (req, res, next) => {

   
    
    const data = {
        item_id: req.body.item_id,
        character_id: req.params.character_id
     }

     const callback = (error, results, fields) => {

        if (error) {
            console.error("Error checkIfCharacterOwnItem: ", error);
            res.status(500).json(error);
        }
        else {
            // subtract and add the item to characters WEAPONS -> all in the model so we dont need do anyt here jus check if it actually did so
            if (results.length == 0) {
                // if here means the character id dont own the item id
                res.status(404).json({message:"Your character does not own item_id: " + data.item_id + " sale of item failed." })
            }
            //if here means it did subtract and update
            else {
                    res.locals.item_name = results[0].item_name
                    res.locals.item_description = results[0].item_description
                    res.locals.item_cost = results[0].item_cost
                    res.locals.item_damage = results[0].item_damage
                    res.locals.item_type = results[0].item_type
                    res.locals.item_rarity = results[0].item_rarity
                    console.log('hello')
                    next();
            
                }

        }

    }
    model.getCharacterItemInfoToPost(data, callback)

}



module.exports.postCharacterItemToShopToSell = (req, res, next) => {

    const data = {
        item_id: req.body.item_id,
        character_id: req.params.character_id,
        item_name:  res.locals.item_name,
        item_description: res.locals.item_description, 
        item_cost:  res.locals.item_cost,
        item_damage: res.locals.item_damage,
        item_type: res.locals.item_type, 
        item_rarity: res.locals.item_rarity 
     }

     const callback = (error, results, fields) => {

        if (error) {
            console.error("Error checkIfCharacterOwnItem: ", error);
            res.status(500).json(error);
        }
        else {
            // subtract and add the item to characters WEAPONS -> all in the model so we dont need do anyt here jus check if it actually did so
            if (results.affectedRows == 0) {
                // if here means the character id dont own the item id
                res.status(400).json({message:"Selling of your item failed. Please try again" })
            }
            //if here means it did subtract and update
            else {
                // go to next fxn to see newly sold item by character
                   next();
                
                }

        }

    }
    model.postCharacterItemToShopToSell(data, callback)

}

module.exports.removeCharacterItemFromInventory = (req, res, next) => {
    const data = {
        item_id: req.body.item_id,
        character_id: req.params.character_id,
        item_name:  res.locals.item_name,
        item_description: res.locals.item_description, 
        item_cost:  res.locals.item_cost,
        item_damage: res.locals.item_damage,
        item_type: res.locals.item_type, 
        item_rarity: res.locals.item_rarity 
     }
     const callback = (error, results, fields) => {

        if (error) {
            console.error("Error checkIfCharacterOwnItem: ", error);
            res.status(500).json(error);
        }
        else {
            // subtract and add the item to characters WEAPONS -> all in the model so we dont need do anyt here jus check if it actually did so
            if (results.affectedRows == 0) {
                // if here means the character id dont own the item id
                res.status(400).json({message:"Removing of your item in inventory failed. Please try again" })
            }
            //if here means it did subtract and update
            else {
                // go to next fxn to see newly sold item by character
                   next();
                
                }

        }

    }

    model.removeCharacterItemFromInventory(data, callback)
}

module.exports.getCharacterNewlySellItem= (req, res, next) => {


    const data = {
        item_id: req.body.item_id,
        character_id: req.params.character_id,
        item_name:  res.locals.item_name,
        item_description: res.locals.item_description, 
        item_cost:  res.locals.item_cost,
        item_damage: res.locals.item_damage,
        item_type: res.locals.item_type, 
        item_rarity: res.locals.item_rarity 
     }

     const callback = (error, results, fields) => {

        if (error) {
            console.error("Error getCharacterNewlySellItem: ", error);
            res.status(500).json(error);
        }
        else {
            // subtract and add the item to characters WEAPONS -> all in the model so we dont need do anyt here jus check if it actually did so
            if (results.length == 0) {
                // if here means the character id dont own the item id
                res.status(404).json({message:"Getting the item you sold has failed. Please try again" })
            }
            //if here means it did subtract and update
            else {
                                                                                                                                                                                                            
                   res.status(200).json({message:"Congrats you have listed your " + data.item_name + " on the market! You'll get gold if someone buys your item! You can list more items and it will appear here!", items_sold:results}) // we use results not results[0] so they can see all the items they listed
                
                }

        }

    }
    model.getCharacterNewlySellItem(data, callback)


}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







// Advanced Feature: Lucky Spin
// Endpoint B22

module.exports.getSpinCostForShopInterface = (req, res, next) => {

    const callback = (error, results, fields) => {
       
        if (error) {
            console.error("Error getSpinCostForShopInterface: ", error);
            res.status(500).json(error);
        }
        else {
            if (results.length == 0) {
                res.status(400).json({message:"An error ocurred while trying to get the spin_cost"})
            }
            else {
                // store spin_cost to use for next function
                res.locals.spin_cost = results[0].spin_cost
                next();
            }
        }

    }
    model.getSpinCostForShopInterface(callback)
}

// displays spin interface. Spin interface consits of all items in shop interface but with different messages
module.exports.getSpinForCharacter = (req, res, next) => {

    
    // store character_id and access the res.locals we declare in previous controlller to get character_name and character_gold for shop interface
    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        character_gold: res.locals.character_gold,
        spin_cost: res.locals.spin_cost
    }
   
    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error getSpinForCharacter", error)
            res.status(500).json(error);
        }
        else {
            // just display the shop for the character
            // edit the line below to make the shop interface cooler like a cool popular game shop interface the language and the positioning etc yk 
            // Can show character name and gold in respond to make it a more personalised and interactive shop++ lets add chareacter name and gold first then later we do more
            // we will need another controller

            // declare a message here with the /n breaklines cuz in the actual json({}) cannot
            // let message = "Greetings " + data.character_name + "." + "  Welcome to the Tavern-Shop!" + "\n" + "You have 50 gold"
            // let linebreak = "\n"
            // console.log(message)
            // An interactive and personalized shop showing unique character name and gold
            res.status(200).json({message:"Welcome to the Lucky Spin " + data.character_name + "! Try your luck and win amazing items of varying rarity! Spin the wheel and see what treasure awaits you today!" , gold: "You have " + data.character_gold +" gold!" , spinGuide: data.spin_cost + " gold per spin! Submit an empty PUT Request to spin!", spin_items: results})
        }


    }

    model.getSpinForCharacter(data, callback)
}

// Endpoint B23 Spinning The Wheel - PUT

module.exports.checkAndSubtractCharacterGoldForSpin = (req, res, next) => {


      // ad the item_id that the user send to check the item price and compare if character enough gold
      const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        character_gold: res.locals.character_gold,
    }
    console.log(data.character_gold);



    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error checkAndSubtractCharacterGoldForSpin: ", error);
            res.status(500).json(error);
        }
   
        else {
            // here is the actual calculation once we get the item_cost
            if (data.character_gold < results[0].spin_cost) {
                // add item name to response so nicer
                let gold_lacking = results[0].spin_cost - data.character_gold
                // 403 forbidden
                res.status(403).json({message:"You do not have enough gold to spin for a item"})
            }

            else {
            // if they have enoguh gold
            if (data.character_gold >= results[0].spin_cost) {
            // go to next controller to subtract gold from character and add the stuff into inventory/weapons yk
            // store the item_name, item_cost, item_damage, item_descriptionin res.locals to use for next controller
            res.locals.spin_cost = results[0].spin_cost
            next();
            }
        }

        }


    }

    // check if enough gold

    model.checkAndSubtractCharacterGoldForSpin(data, callback)


}

module.exports.subtractGoldForSpin = (req, res, next) => {
    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        character_gold: res.locals.character_gold,
        spin_cost: res.locals.spin_cost
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error subtractGoldForSpin: ", error);
            res.status(500).json(error);
        }
        else {
            if (results.affectedRows == 0) {
                res.status(400).json({message:"No gold subtracted and spin failed. Error"})
            }
            else {
                next();
            }

        }
    }

    model.subtractGoldForSpin(data, callback)

}

module.exports.getRandomRarityFromSpin= (req, res, next) => {

    //
    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        character_gold: res.locals.character_gold
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error subtractGoldForSpin: ", error);
            res.status(500).json(error);
        }
        else {
            // results.length represents how many rarity there are e.g common, unccomon, rare etc
            // decalre probability = 0 then slowly incremetn to see which matches
            let randomNumber = Math.floor(Math.random() * 100) + 1; // get a random no. from 1- 100 then see which probability it matches to
           console.log("randomNumber:" + randomNumber)
           
            let probability = 0;
            for (i = 0; i < results.length; i++) {
                probability += results[i].rarity_chance // increment the probability to see which match
                if (randomNumber < probability) {
                console.log("Rarity chance:" + results[i].rarity_chance)
                console.log("Probability:" + probability)
                res.locals.random_rarity = results[i].rarity
                next(); // next fxn will pick a rand item using results[i].rarity
                break; // break out of for loop once the rarity and randomnum match and rarity has been found, without it still work but add for easy to understand 
                } 


            }

        }
          
    }

    model.getRandomItemFromSpin(data, callback)
}


module.exports.getRandomItemWIdithRarityFromShop = (req, res, next) => {


    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        character_gold: res.locals.character_gold,
        spin_cost: res.locals.spin_cost,
        rarity: res.locals.random_rarity,
    }
    // console.log("hi")
    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error subtractGoldForSpin: ", error);
            res.status(500).json(error);
        }
        else {
        // the model gets a random item in the shop with the rarity we got from previous fxn so we need display that here
        if (results.length == 0) {
            res.status(400).json({message:"Error getRandomItemWIdithRarityFromSpin Failed to complete spin."})
        }
        else {
            // res.status(200).json({message:"Woohoo you have received " + results[0].item_name + ". rarity: " + data.rarity})
            // we need teh below 3 to add to the inventory table or weapon table
            res.locals.random_spin_item_id = results[0].item_id
            res.locals.random_spin_item = results[0].item_name
            res.locals.random_spin_type= results[0].item_type
            // res.locals.random_spin_description = results[0].item_description
            // res.locals.random_spin_damage = results[0].item_damage
            next(); // next fxn will display the message
        }
        
        }


}
    model.getRandomItemWIdithRarityFromShop(data, callback)
}

module.exports.addSpinItemToCharInventoryAndDisplayMessage = (req, res, next) => {

    
    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        rarity: res.locals.random_rarity,
        random_spin_name:  res.locals.random_spin_item,
        random_spin_type:  res.locals.random_spin_type,
        random_spin_item_id: res.locals.random_spin_item_id
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error subtractGoldForSpin: ", error);
            res.status(500).json(error);
        }
        else {
        // the model gets a random item in the shop with the rarity we got from previous fxn so we need display that here
        if (results.affectedRows == 0) {
            res.status(400).json({message:"Error addSpinItemToCharAndDisplayMessage Failed to add spin item to inventory."})
        }
        else {
        
         
                // the item has been added to "inventory table"
                  return res.status(200).json({message:"Woohoo you have received " + data.random_spin_name + ". item_type: " + data.random_spin_type, rarity:  data.rarity})
            
        }
        
        }


}
    model.addSpinItemToCharInventoryAndDisplayMessage(data, callback)

}






/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////<End OF ChARACTER-SHOP INTERACTIVITY -> BUY, SELL, LUCKY SPIN>









































//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B29 (User-Chracter Interactivity) Section

module.exports.checkIfCharacterExist = (req, res, next ) => {

    // no data we jus want check IF player table is empty or not


    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error checkIfCharacterExist:", error);
            res.status(500).json(error);

        }
        else {
            // means that the player table empty
            if (results.length == 0) {
                res.status(404).json({message:"There are no Characters in Character table. Thus, there are no users associated to characters and characterserrel table is empty."})
            }
            else {
                next();
            }
        }



    }
    model.checkIfCharacterExist(callback);
}



module.exports.checkIfCharacterUserRelEmpty = (req, res, next) => {

    // same as prev fxn but with PlayerUserRel
    
    
    // no data we jus want check IF PlayerUserRel table is empty or not
    
    
        const callback = (error, results, fields) => {
    
            if (error) {
                console.error("Error checkIfCharacterUserRelEmpty:", error);
                res.status(500).json(error);
    
            }
            else {
            
                if (results.length == 0) {
                    res.status(404).json({message:"There are no Characters in CharacterUserRel table"})
                }
                else {
                    next();
                }
            }
    
    
        }
        model.checkIfCharacterUserRelEmpty(callback);
    }
    
module.exports.getCharactersInfoUsingCharacterUserRel = (req, res, next) => {

     // no data jus get everything character and user info using characteruserrel


     const callback = (error, results, fields) => {
        if (error) {
            console.error("Error: getCharactersInfoUsingCharacterUserRel", error);
            res.status(404).json(error);
        }
        else {
           // we want display 200 status with results array of all characters associated with users , as long as characters in characteruserrel, we want to display them
            res.status(200).json(results)
        }


    }

    model.getCharactersInfoUsingCharacterUserRel(callback);

}







//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Character-Inventory Interactivity - intended to allow characters to check their inventory, delete items, quick sell items? , filter by item_type?, count? , highest rated -> PLEASE USE ADVANCED SQL QUERIES HERE

// Endpoint B30 Getting a character's inventory , prob need inner join or something

module.exports.getCharacterInfoForInventory = (req, res, next) => {

    const data = {
        character_id: req.params.character_id
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error getCharacterInfoForInventory")
            res.status(500).json({message:"Internal server error."})
        }
        else {

            if (results.length == 0) {
                // 404 resource not found
                res.status(404).json({message: "This character cannot be found!"})
            }

            else {
                res.locals.character_name = results[0].character_name
                next();
            }
        }


    }
    model.getCharacterInfoForInventory(data, callback)
}

module.exports.getCharacterInventory = (req, res, next) => {

    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name
    }


    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getCharacterInventory")
            res.status(500).json({message:"Internal server error."})
        }
        else {
            if (results.length == 0) {
                res.status(404).json({message:"This character's inventory is empty"})
            }
            else {
                res.status(200).json({message:"Hello " + data.character_name + "! This is your inventory. Feel free to check, delete, and filter your items!" , sort_rules:"Sort options: You can sort your items based on ascending/descending rarity or damage!" , filter_rules:"Filter options: rarity, type. You can filter your items by specific rarity or type." , delete_items:"You can delete or sell your items as you wish!" , inventory:results});
            }
        }
    }

    model.getCharacterInventory(data, callback)

}


// Endpoint B31 Delete item from inventory

module.exports.deleteItemFromCharacterInventory = (req, res, next) => {

    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        item_id: req.body.item_id
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error deleteItemFromCharacterInventory")
            res.status(500).json({message:"Internal Server Error"})
        }
        else {

            if (results.affectedRows == 0) {
                res.status(400).json({message:"Nothing was deleted. This could be because the item_id you provided is not an item you own"})
            }
            else {
                // 204 - no content usually to show item has been deleted
                res.status(204).send()
            }


        }
    }
    model.deleteItemFromCharacterInventory(data, callback);

}

// Endpoint B32 Sort items by rarity in ascending order
module.exports.ascendingOrderForInventoryRarity = (req, res, next) => {


    // validate req.body pleaseee

    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        item_id: req.body.item_id
    }
 
    const callback = (error, results, fields) => {
        console.log(results)
        if (error) {
            console.error("Error ascendingOrderForInventoryRarity")
            res.status(500).json({message:"Internal Server Error"})
        }
        else {
            // console.log(results)
            if (results.length == 0) {
                res.status(400).json({message:"Inventory Rarity ascension failed!"})
            }
            else {
                // 204 - no content usually to show item has been deleted
                res.status(200).json({message:"Hi " + data.character_name + "! Your Inventory has been sorted to ascending rarity (top: Least rare, bottom: Most rare). Ascends as you go down" , sort_rules:"Sort options: You can sort your items based on ascending/descending rarity or damage!", filter_rules:"Filter options: rarity, type. You can filter your items by specific rarity or type.",  delete_items:"You can delete or sell your items as you wish!", inventory: results});
            }


        }
    }
    model.ascendingOrderForInventoryRarity(data, callback);
}


// Endpoint B33 Sort Inventory rarity in descending rarity

module.exports.descendingOrderForInventoryRarity = (req, res, next) => {

    // validate req.body pleaseee

    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        item_id: req.body.item_id
    }
 
    const callback = (error, results, fields) => {
        console.log(results)
        if (error) {
            console.error("Error descendingOrderForInventoryRarity")
            res.status(500).json({message:"Internal Server Error"})
        }
        else {
            // console.log(results)
            if (results.length == 0) {
                res.status(400).json({message:"Inventory Rarity descension failed!"})
            }
            else {
                // 204 - no content usually to show item has been deleted
                res.status(200).json({message:"Hi " + data.character_name + "! Your Inventory has been sorted to descending rarity (top: Most rare, bottom: Least rare)" ,  sort_rules:"Sort options: You can sort your items based on ascending/descending rarity or damage!", filter_rules:"Filter options: rarity, type. You can filter your items by specific rarity or type.",  delete_items:"You can delete or sell your items as you wish!!", inventory: results});
            }


        }
    }
    model.descendingOrderForInventoryRarity(data, callback);

}


// Endpoint B34 Sort Inventory damage in ascending order
module.exports.ascendingOrderForInventoryDamage = (req, res, next) => {


     // validate req.body pleaseee

     const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        item_id: req.body.item_id
    }
 

    const callback = (error, results, fields) => {
        console.log(results)
        if (error) {
            console.error("Error ascendingOrderForInventoryDamage")
            res.status(500).json({message:"Internal Server Error"})
        }
        else {
            // console.log(results)
            if (results.length == 0) {
                res.status(400).json({message:"Inventory Damage Ascension failed!"})
            }
            else {
                // 204 - no content usually to show item has been deleted
                res.status(200).json({message:"Hi " + data.character_name + "! Your Inventory has been sorted to ascending damage (top: Least damage, bottom: Most damage)" ,  sort_rules:"Sort options: You can sort your items based on ascending/descending rarity or damage!", filter_rules:"Filter options: rarity, type. You can filter your items by specific rarity or type.",  delete_items:"You can delete or sell your items as you wish!!", inventory: results});
            }


        }
    }
    model.ascendingOrderForInventoryDamage(data, callback);

}


// Endpoint B35 Descending order for Inventory damage

module.exports.descendingOrderForInventoryDamage = (req, res, next) => {


    // validate req.body pleaseee

    const data = {
       character_id: req.params.character_id,
       character_name: res.locals.character_name,
       item_id: req.body.item_id
   }


   const callback = (error, results, fields) => {
       console.log(results)
       if (error) {
           console.error("Error ascendingOrderForInventoryDamage")
           res.status(500).json({message:"Internal Server Error"})
       }
       else {
           // console.log(results)
           if (results.length == 0) {
               res.status(400).json({message:"Inventory Damage Ascension failed!"})
           }
           else {
               // 204 - no content usually to show item has been deleted
               res.status(200).json({message:"Hi " + data.character_name + "! Your Inventory has been sorted to ascending damage (top: Least damage, bottom: Most damage)" ,  sort_rules:"Sort options: You can sort your items based on ascending/descending rarity or damage!", filter_rules:"Filter options: rarity, type. You can filter your items by specific rarity or type.",  delete_items:"You can delete or sell your items as you wish!!", inventory: results});
           }


       }
   }
   model.descendingOrderForInventoryDamage(data, callback);

}


// Filter rarity (Endpint B36 & 37)

//Endpoing B36
module.exports.filterRarityForInventoryRarity = (req, res, next) => {

    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        rarity_grade: req.params.rarity_grade
    }
    // console.log(data)

    const callback = (error, results, fields) => {
        console.log(results)
        if (error) {
            console.error("Error filterRarityForInventoryRarity")
            res.status(500).json({message:"Internal Server Error"})
        }
        else {
            // console.log(results)
            // means dont have the rarity the character looking for
            if (results.length == 0) {
                res.status(404).json({message:"Sorry. You do not own any items with " + data.rarity_grade + " rarity!"})
            }
            else {
               
                res.status(200).json({message:"Hi " + data.character_name + "! Your Inventory has been filtered by " + data.rarity_grade + " rarity" ,  sort_rules:"Sort options: You can sort your items based on ascending/descending rarity or damage!", filter_rules:"Filter options: rarity, type. You can filter your items by specific rarity or type.",  delete_items:"You can delete or sell your items as you wish!!", inventory: results});
            }
 
 
        }
    }
    model.filterRarityForInventoryRarity(data, callback)

}

// Filter item type -> /weapons /all that
// Endpoint B37
module.exports.filterItemTypeForInventoryItemType = (req, res, next) => {

    const data = {
        character_id: req.params.character_id,
        character_name: res.locals.character_name,
        item_type: req.params.item_type
    }

    console.log(data)
    
    const callback = (error, results, fields) => {
        console.log(results)
        if (error) {
            console.error("Error filterItemTypeForInventoryItemType")
            res.status(500).json({message:"Internal Server Error"})
        }
        else {
            // console.log(results)
            // means dont have the rarity the character looking for
            if (results.length == 0) {
                res.status(404).json({message:"Sorry. You do not own any items with " + data.item_type + " type!"})
            }
            else {
               
                res.status(200).json({message:"Hi " + data.character_name + "! Your Inventory has been filtered by "  + "item_type: " + data.item_type  ,  sort_rules:"Sort options: You can sort your items based on ascending/descending rarity or damage!", filter_rules:"Filter options: rarity, type. You can filter your items by specific rarity or type.",  delete_items:"You can delete or sell your items as you wish!!",  inventory: results});
            }
 
 
        }
    }
    model.filterItemTypeForInventoryItemType(data, callback)


}

















// Endpoint B39
// GET /characters/character_id/leaderboard
module.exports.getCharacterLeaderboard = (req, res, next) => {

    

 
    const callback = (error, results, fields) => {

        if (error) {
            console.error("getCharacterLeaderboard", error);
            // typical error 500
            res.status(500).json(error) 
        }
        else {

            if (results.length == 0) {
                res.status(404).json({message:"The leaderboard for ranking character level in section B is unavailable"})
            }
            else {
                res.status(200).json({message:"This is the Character Leaderboard ranked by level, continue battling and see where you land!", results});
            }

        }

    }
    model.getCharacterLeaderboard(callback);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END OF CA1 , BELOW IS FOR CA2 ALRDY
////////////////////////////////////////////////////////////////////////////////////////////////////////////






















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// For user creating character 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lab 6 Advanced Exercise

// Task 1
module.exports.createNewPlayerForAuthUser = (req, res, next) => {

    if (req.body.name == "" || req.body.name == undefined || req.body.name == null || isNaN(req.body.level) || req.body.level == "" || req.body.level == null || req.body.level == undefined) {
        return res.status(400).json({message:"Name or level not provided"})
    }

    const data = {
        name: req.body.name, // player name
        level: req.body.level // the init_tables show that level NOT NULL so must add
        // I dont think need store JWT token prob got a existing fxn that extracts the JWT token authorization header
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error createNewPlayerForAuthUser: ", error)
            res.status(500).json({message:"Internal Server Error"})
        }

        else {

            if (results.affectedRows == 0) {
                res.status(404).json({message:"Player was not created for authorized user"})
            }

            else {
                // if here means created new player for auth user
                // store player Id for next fxn
                res.locals.player_id = results.insertId
                console.log(results.insertId)
                next();
            }


        }

    }

    model.createNewPlayerForAuthUser(data, callback);
}




module.exports.insertNewPlayerForPlayerUserRel = (req, res, next) => {

    const data = {
        player_id: res.locals.player_id,
        userId: res.locals.userId 
    }

    const callback = (error, results, fields) => {


        if (error) {
            console.error("Error insertNewPlayerForPlayerUserRel: ", error)
            res.status(500).json({message:"Internal server error"})
        }
        else {
            if (results.affectedRows == 0 ) {
                res.status(404).json({message:"Failed to add userId and playerId into playerUserRel"})
            }
            else {
                next()
            }
        }


    }
    model.insertNewPlayerForPlayerUserRel(data, callback)

}

module.exports.showNewPlayerForAuthUser = (req, res, next) => {

    const data = {
        player_id: res.locals.player_id
    }

    const callback = (error, results, fields) => {

        if (error) {
            console.error("Error showNewPlayerForAuthUser", error)
            res.status(500).json({message:"Internal Server Error"})
        }

        else {
            // show new player created for auth user data
            res.status(201).json({results})
        }


    }

    model.showNewPlayerForAuthUser(data, callback)

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// New CA2 Route for healing monster when character leave page
module.exports.healMonsterToFullHp = (req, res, next) => {

const data = {
    character_battle_id: res.locals.character_battle_id,
    character_id: req.params.character_id

}

const callback = (error, results, fields) => {
    if (error) {
        console.error("Error showNewPlayerForAuthUser", error)
        res.status(500).json({message:"Internal Server Error"})
    }

    else {
      
        // successfully update monster hp
        res.status(204).json()
    }
}

    model.healMonsterToFullHp(data, callback)
}
