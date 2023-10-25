const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routers = require("./routers/routes")
const cookieParser = require('cookie-parser');

const oauth = require('./routers/oauth');



const port= 4000;

const app = express();


app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors());

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
