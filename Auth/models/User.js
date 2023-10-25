const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt')
const {Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        minLength: 1,
        required: [true,'Please enter your name'],
    },
    email:{
        type: String,
        unique: true,
        required: [true,'Please enter an email'],
        validate:[(val) => { isEmail(val)},'Plwase enter a valid email exp: person@email.com'],
    },
    password:{
        type: String,
        required: [true,'Please enter a password']
    },
});

// encypt password before insert to db
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(); // genarate salt
    this.password = await bcrypt.hash(this.password,salt); // hash the user password + the generated salt
    next();
})


userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password); // if password match will evaluate to true
        if(auth){
            return user;
        }
        else{
            throw Error("incorrect password");
        }
    }
    throw Error("incorrect Email");
}

const User = mongoose.model('user', userSchema);

module.exports = User;