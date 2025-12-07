//////////////////////////////////////////////////////
// REQUIRE BCRYPT MODULE
//////////////////////////////////////////////////////
const bcrypt = require("bcrypt")
//////////////////////////////////////////////////////
// SET SALT ROUNDS
//////////////////////////////////////////////////////
const saltRounds = 12; // increased to 12 for enhanched security


//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR COMPARING PASSWORD
//////////////////////////////////////////////////////
// The comparePassword fxn is a middleware that compares the password provided
// in the req body *with the hashed password stored in res.locals.hash*
// if the passwords match, it calls the next() fxn to move to the next middleware or route handler
// if the passwords dont match it returns a response with status code of 401 (unauthorized) and a json message indicating that the password is wrong
module.exports.comparePassword = (req, res, next) => {
    // Check password
    const callback = (err, isMatch) => {
        if (err) {
            console.error("Error bcrypt:", err);
            res.status(500).json(err)
        } else {
            if (isMatch) {
                next();
            } else {
                res.status(401).json({
                    message: "Wrong password"
                });
            }
        }
    }
    // compares the password provided in req.body with the hashed password stored in res.locals.hash
    bcrypt.compare(req.body.password, res.locals.hash, callback)
};

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR HASHING PASSWORD
//////////////////////////////////////////////////////
// The hashPassword function is a middleware that **hashes the password provided in the request**
// body using the specified number of salt rounds (saltRounds)
// It stores the hashed password in the res.locals.hash for later use

// this was asked in basic exercise but was already found earlier in the codes
module.exports.hashPassword = (req, res, next) => {
    
    const callback = (err, hash) => {
        if (err) {
            console.error("Error bcrypt:", err);
            res.status(500).json(err);
        } else {
            res.locals.hash = hash;
            next();
        }
    }
    bcrypt.hash(req.body.password, saltRounds, callback);
};

