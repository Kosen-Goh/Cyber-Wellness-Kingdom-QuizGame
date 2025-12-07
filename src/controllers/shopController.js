const model = require('../models/shopModel');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B11
module.exports.getAllItems = (req, res, next) => {

    const callback = (error, results, fields) => {
     if (error) {
     console.error("Error getAllItems:" , error)
     res.status(500).json(error)
     }
     else {
         res.status(200).json(results)
     }
 
    } 
    model.getAllItems(callback)
 }
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B12 Get Item by Item Id
module.exports.checkItemExistByItemId = (req, res, next ) => {

    const data = {
        item_id: req.params.item_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkItemExistByItemId: ", error);
            res.status(500).json(error)
        }
        else {
         if (results.length == 0 ) {
            // 404 not found
           return res.status(404).json({message:"This item with item_id: " + data.item_id + " can't be found!"})
         }
            next();
        }

    }
    model.checkItemExistByItemId(data, callback);
}


module.exports.getItemByItemId = (req, res, next) => {

     const data = {
     item_id: req.params.item_id
}

    const callback = (error, results, fields) => {
        if (error ) {
            console.error("Error getItemByItemId:", error);
            res.status(500).json(error)
        } else {
            // a results.length == 0 means no item by that item id, double check
            if (results.length == 0) {
                return res.status(404).json({message:"This item with item_id: " + data.item_id + " can't be found!"})
            }
            else {
                res.status(200).json(results[0]);
            }
        }
    }
    model.getItemByItemId(data, callback);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B13 POST New Item

module.exports.checkItemExistsByItemName = (req, res, next) => {
    // validation for name , description, cost -> idk how validate name and dsec
    if (isNaN(req.body.item_cost)) {
        // send a 400 bad request 
        return res.status(400).json({message:"The item_cost is not a number. Please try again. Endpoint B13 failed."})
    }

    // store our item_name to check if alrdy exists
    const data = {
        item_name: req.body.item_name
    }
   

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkItemExistsByItemName:", error);
            res.status(500).json(error)
        }
        else {
            // means item already exists so conflict -> 409
            if (results.length !== 0) {
               return res.status(409).json({message:"This item_name: " + data.item_name + " already exists. Please try again."})
            }
            else {
                next()
            }

        }

    }

    model.checkItemExistsByItemName(data, callback)
}

// This is a general post new item diff from the character one , this one is like more for administrative purposes
module.exports.postNewItem = (req, res, next) => {

    // validate input
    if (req.body.item_name == "" || req.body.item_name == undefined || req.body.item_description == "" || req.body.item_description == undefined || req.body.item_cost == undefined || req.body.item_type == "" || req.body.item_type == undefined || req.body.item_rarity == "" || req.body.item_rarity == undefined) {
          // send a 400 bad request 
          return res.status(400).json({message:"Missing input for items"})
    }
    // need validate if the item_type and item_rarity is part of the game e.g. common, uncommon, rare, epic, legendary,    others, weapons
    if (req.body.item_type != "weapon" && req.body.item_type != "others") {
         // send a 400 bad request 
         return res.status(400).json({message:"Invalid item_type for the new item. Must be item_type: weapon or item_type: others"})
    }
    if (req.body.item_rarity !== "Common" && req.body.item_rarity !== "Uncommon" && req.body.item_rarity !== "Rare" && req.body.item_rarity !== "Epic" && req.body.item_rarity !== "Legendary") {
        // send a 400 bad request 
        return res.status(400).json({message:"Invalid item_rarity for the new item. Must be item_rarity: Common , Uncommon, Rare, Epic, Legendary"})
    }

   
    const data = {
        item_name: req.body.item_name,
        item_description: req.body.item_description,
        item_cost: req.body.item_cost,
        item_type: req.body.item_type,
        item_rarity: req.body.item_rarity
    }

    const callback = (error, results, fields) => {
        if (error) {
        console.error("Error postNewItem:", error);
        res.status(500).json(error)
        }
        else {

            //  see if it actually posted A new item in the database
            if (results.affectedRows == 0) {
                // 400 Bad request cuz most likely a bad req that caused a update failre
                res.status(400).json({message:"New Item was not posted."})
            }
            else {
                // store the new item id to get in next fxn
                res.locals.new_item_id = results.insertId
            
                next();
            }
        }

    }
    model.postNewItem(data, callback)
}


