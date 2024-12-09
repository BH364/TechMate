const express=require('express');
const requestRouter= express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { User } = require('../models/user.js');
const { ConnectionRequest } = require('../models/connectionRequest.js');



requestRouter.post('/request/send/:status/:toUserId',userAuth,async (req,res)=>{
   try{
    const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;
    const isToUserPresent= await User.findById(toUserId);
    if(!isToUserPresent){
        return res.status(400).send("User not valid");
    }
    const allowedStatus= [ "interested","ignored"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message:"Invalid status !!!"
        })
    }
    const existingConnectionRequest= await ConnectionRequest.findOne({
        $or :[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
    }) 
    if(existingConnectionRequest){
        return res.status(400).json({
            message:"Already connection exists"
        })
    }

    const connectionRequest=new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    });
    const data=await connectionRequest.save();
    res.json({
        message: fromUserId+ " " + status + " in " + toUserId,
        data
    })
    
   }
   catch(err){
    res.status(400).send("Error : "+err.message);
   }
   

});

requestRouter.post('/request/review/:status/:requestId',userAuth,async (req,res)=>{
    try{
        const loggedUserId=req.user._id;
        const {status,requestId}=req.params;
        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status"});
        }
        const isRequestPresent = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedUserId,
            status:"interested"

        });
        if(!isRequestPresent){
            return res.status(400).json({message:"Not a valid request"});
        }
        isRequestPresent.status=status;
        const data=await isRequestPresent.save();
        res.json({message: loggedUserId + " " + status + " the request which is sent by " + data.fromUserId,
            data
        });
    }
    catch(err){
        res.status(400).send("Error "+err.message);
    }
})
module.exports=requestRouter;