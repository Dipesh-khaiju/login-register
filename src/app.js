const express= require('express');
const app = express();
const path= require('path');
const hbs = require('hbs'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Student = require('./models/defSchema');
require('./db/conn')
const port = process.env.PORT || 4000;

// const static_path = path.join(__dirname,"../public")
app.use(express.static(path.join(__dirname,"../public" )));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
            
//using hbs files using this
const templates = path.join(__dirname,"../templates/views");
app.set("views",templates)
app.set("view engine","hbs");

//using partials through here
const partialPath=path.join(__dirname,"../templates/partials");
hbs.registerPartials(partialPath)

app.get('/',(req,res)=>{
    res.render("index");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/index",(req,res)=>{
    res.render("index");
})

//sending data to database  lor creating new user in db
app.post("/index",async (req,res)=>{
    try{
        // console.log(req.body.name)
        const password = req.body.password;
        const cpassword = req.body.confirm_password;

        if(password===cpassword){

            const registerStudent = new Student({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                confirm_password:req.body.confirm_password
            })
            // Securing the Password Using Bcrypt takes place over here

            console.log("Success in "+registerStudent);
            
            //Token generation during register
            const token = await registerStudent.generateAuthToken();
            console.log("The token has been generated"+token)

            const registered = await registerStudent.save();
            res.status(201).render('index')
        }
        else{
            res.send("Password Mismatch")
        }
 
    }
    catch(err){
        res.status(404).send(err);
    }
})

//Logging In
app.post("/login",async(req,res)=>{
    try{
        
        const email = req.body.email;
        const pass= req.body.password;

      const stuEmail = await Student.findOne({email:email});
      
      const isMatch = await bcrypt.compare(pass,stuEmail.password);

      const token = await stuEmail.generateAuthToken();
      console.log("The token has been generated and it is" + token)

        if(isMatch){
           // if(stuEmail.password === pass)
            res.status(201).render("index");
            // res.redirect(www.fb.com) 
        }
        else{
            res.send("Invalid Login Details");
        }

        // res.send(stuEmail.password);
        // console.log(stuEmail);
        // console.log(` ${myemail} ,${pass}`);
        // res.send(` ${myemail} ,${pass}`);
    }
    catch(err){
        res.status(400).send("Wrong Email");
    }
})

// creating Json web Tokens
const createToken = async()=>{
   const token = await jwt.sign({_id:"64e9fdf6a696e8322e2fdfbc"},"secretkeycanbeanythingbutmustbeminimunof32wordstomakeitsecure")
    console.log(token);

    const userVer = await jwt.verify(token,"secretkeycanbeanythingbutmustbeminimunof32wordstomakeitsecure");
    console.log(userVer);
}
createToken();


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})