module.exports.getNewlyPostedItem = (req, res, next) => {

    const data = {
        item_id:  res.locals.new_item_id 
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getItemByItemName:", error)
            res.status(500).json(error);
        }
        else {
            res.status(200).json({message:"Here is the newly posted item in the shop" , new_item: results[0]});
        }


    }
    model.getItemByItemName(data, callback);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Endpoint B14 Update Item by "item_id"
// most of the endpoints reuse frm the other endpoints

module.exports.updateItemByItemId = (req, res, next) => {

    // validate input
    if (req.body.item_name == "" || req.body.item_name == undefined || req.body.item_description == "" || req.body.item_description == undefined || req.body.item_cost == undefined || req.body.item_type == "" || req.body.item_type == undefined || req.body.item_rarity == "" || req.body.item_rarity == undefined) {
        // send a 400 bad request 
        return res.status(400).json({message:"Missing input for items"})
  }
  // need validate if the item_type and item_rarity is part of the game e.g. common, uncommon, rare, epic, legendary,    others, weapons
  if (req.body.item_type != "weapon" && req.body.item_type != "others") {
       // send a 400 bad request 
       return res.status(400).json({message:"Invalid item_type for the new item. Must be item_type: weapon or item_type: others"})
  }
  if (req.body.item_rarity !== "Common" && req.body.item_rarity !== "Uncommon" && req.body.item_rarity !== "Rare" && req.body.item_rarity !== "Epic" && req.body.item_rarity !== "Legendary") {
      // send a 400 bad request 
      return res.status(400).json({message:"Invalid item_rarity for the new item. Must be item_rarity: Common , Uncommon, Rare, Epic, Legendary"})
  }



    const data = {
        item_id: req.params.item_id,
        item_name: req.body.item_name,
        item_description: req.body.item_description,
        item_cost: req.body.item_cost,
        item_type: req.body.item_type,
        item_rarity: req.body.item_rarity
    }



    const callback = (error, results, fields) => {
    if (error) {
        console.error("Error getItemByItemName:", error)
        res.status(500).json(error);
    }
    else {
       if (results.affectedRows == 0) {
    
        // update failed since affected rows == 0, 400 -> bad request 
      return res.status(400).json({message:"Failed to update the item!"})
       }
       else {
        // store the id to use in next fxn
      
        // res.locals.updated_item_id = results.insertId
        next();
       }
    }
}

    model.updateItemByItemId(data, callback);

}
 

module.exports.getNewlyUpdatedItem = (req, res, next) => {

    const data = {
        updated_item_id: req.params.item_id
    }

    const callback = (error, results, fields) => {
        
        if (error ) {
            console.error("Error getNewlyUpdatedItem:", error);
            res.status(500).json(error)
        } else {
           
            // a results.length == 0 means no item by that item id, double check
            if (results.length == 0) {
                return res.status(404).json({message:"This item with item_id: " + data.item_id + " can't be found!"})
            }
            else {
                res.status(200).json(results[0]);
            }
        }


}
    model.getNewlyUpdatedItem(data, callback)
}
/////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Endpoint B15 Delete Item by "item_id"

module.exports.deleteItem = (req, res, next) => {

    const data = {
        // was "req.params_item_id" instead of "req.params.item_id" so data not passed correctly and couldnt delete
        item_id: req.params.item_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteItem:", error)
            res.status(500).json(error);
        }
        else {
            // if results.affectedRows == 0 means it was not deleted since no affected rows
            if (results.affectedRows == 0) {
                // bad request -> 400 , prob cuz bad request thats why cannot delete
                res.status(400).json({message:"The item was not deleted. Deletion failed. Endpoint B15 failed"});
            }
            else {
            // 204 -> no content and a message to show the item has been deleted
            res.status(204).send();
                // if u have a 204, no matter what content u put, it wont display
            }
        }
    }
    model.deleteItem(data, callback)

} 

////////////////////////////////////////////////////////////////////////////////////////