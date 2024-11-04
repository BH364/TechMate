const jwt=require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth=async(req,res,next)=>{
    try{
    const {token}=req.cookies;
    if(!token){
        return res.status(401).send("Please login");
    }
    const decodedObj=await jwt.verify(token,"Tinder@WEB3");
    const {_id}=decodedObj;
    const user=await User.findById(_id);
    if(!user){
        throw new Error("Invalid User");
    }
    req.user=user;
    next();
}
   catch(e){
    res.status(400).send("Error : "+e.message);
   }
}

module.exports = {userAuth};