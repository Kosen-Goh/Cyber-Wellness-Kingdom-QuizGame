const express = require('express');
const router = express.Router();
const controller = require('../controllers/characterController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');


// Need put leaderboard here otherwise will match with other endpoints
// Endpoint B38 -> GET /characters/character_id/leaderboard
// Advanced Endpoint For Section b -> Leaderboard to rank Characters by level
router.get('/leaderboard', controller.getCharacterLeaderboard)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B29 ( User-Character Interactivity)  B23-B27 was in /users , this the last endpoint in User-Character Interactivity sECTION
// Advanced Task 6 GET info about all players using the playerUserRel table
router.get('/users', controller.checkIfCharacterExist, controller.checkIfCharacterUserRelEmpty, controller.getCharactersInfoUsingCharacterUserRel)
// Had to put this endpoint here because if we put it all the way below it matches with B6 which we dont want, last part of advanced practical 5 also explains this
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/////<Start of Basic Stuff//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////<BASIC>
// we're in /characters now, / is /characters 
////////////////////////////////////////////////////////////////////////
// Endpoint B6 getAllCharacters
router.get('/', controller.getAllCharacters);
/////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B7 getCharacterById
router.get('/:character_id', controller.checkCharacterExistByCharId, controller.getCharacterByCharId)
// paramas: character_id (params)
// body: none (req.body)
// validate character_id
//////////////////////////////////////////////////////////////////////

// no post or update character cuz thats in higher user-character interactivity section


/////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B8 DELETE CHARACTERS /characters/character_id
router.delete('/:character_id', jwtMiddleware.verifyToken, controller.checkCharacterExistByCharId, controller.deleteCharacter )
/////////////////////////////////////////////////////////////////////////////////////////

////End of Basic Stuff//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// <BASIC>



// Start Of Getting Character battles and selecting battles for character
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// <GET AND SELECT CHARACTER BATTLES>

////////////////////////////////////////////////////////////////////////////////
// Endpoint B9 GET Battles For Characters /characters/character_id/battles 
// purpose of this endpoint: To let s specific character see all battles and then choose a battle in B12
router.get('/:character_id/battles', controller.checkCharacterExistByCharId, controller.getCharacterInfoForBattleInterface, controller.getAllBattlesForCharacter)
///////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// Endpoint B10 Accept Battles For Characters /characters/character_id/battles 
// purpose of this endpoint: To let s specific character accept a battle. If lets say they defeated a battle and character_battle_id become null (Higher game interactivity section explains), then now "character_battle_id" will be updated with a new battle
router.put('/:character_id/battles', jwtMiddleware.verifyToken, controller.checkCharacterExistByCharId, controller.getCharacterSilver, controller.getCostOfBattle, controller.updateBattleIdAndDeductSilverForCharacter)
 // we also need deduct silver from character as the battle_cost **
///////////////////////////////////////////////////////////////////////////////////////////

//End Of Getting Character battles and selecting battles for character///////////////////////////////////////////////////////////////////////////////////////////////////////////////// <GET AND SELECT CHARACTER BATTLES> 

// Endpoints B11 - B15 are in shopRoutes







// Start of HIGHER GAME INTERACTIVITY -> Fighting the battles 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// <HIGHER GAME INTERACTIVTY>
// Higher game interactivty
// Endpoint B16- B18 work together to serve the fighting battle monster process

// Endpoint B16 (higher game interactivty)
router.get('/:character_id/battleinstance' , controller.checkCharacterExistByCharId, controller.selectCharacterBattleId, controller.getBattleInstanceByBattleId);
// /characters/:characterId/questInstance/:questId
// where questId is character_quest (which is quest ID)
// flow: check character exits , get the character_quest

// Endpoint B17 (higher game interactivty) GET Weapons owned by User in its inventory 
router.get('/:character_id/battleinstance/inventory', controller.checkCharacterExistByCharId, controller.getWeaponsOwnedByCharacter)

// Endpoint B18 (higher game interactivity)
// PUT Character weapon to deal damage to the boss
router.put('/:character_id/battleinstance',  jwtMiddleware.verifyToken, controller.checkCharacterExistByCharId, controller.selectCharacterBattleId, controller.getWeaponDamage, controller.insertWeaponDamageToMonster, controller.getAffectedBattleInstance, controller.getCompletedBattleRewards, controller.giveRewardsAndNullCharBattleId, controller.checkLevelForCharacter, controller.updateLevelRegenMonsterAndDisplayCongratsMessage)
// FLOW: Checkcharexists, getbattleId to get the battle instance later on, getweapon damage based on the prev endpoint once user choose his weapon and put the id in body , UPDATE Monster health and subtract weapon damage from its health, get new battle instance
// get affected battle instance means a battle instance wheere the user has dealt damage to the boss
// 9 functions 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// <HIGHER GAME INTERACTIVITY>
                                                                                                                        // important to get character battleId so can heal the specific monster
