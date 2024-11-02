const express=require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/userAuth.js');
const { ConnectionRequest } = require('../models/connectionRequest');
const {User} = require('../models/user.js')
const safe_fields= ["firstName"," lastName" ,"age", "about", "photourl", "gender","skills"];
userRouter.get('/user/requests/recieved',userAuth,async (req,res)=>{
    try{ 
        const user=req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId:user._id,
            status:"interested",
        }).populate("fromUserId",safe_fields);
        res.json({
            message:" Your connection requests : ",
            data:connectionRequests
        });
    }
    catch(err){
        res.status(400).send("Error : "+err.message);
    }
})

userRouter.get('/user/requests/connections',userAuth,async (req,res)=>{
    try{
        const user=req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {toUserId:user._id , status:"accepted"},

                {fromUserId:user._id , status:"accepted"},
            ],
        })
        .populate("fromUserId",safe_fields)
        .populate("toUserId",safe_fields);
        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === user._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({
            data
        });
    }
    catch(err){
        res.status(400).send("Error : "+err.message);
    }
})

userRouter.get('/user/feed',userAuth,async (req,res)=>{
    try{
        const user=req.user;
        const page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        limit = limit>50 ? 50 : limit;
        const skip=(page-1)*limit;

        const connectionRequests= await ConnectionRequest.find({
            $or :[
                {fromUserId:user._id},
                {toUserId: user._id}
            ],
        }).select("fromUserId toUserId");

        const hidefromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hidefromFeed.add(req.fromUserId.toString());
            hidefromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and :[
                { _id: {$nin : Array.from(hidefromFeed)}},
                {_id : {$ne : user._id}}

            ],
        }).select(safe_fields).skip(skip).limit(limit);
        res.json(users);
    }
    catch(err){
        res.status(400).send("Error : "+err.message);
    }
})
module.exports = userRouter;