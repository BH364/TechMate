const express=require('express');
const profileRouter=express.Router();
const cloudinary=require('../lib/cloudinary.js')
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
    
    try{
    const isValidateFields=await validUserProfileData(req);
   
    if(!isValidateFields){
         throw new Error("Can't update some of these fields");
    }
    const loggedUser=req.user;

    Object.keys(req.body).forEach((k)=>{loggedUser[k]=req.body[k]});
    if (req.body.photourl) {
        // If it's an image URL, upload it to Cloudinary
        const response = await cloudinary.uploader.upload(req.body.photourl, {
            resource_type: 'image' // Ensures it's treated as an image
        });
        loggedUser.photourl = response.secure_url;
    }

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

profileRouter.patch('/profile/password',userAuth,async(req,res)=>{
    try{
    const user=req.user;
    user.password=req.body.password;
    user.save();
    res.send("Password updated successfully");
    }
    catch(e){
        res.status(400).send("Error : "+e.message);
    }
})


module.exports =profileRouter;