const { Router } = require("express")
const controllers = require('../controllers/controllers');


const router = Router();

//Route for getting signup page
router.get('/signup',controllers.signup_get);

//Route for sending signup inforamtion
router.post('/signup', controllers.signup_post);

//Route for getting signin page
router.get('/signin',controllers.signin_get);    

//Route for sending signup inforamtion
router.post('/signin', controllers.signin_post);

//Google sign in route
router.post('/oauth', controllers.googleSign_post);


module.exports = router;