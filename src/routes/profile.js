const express=require('express');
const profileRouter=express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const {validUserProfileData} =require('../utils/validate.js');
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (e) {
        res.status(400).send("Error :" + e.message);
    }
})

profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    console.log(req.body);
    console.log(req.user);
    try{
    const isValidateFields=await validUserProfileData(req);
   
    if(!isValidateFields){
         throw new Error("Can't update some of these fields");
    }
    const loggedUser=req.user;
    Object.keys(req.body).forEach((k)=>{loggedUser[k]=req.body[k]});
    await loggedUser.save();
    res.json({
        message:`${loggedUser . firstName} profile updated successfully.`,
        data:loggedUser
    });
    }
    catch(e){
        res.status(400).send('Error : '+e.message);
    }
})


module.exports =profileRouter;