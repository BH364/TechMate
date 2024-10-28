const express=require('express');

const app=express();
const {User}=require("../src/models/user.js")
const {connectDb}=require("../src/config/database.js");

app.use(express.json());
app.post('/signup', async(req,res)=>{
    const userEmail=req.body.emailId;
    try{
       const users=await User.findOne({emailId:userEmail});
       if(users.length===0){
         res.status(404).send("No documents found");
       }
       else{
              res.send(users);
   
       }

    }
    catch(e){
        res.status(400).send("Error occured ",e.message);
    }

});

app.get('/feed',async(req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(e){
        res.status(500).send("No documents")
    }
    
})
connectDb().then(()=>{
    console.log("Connection established");
    app.listen(7777,()=>{
        console.log("server running on 7777...");
     })
})
.catch((err)=>{
    console.error("Error encountered while connecting to server")
})



