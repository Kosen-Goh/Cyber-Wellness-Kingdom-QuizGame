// For CA2 reviews implementation
const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT Reviews.id, Reviews.review_amt, Reviews.user_id, Reviews.created_at, Reviews.review_text, User.username
    FROM Reviews
    INNER JOIN User ON Reviews.user_id = User.user_id
    `;

    pool.query(SQLSTATMENT, callback);
}


module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Reviews
    WHERE id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO Reviews (review_amt, user_id, review_text)
    VALUES (?, ?, ?);
    `;
    const VALUES = [data.review_amt, data.user_id, data.review_text];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE Reviews 
    SET review_amt = ?, user_id = ?, review_text = ?
    WHERE id = ?;
    `;
    const VALUES = [data.review_amt, data.user_id, data.review_text, data.id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
    DELETE FROM Reviews 
    WHERE id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATMENT, VALUES, callback);
}