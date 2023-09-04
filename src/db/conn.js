const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/regForm',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family:4,

})
.then(() => {
    console.log("connected to database successfully")
})
.catch((err)=>{
    console.log(err);
})