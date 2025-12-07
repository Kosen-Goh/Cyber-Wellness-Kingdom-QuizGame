const pool = require('../services/db');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B1
module.exports.getAllBattles = (callback) => {

    // We want an SQLSTATEMENT to retrieve all quests from the quests Table

    const SQLSTATEMENT = `
    SELECT * FROM 
    Battles
    `
    pool.query(SQLSTATEMENT, callback);

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B2 get quests by quests_id

module.exports.checkBattleExistsByBattleId = (data, callback) => {

  // We want an SQLSTATEMENT That selects battles by battle_id
    const SQLSTATEMENT = `
    SELECT * FROM 
    Battles
    WHERE battle_id = ?
    `
    // in Battles table its battle_id not battles_id
    VALUES = [data.battle_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}


module.exports.getBattlesByBattleId = (data, callback) => {

    // we want an SQLSTATEMENT that gets a quests by quests_id
    const SQLSTATEMENT = `
    SELECT * FROM  
    Battles
    WHERE battle_id = ?
    `
    VALUES = [data.battle_id];
    pool.query(SQLSTATEMENT, VALUES, callback);


}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B3 (Post new quest if character level 10)

module.exports.checkCharacterLevelForPostBattle = (data, callback) => {

    // we want an SQLSTATEMENT that selects the character level based on character username
    const SQLSTATEMENT = `
    SELECT character_level FROM
    Characters
    WHERE character_id = ?
    `
    VALUES = [data.character_id];
    pool.query(SQLSTATEMENT, VALUES, callback)


}

module.exports.checkIfBattleExistsForPost = (data, callback) => {

    // we want an SQLSTATEMENT To check the 
    const SQLSTATEMENT = `
    SELECT * FROM 
    Battles
    WHERE battle_name = ?
    `

    VALUES = [data.battle_name];
    pool.query(SQLSTATEMENT, VALUES, callback)

}

module.exports.postBattle = (data, callback) => {
    
    
    const SQLSTATEMENT = `
    INSERT INTO Battles (battle_name, battle_cost, battle_reward, battle_xp, battle_body, battle_monster_hp, battle_monster_default_hp, battle_steps)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    VALUES = [data.battle_name, data.battle_cost, data.battle_reward, data.battle_xp, data.battle_body, data.battle_monster_hp, data.battle_monster_hp, data.battle_steps];
    pool.query(SQLSTATEMENT, VALUES, callback);
    // cuz default hp same as hp jus put the data.battle_monster_hp twice here and dont require user to put it in req.body for convenience
}


module.exports.getNewlyPostedBattle = (data, callback) => {

    // we want an SQLSTATEMENET that uses quest_name to get newly posted quest details
    const SQLSTATEMENT = `
    SELECT * FROM 
    Battles
    WHERE battle_name = ?
    `
    VALUES = [data.battle_name];
    pool.query(SQLSTATEMENT, VALUES, callback)

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B4 


module.exports.updateBattle = (data, callback) => {

    // we want an SQLSTATEMENT that updates the quest wuth quest body
    const SQLSTATEMENT = `
    UPDATE Battles SET battle_name = ?, battle_body = ?
    WHERE battle_id = ?;

    `
    VALUES = [data.battle_name,  data.battle_body,  data.battle_id];
    pool.query(SQLSTATEMENT, VALUES, callback);



}

module.exports.getNewlyUpdatedBattle = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM 
    Battles
    WHERE battle_id = ?
    `
    // in Battles table its battle_id not battles_id
    VALUES = [data.battle_id]
    pool.query(SQLSTATEMENT, VALUES, callback)

}

//////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////
// Endpoint B5: DELETE /quests/quest_id


module.exports.deleteBattle = (data, callback) => {

    // we want an SQLSTATEMENT that deletes a QuestS where quest_id = ?
    const SQLSTATEMENT = `
    DELETE FROM Quests
    WHERE quest_id = ?
    `
    VALUES = [data.quest_id];
    pool.query(SQLSTATEMENT, VALUES, callback)
}