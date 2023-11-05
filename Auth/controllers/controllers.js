const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library'); 


dotenv.config();

//Handle errors
const handleErrors = (err)=>{
    let error = {name:'', email: '', password:''};


    //sign in errors
    if(err.message === "incorrect password" ){
        error.password = "Wrong password! please try another one.";
    }
    if(err.message === "incorrect Email" ){
        error.email = 'That Email is not registered!';
    }

    //sign up errors
    if(err.code === 11000){
        error.email = 'Email is allready used! choose another email.'
        return error;
    }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path] = properties.message
        });
    }
    return error;
}

module.exports.createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: 24 * 60 * 60 // 1 day
    });
}


module.exports.signup_get = (req, res) =>{
    res.send('signup-page')
}

module.exports.signup_post = async (req, res) =>{
    const {name, email, password} = req.body;
    console.log(name +" " + email +" "+ password);
    try{
        const user = await User.create({name,email,password});
        const token = createToken(user._id);
        res.cookie('jwt',token, { httpOnly: true, maxAge: 1000 * 24 * 60 * 60});
        res.status(201).json(user._id);
    }
    catch(err){
        const errors = handleErrors(err);
        console.log(errors);
        res.status(400).json(errors);
    }
}

module.exports.signin_get = (req, res) =>{
    res.send('signin-page')
}

module.exports.signin_post = async (req, res) =>{
    const {email, password} = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt',token, { httpOnly: true , maxAge: 1000 * 24 * 60 * 60, origin: 'localhost', SameSite: 'none'});
        const {password: password1 , ...rest} = user;
        res.status(200).json({user: rest._doc});
    }
    catch(err){
        const errors = handleErrors(err);
        console.log(errors);
        res.status(400).json(errors);
    }
}

module.exports.googleSign_post = (req, res) =>{
    const redirectUrl = 'http://localhost:4000/oauth';  //redirect url in google console

    const oAuth2Client =  new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl);

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile  openid  https://www.googleapis.com/auth/userinfo.email', 
        prompt: 'consent'
        });
    // console.log(authorizeUrl);
    res.json({url:authorizeUrl});
}



module.exports.validateJWT_get = (req, res) =>{
    //get cookie from browser
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    // const token = req.cookies.jwt;
    console.log(token);
    if(token){
        //if token exist need to check its not compermized
        const valid = jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) =>{
            if(err){
                console.log(err.message);
                res.status(403).send('Error validating JWT token');        
            }
            else{
                // token exist and verified, so can continue
                res.status(200).send('Ok');
            }
        });
    }
    else{
        res.status(403).send('Error validating JWT token');
    }
}

module.exports.logout_get = (req, res) =>{
   // give black value and expired after 1 ms
    res.cookie('jwt','',{maxAge: 1});
    res.redirect('http://localhost:3000/');
}