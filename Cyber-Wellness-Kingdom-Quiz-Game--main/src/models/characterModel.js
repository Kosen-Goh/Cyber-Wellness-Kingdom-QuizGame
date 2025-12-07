const pool = require('../services/db');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B6 getCharacters
module.exports.getAllCharacters = (callback) => {

    // We want an SQLSTATEMENT that retrieves all Characters
    const SQLSTATEMENT = `
    SELECT * FROM Characters
    `;
    pool.query(SQLSTATEMENT, callback);
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B7 get Character By Char Id
// check if char exists by char id
module.exports.checkCharacterExistByCharId = (data, callback) => {

    // we want an SQLSTATEMENT that selects a character by character by Id
    const SQLSTATEMENT = `
    SELECT * FROM 
    Characters
    WHERE character_id = ?
    `
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback);

}


module.exports.getCharacterByCharId = (data, callback) => {

    // we want an SQLSTATEMENT that selects a character by character Id 
    const SQLSTATEMENT = `
    SELECT * FROM
    Characters
    WHERE character_id = ?
    `
    VALUES = [data.character_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B8 Delete Character

module.exports.deleteCharacter = (data, callback) => {

    // we want an SQLSTATEMENT that deletes a character where character_id = ?
    const SQLSTATEMENT = `
    DELETE FROM Characters
    WHERE character_id = ?
    `
    VALUES = [data.character_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B9 get available battles for characters

module.exports.getCharacterInfoForBattleInterface = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM Characters 
    WHERE character_id = ?
    `
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}

module.exports.getAllBattlesForCharacter = (callback) => {

     // We want an SQLSTATEMENT That selects battles by battle_id
     const SQLSTATEMENT = `
     SELECT battle_id, battle_name, battle_cost AS silver_needed , battle_reward AS gold_reward, battle_xp, battle_body, battle_monster_hp, battle_steps FROM 
     Battles
     `
     /*
      "battle_id": 5,
            "battle_name": "The Bloodthirsty Vampire",
            "battle_cost": 30,
            "battle_reward": 70,
            "battle_xp": 200,
            "battle_body": "A Bloodthirsty Vampire emerges from the shadows, its fangs dripping with fresh blood.",
            "battle_monster_hp": 100,
            "battle_monster_default_hp": 900,
            "battle_steps": "Check your weapons by going adding /inventory to the route."
     */
    pool.query(SQLSTATEMENT, callback)
}
///////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
// Endppint B10 Accept battle_id for character

module.exports.getCharacterSilver = (data, callback) => {

    // we want An SQLSTATEMENT that selects character_silver from characters table
    const SQLSTATEMENT =  `
    SELECT * FROM Characters 
    WHERE character_id = ?
    `
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback )
}

module.exports.getCostOfBattle = (data, callback) => {
    // we want an SQLSTATEMENT that selects battle_cost from the battle table to be deducted in next fxn
    const SQLSTATEMENT = `
    SELECT * FROM Battles
    WHERE battle_id = ?;

    `
    VALUES = [data.character_battle_id];
    pool.query(SQLSTATEMENT, VALUES, callback)

}

// Better to split in to 2
module.exports.updateBattleIdAndDeductSilverForCharacter = (data, callback) => {

    // we want an SQLSTATEMENT that updates character_battle_id for a character 
    // since each battle will have a cost, that is silver. We need to subtract from the Character
    const SQLSTATEMENT = `
    UPDATE Characters SET character_battle_id = ?, character_silver = character_silver - ?
    WHERE character_id = ?;
    `
    // need to subtract the battle_cost from character_silver after he accepts the battle
    // second sql statement is to get silver_left to display for the user character
    VALUES = [data.character_battle_id, data.battle_cost, data.character_id, data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}

// Endpoint B11 - B15 in shopRoutes

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Higher Game Interactivity Section
// Endpoint B16- Part 1 -> GET BattleInstance

module.exports.selectCharacterBattleId = (data, callback) => {

    // we want an SQLSTATEMENT that selects the character_battle_id from the specific character
    const SQLSTATEMENT = `
    SELECT character_battle_id FROM Characters
    WHERE character_id = ?
    `
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}



module.exports.getBattleInstanceByBattleId = (data, callback) => {
    
    // we want an SQLSTATEMENT that selects everything of battle instance of a certain battle_id (chracter attached battle)
    const SQLSTATEMENT = `
    SELECT battle_name, battle_body, battle_monster_hp, battle_steps FROM Battles
    WHERE battle_id = ?;
    `
    VALUES = [data.character_battle_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}



// Endpoint B17
// Part 2 - Display weapons character owns 

module.exports.getWeaponsOwnedByCharacter = (data, callback) => {


    // we want an SQLSTATEMENT That select all weapon by charID
    const SQLSTATEMENT = `
    SELECT Shop.item_id AS weapon_id, Shop.item_name, Shop.item_description, Shop.item_damage, Shop.item_type, Shop.item_rarity FROM Shop
    INNER JOIN Inventory ON Shop.item_id = Inventory.item_id
    WHERE Inventory.owner_id = ? And Shop.item_type = 'weapon';

    `
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

    /*
     "item_id": 3,
            "item_owner_id": null,
            "item_name": "Emerald Blade",
            "item_description": "Harness the verdant essence of nature with the Emerald Blade",
            "item_cost": 200,
            "item_damage": 150,
            "item_type": "weapon",
            "item_rarity": "Rare",
            "spin_cost": 50,
            "id": 1,
            "owner_id": 4

       SELECT CharacterUserRel.user_id, CharacterUserRel.character_id, User.username, Characters.character_name, Characters.character_level, Characters.character_silver, Characters.character_gold
    FROM CharacterUserRel
    INNER JOIN Characters ON CharacterUserRel.character_id = Characters.character_id
    INNER JOIN User ON CharacterUserRel.user_id = User.user_id
    */

}

//


// Endpoint B18
// Part 3 - Get WeaponDamage to deal damage to boss. Once boss defeated give gold to character. Set character_battle_id to null so character cant abuse the gold.
module.exports.getWeaponDamage = (data, callback) => {


    // we want an SQLSTATMENT That selects the "damage" attribute of a particular weapon so we cna minus this from the boss
    const SQLSTATEMENT = `

     SELECT Shop.item_damage FROM Shop
    INNER JOIN Inventory ON Shop.item_id = Inventory.item_id
    WHERE Inventory.owner_id = ? And Shop.item_id = ?;
    `
    VALUES = [data.character_id, data.weapon_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}


module.exports.insertWeaponDamageToMonster = (data, callback) => {

    // we want an SQLSTATEMENT that subtracts monster health by weapon damage
    const SQLSTATEMENT = `
    UPDATE Battles
    SET battle_monster_hp = battle_monster_hp - (?)
    WHERE battle_id = ?
    `
    VALUES = [data.inflicted_damage , data.character_battle_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}

// so we insert damage in previous fxn now we check affectedBattleInstance to see how many hp boss is left and see if character beat the monster
module.exports.getAffectedBattleInstance = (data, callback) => {

    // we want an SQLSTATEMENT that selects relevant info for user to see hp and see if they beat the boss, we dont need battle_steps if we alrdy gave it to them the first step
    const SQLSTATEMENT = `
    SELECT battle_name, battle_body, battle_monster_hp FROM Battles
    WHERE battle_id = ?
    `
    VALUES = [data.character_battle_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}


// we want to get the battle reward before giving it ykwim if not we dont know how many gold to give character
module.exports.getCompletedBattleRewards = (data, callback) => {
    //we want an SQLSTATEMENT SELECT Everyt from battle then our controller select what we need
    const SQLSTATEMENT = `
    SELECT * FROM Battles
    WHERE battle_id = ?;
    
    `
    VALUES = [data.battle_id, data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}




// so this is for display congrats message and adding gold to the character

module.exports.giveRewardsAndNullCharBattleId = (data, callback) => {

    // we want an SQLSTATEMNT To add gold to the character , the gold we got from previous fxn btw
    const SQLSTATEMENT = `
    UPDATE Characters
    SET character_gold = character_gold + ?, character_xp = character_xp + ?
    WHERE character_id = ?;

    UPDATE Characters 
    SET character_battle_id = null
    WHERE character_id = ?;
    

    `
   
    // Fuyooh , first time using 2 SQLSTATEMENTS In 1 , First is to give gold to character , Second is to delete the character_battle_id so this character cannot do this quest again.
    VALUES = [data.gold_earned, data.xp_earned, data.character_id, data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}

// to get character_xp so the controller can calculate the level
module.exports.checkLevelForCharacter = (data, callback) => {

    // we want an SQLSTATEMENT that selects the character_xp of character which is the new character_xp as the previous model added xp to it
    // But we do * ALL so we can get character_name and other stuff we may want to display in our
    const SQLSTATEMENT = `
    SELECT * FROM Characters
    WHERE character_id = ?
    `
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}




// to update the character level if necessary
module.exports.updateLevelRegenMonsterAndDisplayCongratsMessage = (data, callback) => {

    // we want an SQLSTATEMENT that updates the specific character level with the new level we calculated 
    const SQLSTATEMENT = `
    UPDATE Characters SET character_level = ?, character_battles_won = character_battles_won + 1
    WHERE character_id = ?;


    UPDATE Battles SET
    battle_monster_hp = battle_monster_default_hp;

    UPDATE Characters
    SET character_name = CONCAT(character_name, ' {master}')
    WHERE character_id = ?
    AND character_level >= 10
    AND character_name NOT LIKE '%{master}';
    `
    // The second if statement regens monster to original value so that other players can play
    VALUES = [data.character_new_level, data.character_id, data.character_id, data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}

/*
AND character_name NOT LIKE '%{master}': This ensures that the update only applies to characters whose name does not already end with {master}. 
The % is a wildcard character that matches any sequence of characters, so '%{master}' means any name that ends with {master}.
*/
// ned explain % all that
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








// SHOPPPPPPPPPPPPPPPPPPPPPP





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Character-Shop Interactivity -> for characters to buy items
// Endpoint B19

// Get CharacterInfo For Shop Interface to be more personalised and interactive!
module.exports.getCharacterInfoForShopInterface = (data, callback) => {
    
    // we want an SQLSTATEMENT that selects character_name and gold!
    const SQLSTATEMENT = `
    SELECT character_name, character_gold 
    FROM Characters
    WHERE character_id = ?
    `
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}

module.exports.getShopForCharacter = (data, callback) => {

        // We want an SQLSTATEMENT to retrieve all items from the Shop Table

        const SQLSTATEMENT = `
        SELECT item_id, item_owner_id, item_name, item_description, item_cost, item_damage, item_type, item_rarity FROM 
        Shop
        `
        // we want every column except but the spin_cost
        pool.query(SQLSTATEMENT, callback);

}

//

// Endpoint B20 (Character-Shop Interactivty) 
// check item_cost to see if the character have enough to buy the item

module.exports.checkIfItemExists = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM Shop
    WHERE item_id = ?
    `
    VALUES = [data.item_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}


module.exports.checkIfCharacterOwnsItemAlready = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT item_id FROM Inventory
    WHERE owner_id = ?
    `
    // the item_id in shop is equal to the item_id in the Inventory 

    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}


module.exports.checkCharacterGoldEnough = (data, callback) => {

    // we want an SQLSTATEMENT That fetch the item_cost of the specific item
    const SQLSTATEMENT = `
    SELECT item_cost, item_name, item_damage, item_description, item_type, item_rarity, item_owner_id FROM Shop
    WHERE item_id = ?
    `

    VALUES = [data.item_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
    
}


module.exports.subtractGoldAndAddItemForCharacterInventory = (data, callback) => {

    // we want an SQLSTATEMENT that subtracts gold from character and adds the purchased item in weapons and inventory

    const SQLSTATEMENT = `
    UPDATE Characters SET
    character_gold = character_gold - ?
    WHERE character_id = ?
    ;

    INSERT INTO Inventory (owner_id, item_id) 
    VALUES (?, ?);
    `
    VALUES = [data.item_cost, data.character_id, data.character_id, data.item_id]
    pool.query(SQLSTATEMENT, VALUES, callback)



}

module.exports.giveGoldtoSellerAndRemoveFromShop = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE Characters SET
    character_gold = character_gold + ?
    WHERE character_id = ?;

    DELETE FROM Shop
    WHERE item_id = ?
    `
    VALUES = [data.item_cost, data.item_owner_id, data.item_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}
 
// Endpoint B21 SELL 
module.exports.checkCharacterLevelToSell= (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM Characters
    WHERE character_id = ?;
    `
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}

module.exports.checkIfCharacterOwnItem = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM Inventory 
    WHERE owner_id = ?;
    `
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
} 


module.exports.getCharacterItemInfoToPost= (data, callback) => {

    const SQLSTATEMENT =   `
    SELECT * FROM Shop
    WHERE item_id = ?;
    `
    VALUES = [data.item_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}


module.exports.postCharacterItemToShopToSell = (data, callback) => {
    
    const SQLSTATEMENT = `
    INSERT INTO Shop (item_owner_id, item_name, item_description, item_cost, item_damage, item_type, item_rarity)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `
    VALUES = [data.character_id, data.item_name, data.item_description, data.item_cost, data.item_damage, data.item_type, data.item_rarity]
    pool.query(SQLSTATEMENT, VALUES, callback)
   
}

module.exports.removeCharacterItemFromInventory = (data, callback) => {

    const SQLSTATEMENT = `
    DELETE FROM Inventory
    WHERE owner_id = ? and item_id = ?;
    `
    VALUES = [data.character_id, data.item_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}

module.exports.getCharacterNewlySellItem = (data, callback) => {

    const SQLSTATEMENT =   `
    SELECT * FROM Shop
    WHERE item_owner_id =  ?
    `
    VALUES = [data.character_id, data.item_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Advanced feature: Lucky Spin (Endpoint B22 and B23)

module.exports.getSpinCostForShopInterface = (callback) => {

    const SQLSTATEMENT = `
    SELECT spin_cost FROM Shop
    `
    pool.query(SQLSTATEMENT, callback)

}

module.exports.getSpinForCharacter = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT item_name, item_id, item_description, item_rarity AS rarity FROM Shop
    `
    pool.query(SQLSTATEMENT, callback)

}

module.exports.checkAndSubtractCharacterGoldForSpin = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM Shop
    `

    pool.query(SQLSTATEMENT, callback)

}

module.exports.subtractGoldForSpin = (data, callback) => {

    const SQLSTATEMENT = `
    UPDATE Characters
    SET character_gold = character_gold - ?
    WHERE character_id = ?
    `
    VALUES = [data.spin_cost, data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}


module.exports.getRandomItemFromSpin = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM Rarity
    `
    pool.query(SQLSTATEMENT, callback)
}

module.exports.getRandomItemWIdithRarityFromShop = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT item_id, item_name, item_type, item_description, item_damage FROM Shop
    WHERE item_rarity = ?
    ORDER BY RAND()
    LIMIT 1;
    `
    VALUES = [data.rarity]
    pool.query(SQLSTATEMENT, VALUES, callback)


}

module.exports.addSpinItemToCharInventoryAndDisplayMessage = (data, callback) => {

    // we want an SQLSTATEMENT to insert that newly gotten spin item to character inventroy
    const SQLSTATEMENT = `
    INSERT INTO Inventory (owner_id, item_id)
    VALUES (?, ?)
    `
    VALUES = [data.character_id, data.random_spin_item_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B29 (User-Character Interactivity) Section


module.exports.checkIfCharacterExist = (callback) => {

    // we want an SQLSTATEMENT to select everything from player table to prove that got players
    const SQLSTATEMENT = `
    SELECT * FROM Characters
    `
    pool.query(SQLSTATEMENT, callback)

}

module.exports.checkIfCharacterUserRelEmpty = (callback) => {

    
      // we want an SQLSTATEMENT to select everything from CharacterUserRel table
      const SQLSTATEMENT = `
      SELECT * FROM CharacterUserRel
      `
      pool.query(SQLSTATEMENT, callback)

}


module.exports.getCharactersInfoUsingCharacterUserRel = (callback) => {

    
    // we want an SQLSTATEMNT that selects user info character info from CharacterUserRel Table, User Table , and Character Table
    // need use AS, INNER JOIN, ON
    const SQLSTATEMENT = `
    SELECT CharacterUserRel.user_id, CharacterUserRel.character_id, User.username, Characters.character_name, Characters.character_level, Characters.character_silver, Characters.character_gold
    FROM CharacterUserRel
    INNER JOIN Characters ON CharacterUserRel.character_id = Characters.character_id
    INNER JOIN User ON CharacterUserRel.user_id = User.user_id
    

    `
    pool.query(SQLSTATEMENT, callback)

}










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Character-Inventory Interactivity - intended to allow characters to check their inventory, delete items, quick sell items? , filter by item_type?, count? , highest rated -> PLEASE USE ADVANCED SQL QUERIES HERE

// Endpoint B30 Getting a character's inventory , prob need inner join or something

module.exports.getCharacterInfoForInventory = (data, callback) => {

    // we want an SQLSTATEMENT To get character details for the inventory interface
    const SQLSTATEMENT = `
    SELECT * FROM Characters
    WHERE character_id = ?
    `
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}


module.exports.getCharacterInventory= (data, callback) => {
    // we want an SQLSTATEMENT to get character inventory which needs inner join to shop    

    const SQLSTATEMENT = `
    SELECT Shop.item_id, Shop.item_name, Shop.item_description, Shop.item_damage, Shop.item_type, Shop.item_rarity FROM 
    Shop 
    INNER JOIN Inventory ON Inventory.item_id = Shop.item_id
    WHERE Inventory.owner_id = ?
    `
    
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}

// Endpoint 31 Delete item fro inventory

module.exports.deleteItemFromCharacterInventory = (data, callback) => {

    const SQLSTATEMENT = `
    DELETE FROM Inventory
    WHERE owner_id = ? AND item_id = ?
    `
       
    VALUES = [data.character_id, data.item_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}
///////////////////////////////////////////////////////////////
// SORT
// Endpoint B32 Sort items by rarity in ascending order
module.exports.ascendingOrderForInventoryRarity = (data, callback) => {

    // we want an SQLSTATEMENT to sort items in character inventory in asc rarity
    const SQLSTATEMENT = `  
    SELECT Shop.item_id, Shop.item_name, Shop.item_description, Shop.item_damage, Shop.item_type, Shop.item_rarity FROM 
    Shop 
    INNER JOIN Inventory ON Inventory.item_id = Shop.item_id
    INNER JOIN Rarity ON Shop.item_rarity = Rarity.rarity
    WHERE Inventory.owner_id = ?
    ORDER BY Rarity.rarity_rank ASC;
    `
 // The First INNER JOIN Inventory is to logically join Inventory table but not displayed, its used to get the item_id that can be found in both inventory and shop. Its also used to allow 
 // WHERE Inventory.owner_id =? to work which is used to get item_id beloging to the specific owner. The Second Inner Join is also used to logically join the Rarity table but not displayed, it helps the ORDER BY.. to order by rarity_rank ASC

    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}

// Endpoint B33 Sort Items by rarity in descending order

module.exports.descendingOrderForInventoryRarity = (data, callback) => {

    // we want an SQLSTATEMENT to srot items in character inventory in desc rarity
    const SQLSTATEMENT = `  
    SELECT Shop.item_id, Shop.item_name, Shop.item_description, Shop.item_damage, Shop.item_type, Shop.item_rarity FROM 
    Shop 
    INNER JOIN Inventory ON Inventory.item_id = Shop.item_id
    INNER JOIN Rarity ON Shop.item_rarity = Rarity.rarity
    WHERE Inventory.owner_id = ?
    ORDER BY Rarity.rarity_rank DESC;
    `
 // when order in descending the most bottom in results is highest and the top is lowest , SP IT DESCENDS FROM BOTTOM TO TOP
 // added new column in rarity, rarity_rank, put legendary rank 5 and common 1 so descending would be legendary and downwards, and ascending would be common upwards, which makes sense as use wants to see an ascension or descension as they scroll down
    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)




}


// Endpoint B34 Sort Item damage in ascending order


module.exports.ascendingOrderForInventoryDamage = (data, callback) => {

      // we want an SQLSTATEMENT to srot item damage in character inventory in asc rarity
      const SQLSTATEMENT = `  
      SELECT Shop.item_id, Shop.item_name, Shop.item_description, Shop.item_damage, Shop.item_type, Shop.item_rarity FROM 
      Shop 
      INNER JOIN Inventory ON Inventory.item_id = Shop.item_id
      WHERE Inventory.owner_id = ?
      ORDER BY Shop.item_damage ASC;
      `

      VALUES = [data.character_id]
      pool.query(SQLSTATEMENT, VALUES, callback)
}


// Endpoint B35 Sort Item damage in descending order
module.exports.descendingOrderForInventoryDamage = (data, callback) => {

    // we want an SQLSTATEMENT to srot item damage in character inventory in asc rarity
    const SQLSTATEMENT = `  
    SELECT Shop.item_id, Shop.item_name, Shop.item_description, Shop.item_damage, Shop.item_type, Shop.item_rarity FROM 
    Shop 
    INNER JOIN Inventory ON Inventory.item_id = Shop.item_id
    WHERE Inventory.owner_id = ?
    ORDER BY Shop.item_damage DESC;
    `

    VALUES = [data.character_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}

////////////////////////////////////////////////////////////////////////////////////
// FILTER
// Endpoint B36 Filter Item rarity
module.exports.filterRarityForInventoryRarity = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT Shop.item_id, Shop.item_name, Shop.item_description, Shop.item_damage, Shop.item_type, Shop.item_rarity FROM 
    Shop 
    INNER JOIN Inventory ON Inventory.item_id = Shop.item_id
    WHERE Inventory.owner_id = ? AND Shop.item_rarity = ?
    `
    VALUES = [data.character_id, data.rarity_grade]
    pool.query(SQLSTATEMENT, VALUES, callback)
}


// Endpoint B37 Filter Item type 
module.exports.filterItemTypeForInventoryItemType = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT Shop.item_id, Shop.item_name, Shop.item_description, Shop.item_damage, Shop.item_type, Shop.item_rarity FROM 
    Shop 
    INNER JOIN Inventory ON Inventory.item_id = Shop.item_id
    WHERE Inventory.owner_id = ? AND Shop.item_type = ?
    `
    VALUES = [data.character_id, data.item_type]
    pool.query(SQLSTATEMENT, VALUES, callback)

}



// Endpoint B38 Get Character Leaderboard

module.exports.getCharacterLeaderboard = (callback) => {


    const SQLSTATEMENT = `
    SELECT 
    character_name,
    character_level,
    character_battles_won,
    RANK() OVER (ORDER BY character_level DESC) AS character_rank
    FROM 
    Characters
    ORDER BY 
    character_rank ASC;

    `
    pool.query(SQLSTATEMENT, callback)

}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// For user to create character Lab6


// Task 1
module.exports.createNewPlayerForAuthUser = (data, callback) => {

    // we want an SQLSTATEMENT to insert a new player for an auth user
    const SQLSTATEMENT = `
    INSERT INTO Player (name, level)
    VALUES (?, ?)
    `
    VALUES = [data.name, data.level]
    pool.query(SQLSTATEMENT, VALUES, callback)



}


module.exports.showNewPlayerForAuthUser = (data, callback) => {
    
    // we want an SQLSTATEMENT to get the new player we created for auth user above
    const SQLSTATEMENT = `
    SELECT * FROM Player
    WHERE id = ?
    `
    VALUES = [data.player_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}


module.exports.insertNewPlayerForPlayerUserRel= (data, callback) => {

    const SQLSTATEMENT = `
    INSERT INTO PlayerUserRel (user_id, player_id)
    VALUES (?, ?)
    `
    VALUES = [data.userId, data.player_id]
    pool.query(SQLSTATEMENT, VALUES, callback)


}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// New CA2 Route for healing monster when character leave page
// Endpoint B45
module.exports.healMonsterToFullHp = (data, callback) => {


    // we want an SQLSTATEMENT To Heal the monster back up to full hp so in front end when another character play the monster battle or even same character, it is back up to full health, use battle_monster_default_hp

    const SQLSTATEMENT = `
    UPDATE Battles SET
    battle_monster_hp = battle_monster_default_hp
    WHERE battle_id = ?
    `

    VALUES = [data.character_battle_id]
    pool.query(SQLSTATEMENT, VALUES, callback)



}
//////////////////////////////////////////////////////////////////////////