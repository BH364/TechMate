const express=require('express');
const requestRouter= express.Router();
const { userAuth } = require('../middlewares/userAuth.js');



requestRouter.post('/sentConnectionRequest',userAuth,async (req,res)=>{
   
    const user=req.user;
    res.send(user.firstName + " sent the connection");
   

});

module.exports=requestRouter;