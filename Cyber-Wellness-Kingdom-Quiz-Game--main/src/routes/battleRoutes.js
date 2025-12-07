const express = require('express');
const router = express.Router();
const controller = require('../controllers/battleController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B1 get all battles
router.get('/',  controller.getAllBattles)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B2 get battle by battle_Id
router.get('/:battle_id', controller.checkBattleExistsByBattleId, controller.getBattlesByBattleId)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// Endpoint B3 POST battle, if level 10 and above can posts battle, need provide character name
router.post('/', jwtMiddleware.verifyToken, controller.checkCharacterLevelForPostBattle, controller.checkIfBattleExistsForPost , controller.postBattle, controller.getNewlyPostedBattle)


// Endpoint B4 PUT Battle, if level 10 and above can PUT/UPDATE quests, need provide character level
router.put('/:battle_id', jwtMiddleware.verifyToken, controller.checkBattleExistsByBattleId,  controller.checkCharacterLevelForPostBattle, controller.updateBattle, controller.getNewlyUpdatedBattle);
// params: battle_id (requires validation)
// body:  battle_name , battle_body (req.body)
// flow: check if quest_id exists, 



//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Endpoint B5 DELETE battles, if level 10 and above can posts quests, need provide character name
router.delete('/:battle_id', jwtMiddleware.verifyToken, controller.checkBattleExistsByBattleId, controller.checkCharacterLevelForPostBattle, controller.deleteBattle )

module.exports = router