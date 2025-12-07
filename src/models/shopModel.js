const pool = require('../services/db');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint B13
module.exports.getAllItems = (callback) => {

    // We want an SQLSTATEMENT to retrieve all items from the Shop Table

    const SQLSTATEMENT = `
    SELECT * FROM 
    Shop
    `
    pool.query(SQLSTATEMENT, callback);

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
// Endpoint B14
module.exports.checkItemExistByItemId = (data, callback) => {

    // we want an SQLSTATEMENT to retrieve a item from the shop by item_id
    const SQLSTATEMENT = `
    SELECT * FROM
    Shop
    WHERE item_id = ?
    `
    const VALUES = [data.item_id];
    pool.query(SQLSTATEMENT, VALUES, callback);

}

module.exports.getItemByItemId = (data, callback) => {

        // we want an SQLSTATEMENT to retrieve a item from the shop by item_id
        const SQLSTATEMENT = `
        SELECT * FROM
        Shop
        WHERE item_id = ?
        `
        const VALUES = [data.item_id];
        pool.query(SQLSTATEMENT, VALUES, callback);
    
}

///////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////
// Endpoint B15

module.exports.checkItemExistsByItemName = (data, callback )=> {
    // we want an SQLSTATEMENT That uses Item_name to select an item from the shop for the controller
    const SQLSTATEMENT = `
    SELECT * FROM 
    Shop
    WHERE item_name = ?
    `
    const VALUES = [data.item_name];
    pool.query(SQLSTATEMENT, VALUES, callback);
}




module.exports.postNewItem = (data, callback) => {

    // we want an SQLSTATEMENT That inserts item details into the shop
    const SQLSTATEMENT = `
    INSERT INTO Shop (item_name, item_description, item_cost, item_type, item_rarity) VALUES
    (?, ?, ?, ?, ?)
    `;
    VALUES = [data.item_name, data.item_description, data.item_cost, data.item_type, data.item_rarity]
    pool.query(SQLSTATEMENT, VALUES, callback)


}

module.exports.getItemByItemName = (data, callback ) => {
    // we want an SQLSTATEMENT that selects a item from the shop based on item_id
    const SQLSTATEMENT = `
    SELECT * FROM 
    Shop
    Where item_id = ?
    `
    VALUES = [data.item_id];
    pool.query(SQLSTATEMENT, VALUES, callback)
}

//////////////////////////////////////////////////////////////////////////

// Endpoint B16: Update Item by "item_id"

module.exports.updateItemByItemId = (data, callback) => {

    // we want an SQLSTATEMENT that updates a item from the shop based on item_id
   const SQLSTATEMENT = `
    UPDATE Shop SET item_name = ?, item_description = ?, item_cost = ?, item_type = ?, item_rarity = ?
    WHERE item_id = ?;
    `
    VALUES = [data.item_name, data.item_description, data.item_cost, data.item_type, data.item_rarity, data.item_id];
    pool.query(SQLSTATEMENT, VALUES, callback)


}

module.exports.getNewlyUpdatedItem = (data, callback) => {

    const SQLSTATEMENT = `
    SELECT * FROM Shop
    WHERE item_id = ?;
    `
    VALUES = [data.updated_item_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}





/////////////////////////////////////////////////////////////////////////////////////


// Endpoint B17: DELETE Item by "item_id"

module.exports.deleteItem = (data, callback) => {

    // we want an SQLSTATEMENT that deletes an item by using "item_id"
    const SQLSTATEMENT = `
    DELETE FROM 
    Shop
    WHERE item_id = ?
    `
    VALUES = [data.item_id];
    pool.query(SQLSTATEMENT, VALUES, callback)
}