router.put('/:character_id/battleinstance/healMonster', jwtMiddleware.verifyToken, controller.checkCharacterExistByCharId, controller.selectCharacterBattleId, controller.healMonsterToFullHp)






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////<Start Of Shop -> Buy , Sell, SPin>
// Character-Shop Interactivity -> for characters to BUY & SELL items
// Endpoint

// Endpoint B19 (Character-Shop Interactivity)
// GET /characters/character_id/shop
router.get('/:character_id/shop', controller.checkCharacterExistByCharId, controller.getCharacterInfoForShopInterface, controller.getShopForCharacter)
// simple endpoint for character to see items in shop

// Endpoint B20 is the acutal purchase should be u give the id in PUT req.body then check if enough gold then PUT it in character inventory or weapons

// Endpoint B20 (Character-Shop Interactivity)
// BUY
router.put('/:character_id/shop', jwtMiddleware.verifyToken, controller.checkCharacterExistByCharId, controller.getCharacterInfoForShopInterface,controller.checkIfItemExists, controller.checkIfCharacterOwnsItemAlready, controller.checkCharacterGoldEnough, controller.subtractGoldAndAddItemForCharacterInventory, controller.giveGoldtoSellerAndRemoveFromShop)


// SELL
// Endpoint B21
router.post('/:character_id/shop/sell', jwtMiddleware.verifyToken, controller.checkCharacterExistByCharId, controller.checkCharacterLevelToSell, controller.checkIfCharacterOwnItem, controller.getCharacterItemInfoToPost, controller.postCharacterItemToShopToSell, controller.removeCharacterItemFromInventory, controller.getCharacterNewlySellItem )

// SPIN
// Advanced feature -> lucky spin to get random item in the shop
// Endpoints B22 Get Spin Interface
router.get('/:character_id/shop/spin', controller.checkCharacterExistByCharId, controller.getSpinCostForShopInterface, controller.getCharacterInfoForShopInterface, controller.getSpinForCharacter)
// spin interface is basically getShopForCharacter but slightly diff 


// Endpoint B23 Spinning The Wheel - PUT
router.put('/:character_id/shop/spin',  jwtMiddleware.verifyToken, controller.checkCharacterExistByCharId, controller.getCharacterInfoForShopInterface, controller.checkAndSubtractCharacterGoldForSpin,  controller.subtractGoldForSpin, controller.getRandomRarityFromSpin, controller.getRandomItemWIdithRarityFromShop, controller.addSpinItemToCharInventoryAndDisplayMessage)
// item earned from spin will either be added to inventory or weapon

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////<END OF SHOPPP -> BUY, SELL, SPIN>



// B24 -B28 in UserRoutes , B29 at very top of this file


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Character-Inventory Interactivity - intended to allow characters to check their inventory, delete items, quick sell items? , filter , sortby item_type?, count? , highest rated -> PLEASE USE ADVANCED SQL QUERIES HERE

// Endpoint B30 Getting a character's inventory , prob need inner join or something
router.get('/:character_id/inventory', controller.checkCharacterExistByCharId, controller.getCharacterInfoForInventory, controller.getCharacterInventory)

// Endpoint B31 Deleting a character item in inventory, prob need inner join or something
router.delete('/:character_id/inventory', jwtMiddleware.verifyToken, controller.checkCharacterExistByCharId, controller.getCharacterInfoForInventory, controller.deleteItemFromCharacterInventory)


// Sorting Character Inventory
// Endpoint B32 
// ascending rarity: /characters/character_id/rarity/ascending 
router.get('/:character_id/inventory/rarity/ascending',  controller.checkCharacterExistByCharId, controller.getCharacterInfoForInventory, controller.ascendingOrderForInventoryRarity)

// Sort

// Endpoint B33
// descending rarity: /characters/character_id/rarity/descending 
router.get('/:character_id/inventory/rarity/descending',  controller.checkCharacterExistByCharId, controller.getCharacterInfoForInventory, controller.descendingOrderForInventoryRarity)

// Endpoint B34
// ascending damage: /characters/character_id/damage/ascending
router.get('/:character_id/inventory/damage/ascending',  controller.checkCharacterExistByCharId, controller.getCharacterInfoForInventory, controller.ascendingOrderForInventoryDamage)

// Endpoint B35 
// descending damage: /characters/character_id/damage/descension
router.get('/:character_id/inventory/damage/descending',  controller.checkCharacterExistByCharId, controller.getCharacterInfoForInventory, controller.descendingOrderForInventoryDamage)

// Filter

// Endpoint B36 -> Filter by rarity/rarity-grade
router.get('/:character_id/inventory/rarity/:rarity_grade', controller.checkCharacterExistByCharId, controller.getCharacterInfoForInventory, controller.filterRarityForInventoryRarity)

// Endpoint B37 -> Filter by inventory item type /type/weapons or /type/others
router.get('/:character_id/inventory/type/:item_type', controller.checkCharacterExistByCharId, controller.getCharacterInfoForInventory, controller.filterItemTypeForInventoryItemType)


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

























module.exports = router