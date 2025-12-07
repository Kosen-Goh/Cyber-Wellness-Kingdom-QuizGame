//////////////////////////////////////////////////////
// REQUIRE DOTENV MODULE
//////////////////////////////////////////////////////
require("dotenv").config();
//////////////////////////////////////////////////////
// REQUIRE JWT MODULE
//////////////////////////////////////////////////////
const jwt = require("jsonwebtoken");

//////////////////////////////////////////////////////
// SET JWT CONFIGURATION
//////////////////////////////////////////////////////
const secretKey = process.env.JWT_SECRET_KEY;
const tokenDuration = process.env.JWT_EXPIRES_IN;
const tokenAlgorithm = process.env.JWT_ALGORITHM;

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR GENERATING JWT TOKEN
//////////////////////////////////////////////////////
module.exports.generateToken = (req, res, next) => {
   
  const payload = {
      userId:  res.locals.userId , // from the prev fxn in the register routes, we want to embed the userId in the token
      timestamp: new Date()
    };
  
    const options = {
      algorithm: tokenAlgorithm,
      expiresIn: tokenDuration,
    };
  
    const callback = (err, token) => {
      if (err) {
        console.error("Error jwt:", err);
        res.status(500).json(err);
      } else {
        res.locals.token = token;
        next();
      }
    };
  
    const token = jwt.sign(payload, secretKey, options, callback);
  };
//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR SENDING JWT TOKEN
//////////////////////////////////////////////////////
// This function sends the JWT token in the JSON response
module.exports.sendToken = (req, res, next) => {
    res.status(200).json({
      message: res.locals.message,
      token: res.locals.token,
      userId: res.locals.userId // To set the userId in local storage to use
    });
  };
  

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR VERIFYING JWT TOKEN
//////////////////////////////////////////////////////
// This function verifies the JWT token sent in the request haders
module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("This is the authHeader: " + authHeader)
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const token = authHeader.substring(7);
  
    if (!token) {
      console.log("token")
      return res.status(401).json({ error: "No token provided" });
    }
  
    const callback = (err, decoded) => {
      if (err) {
        console.log("err")
        return res.status(401).json({ error: "Invalid token" });
      }
  
      res.locals.userId = decoded.userId;
      res.locals.tokenTimestamp = decoded.timestamp;
    
  
      next();
    };
  
    jwt.verify(token, secretKey, callback);
  };
  

  /////////////////////////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////
  // For register make a new jwtGenerate cuz if not conflict with regist when passing userId's and make the token abit goofy when logging/ registering

