const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const stuSchema  = new mongoose.Schema({
 name: {type: String, required: true},
 email:{type:String, required: true},
 password:{type:String, required: true},
 confirm_password:{type:String, required: true},

 tokens:[{
    token:{
        type: String, required: true
 }}]

});

//Generating TOkens
stuSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id)
        const token = jwt.sign({_id:this._id.toString()},"iamdipeshkhaijuandiamnothappyrightnow");
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(err){
        res.send("THe error: " + err);
        console.log("THe error: " + err);
    }

}

//Hashing passwords
stuSchema.pre("save",async function(next){
    if (this.isModified("password")){
        // const hashPass = await brycpt.hash(password,10);
        console.log(`The password is ${this.password}`);
        this.password = await bcrypt.hash(this.password,10);
        console.log(`The password is ${this.password}`);

        this.confirm_password = await bcrypt.hash(this.password,10);
    }
    next();

} )

const Student = new mongoose.model('Student', stuSchema);

module.exports = Student;