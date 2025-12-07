const express = require('express');
const router = express.Router();
const controller = require('../controllers/shopController');
const jwtMiddleware = require('../middlewares/jwtMiddleware'); 

// Endpoint B11 GET ALL ITEMS IN ShOP
router.get('/', controller.getAllItems )
//////////////////////////////////////////////////

// Endpoint B12 GET A Specific Item by Item_id
router.get('/:item_id', controller.checkItemExistByItemId, controller.getItemByItemId);
///////////////////////////////////////////////////////////////////////////////


// Endpoint B13 POST A Item in the shop
router.post('/', jwtMiddleware.verifyToken, controller.checkItemExistsByItemName, controller.postNewItem, controller.getNewlyPostedItem)
//////////////////////////////////////////////////////////////////////////////////////

// Endpoint B14 PUT A Item in the 
router.put('/:item_id', jwtMiddleware.verifyToken, controller.checkItemExistByItemId, controller.checkItemExistsByItemName, controller.updateItemByItemId, controller.getNewlyUpdatedItem )
// use the controllers in B12 and B13 to help check if item exist by item id and check item exist by the item name(which has validation), update, 
// getItemByItemId from B12

// Endpoint B15 DELETE A Item in the Shop
router.delete('/:item_id', jwtMiddleware.verifyToken, controller.checkItemExistByItemId, controller.deleteItem)
// Use B1 fxn to check item exist with "item_id"


module.exports = router