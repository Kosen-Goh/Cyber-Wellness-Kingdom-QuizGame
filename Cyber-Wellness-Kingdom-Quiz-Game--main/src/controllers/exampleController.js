
//////////////////////////////////////////////////////
// EXAMPLE CONTROLLER FOR TOKEN PRE-GENERATION
//////////////////////////////////////////////////////

// The preTokenGenerate function is executed before generating a JWT token 
// and sets the userId in res.locals based on the id received in the request body
module.exports.preTokenGenerate = (req, res, next) => {
    res.locals.userId = req.body.id;
    next();
}

//////////////////////////////////////////////////////
// EXAMPLE CONTROLLER FOR BEFORE SENDING TOKEN
//////////////////////////////////////////////////////

// The beforeSendToken function is executed before sending the JWT token and sets
// the message in res.locals to store a string "Token is generated". It will then run
// the next() function
module.exports.beforeSendToken = (req, res, next) => {
    res.locals.message = `Token is generated.`;
    next();
}

//////////////////////////////////////////////////////
// EXAMPLE CONTROLLER FOR TOKEN VERIFICATION
//////////////////////////////////////////////////////

// showTokenVerified function is executed after verifying a JWT token and responds
// with a success message in the JSON response
module.exports.showTokenVerified = (req, res, next) => {
    res.status(200).json({
        userId: res.locals.userId,
        message: "Token is verified."
    });
}

//////////////////////////////////////////////////////
// EXAMPLE CONTROLLER FOR BCRYPT COMPARE
//////////////////////////////////////////////////////

// The showCompareSuccess function is executed after suuccessfully comparing a 
// password using bcrypt and responds with a success message in the JSON response
module.exports.showCompareSuccess = (req, res, next) => {
    res.status(200).json({
        message: "Compare is successful."
    });
}

//////////////////////////////////////////////////////
// EXAMPLE CONTROLLER FOR BCRYPT PRE-COMPARE
//////////////////////////////////////////////////////

// The preCompare function is execute before comparing passwords and sets the hash
// in the res.locals based on the hash received in the request body.
module.exports.preCompare = (req, res, next) => {
    res.locals.hash = req.body.hash;
    next();
}

//////////////////////////////////////////////////////
// EXAMPLE CONTROLLER FOR BCRYPT HASHING
//////////////////////////////////////////////////////

// The showHashing function is executed after hashing a password using bcrypt and responds
// with the hashed password and a success message in the JSON response
module.exports.showHashing = (req, res, next) => {
    res.status(200).json({
        hash: res.locals.hash,
        message: `Hash is successful.`
    });
}


