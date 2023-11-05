const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const routers = require("./routers/routes")
const cookieParser = require('cookie-parser');

const oauth = require('./routers/oauth');



const port= 4000;

const app = express();


app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

//jwt check middleware
app.use('/jwt/', async (req, res, next) => {
  console.log('in middleware');
  //get cookie from browser
  const token = req.cookies.jwt;
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
              console.log('valid');
              next();
          }
      });
  }
  else{
      res.status(403).send('Error validating JWT token;');
  }
})

app.use('/oauth', oauth);



// //DB Connection
const dbURI= 'mongodb://127.0.0.1:27017/dailyWiki';
mongoose.connect(dbURI)
    .then((res) => app.listen(port)
);


//Routes
app.use(routers);
app.get('/', (req, res) =>{
    res.send("this is working");
});

app.get('/jwt/test', (req, res) =>{
  console.log('got here');
  res.send("this is working");
});



