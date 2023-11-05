const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

const { createToken } = require('../controllers/controllers');
dotenv.config();

const {OAuth2Client} = require('google-auth-library');

// async function getUserData(access_token) {

//   const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  
//   const data = await response.json();
//   // add user details to DB.
//   const userDetails = {name: data.name ,email: data.email ,password: 'google-Account'};
//   //call function to sign up user
//   try{
//     const res = await fetch('http://localhost:4000/signup',{
//       method: "POST",
//       headers: {'Content-Type':"application/json"},
//       body: JSON.stringify(userDetails)
//     });
//     return res;
//     }catch(err){
//       console.log(err);
//     }
// }



/* GET home page. */
router.get('/', async function(req, res, next) {
  const code = req.query.code;
  try {
      const redirectURL = "http://localhost:4000/oauth"
      const oAuth2Client = new OAuth2Client(
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          redirectURL
      );
      const r =  await oAuth2Client.getToken(code);
      // Make sure to set the credentials on the OAuth2 client.
      await oAuth2Client.setCredentials(r.tokens);
      // console.info('Tokens acquired.');
      const user = oAuth2Client.credentials;
      // console.log('credentials',user.data);
      // const data = await getUserData(oAuth2Client.credentials.access_token);
      const access_token = oAuth2Client.credentials.access_token;
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
      const data = await response.json();
      const userDetails = {name: data.name ,email: data.email ,password: 'google-Account'};


      //Check if user exist in my db if not add him
      
      //Sign user up and create token 
      const result = await fetch('http://localhost:4000/signup',{
            method: "POST",
            headers: {'Content-Type':"application/json"},
            body: JSON.stringify(userDetails)
      });
      //Create  jwt token and store it in cookies
      console.log('about to create new jwt for google sign in');
      const token = createToken(result._id);
      res.cookie('jwt',token, { httpOnly: true, maxAge: 1000 * 24 * 60 * 60});

      } catch (err) {
        console.log('Error logging in with OAuth2 user', err);
    }

    res.redirect(303, 'http://localhost:3000/');
  


});

module.exports = router;