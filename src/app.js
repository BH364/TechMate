const express=require('express');

const app=express();
const {User}=require("../src/models/user.js")
const {connectDb}=require("../src/config/database.js");
app.post('/signup', async(req,res)=>{
    const user=new User({
        firstName:"Rushi",
        lastName:"Balaga",
        emailId:"rushi@balaga.com",
        password:"balagarushi"

    });
    try{
       await user.save();
       res.send("Successfully signed up");

    }
    catch(e){
        res.status(400).send("Error occured ",e.message);
    }

});
connectDb().then(()=>{
    console.log("Connection established");
    app.listen(7777,()=>{
        console.log("server running on 7777...");
     })
})
.catch((err)=>{
    console.error("Error encountered while connecting to server")
})



