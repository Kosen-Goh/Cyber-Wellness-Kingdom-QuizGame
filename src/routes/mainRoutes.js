const express = require('express');
const router = express.Router();




const exampleController = require('../controllers/exampleController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');  // may need remove if not using









// Endpoint 1 : POST /users
// Endpoint 1 - 4 , B24 - B28
const userRoutes = require('./userRoutes');
router.use('/users', userRoutes)

////////////////////////////////////////////////////////////////////////////////////////


// Endpoint 5: /questions, also for the rest of the endpoints from 5 onwards
// Endpoints 5 - 10
const questionRoutes = require('./questionRoutes');
router.use('/questions', questionRoutes)
///////////////////////////////






// Section B routes
// Table battle
// B1 - B5
const battleRoutes = require('./battleRoutes');
router.use('/battles', battleRoutes);

// Table character
// B6 - B10, B16 - B23,  B30 - B38
const characterRoutes = require('./characterRoutes');
router.use('/characters', characterRoutes);

// Table shop
// Endpoint B11 - B15
const shopRoutes = require('./shopRoutes');
router.use('/shop', shopRoutes);


// CA2 Reviews implementation
const reviewRoutes = require('./reviewRoutes');

router.use("/review", reviewRoutes);


















//////////////////////////////////////////////////////////////////////////////////////////////////
// Verify Token when needed and get userId when needed
//////////////////////////////////////////////////////////////////////////////////////////
router.get("/jwt/verify", jwtMiddleware.verifyToken, exampleController.showTokenVerified);
// For the /jwt/verify route
// 1. jwtMiddleware.verifyToken middleware is executed to verify the token
// 2. exampleController.showTokenVerified is executed to respond with a success message
// router.get("/jwt/verify", jwtMiddleware.verifyToken, exampleController.showTokenVerified);



module.exports = router;