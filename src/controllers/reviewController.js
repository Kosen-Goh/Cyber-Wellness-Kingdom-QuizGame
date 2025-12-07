// For CA2 Reviews Implementation
const model = require("../models/reviewModel.js");
const pool = require("../services/db.js");

module.exports.createReview = (req, res, next) => {
    if(req.body.review_amt == undefined)
    {
        res.status(400).send({message:"Error: review_amt is undefined"});
        return;
    }
    else if(req.body.review_amt > 5 || req.body.review_amt < 1)
    {
        res.status(400).send({message:"Error: review_amt can only be between 1 to 5"});
        return;
    }
    else if(req.body.user_id == undefined)
    {
        res.status(400).send({message:"Error: user_id is undefined"});
        return;
    }

    const data = {
        user_id: req.body.user_id,
        review_amt: req.body.review_amt,
        review_text: req.body.review_text
    }

    console.log("data", data);

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createMessage:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json(results);
        }
    }

    model.insertSingle(data, callback);
}

module.exports.readReviewById = (req, res, next) => {
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readReviewById:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "Review not found"
                });
            }
            else res.status(200).json(results[0]);
        }
    }

    model.selectById(data, callback);
}

module.exports.readAllReview = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllReview:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    model.selectAll(callback);
}

module.exports.updateReviewById = (req, res, next) => {
    if(req.params.id == undefined)
    {
        res.status(400).send({message:"Error: id is undefined"});
        return;
    }
    else if(req.body.review_amt == undefined)
    {
        res.status(400).send({message:"Error: review_amt is undefined"});
        return;
    }
    else if(req.body.review_amt > 5 || req.body.review_amt < 1)
    {
        // change the message here so the front end will have a nicer user friendly message that cater for the user experience and not see language and terminologies used in the backend.
        res.status(400).send({message:"Please provide a valid rating from 1 - 5"});
        return;  
    }
    else if(req.body.user_id == undefined)
    {
        res.status(400).send({message:"Error: userId is undefined"});
        return;
    }

    const data = {
        id: req.params.id,
        user_id: req.body.user_id,
        review_amt: req.body.review_amt,
        review_text: req.body.review_text
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateReviewById:", error);
            res.status(500).json(error);
        } else {
            res.status(204).send({message:"Review updated successfully!"});
        }
    }

    model.updateById(data, callback);
}

module.exports.deleteReviewById = (req, res, next) => {
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteReviewById:", error);
            res.status(500).json(error);
        } else {
            if(results.affectedRows == 0) 
            {
                res.status(404).json({
                    message: "Review not found"
                });
            }
            else
            {
                res.status(204).send();
            }
        }
    }

    model.deleteById(data, callback);
}