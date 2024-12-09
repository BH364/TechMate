const express=require('express');
const authRouter=express.Router();
const { User }= require('../models/user.js')
const bcrypt = require("bcrypt");
const { validateSignUp } = require('../utils/validate.js');
const { userAuth } = require('../middlewares/userAuth.js');

authRouter.post('/signup', async (req, res) => {
    const data = req.body;

    try {
        
        validateSignUp(req);
        
        const { firstName, lastName, password, emailId,photourl,about,skills,gender,age} = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, emailId, password: hashedPassword,photourl,about,skills,gender,age });
        const savedUser=await user.save();
        const token = await user.getJWT();
        res.cookie('token', token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly: true });
        res.status(201).json({
            message:"User created successfully",
            data:savedUser,
            token:token
        });

    }
    catch (e) {
        res.status(400).send("Error occured" + e.message);
    }

});


authRouter.post('/login', async (req, res) => {
    try {
        
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        
        if (!user) {
            throw new Error("Invalid credentials");
        }
        
        const isValid = await user.isvalidPassword(password);
        if (!isValid) {
            throw new Error("Invalid credentials");
        }
        else {
            const token = await user.getJWT();
            res.cookie('token', token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly: true });
            res.json({data:user,token:token});

        }
    }
    catch (e) {
        res.status(400).send("Error : " + e.message);
    }


});

authRouter.post('/logout',async (req,res)=>{
    res.cookie('token',null,{
        expires : new Date(Date.now())
    });
    res.send("Logout successful");
});
authRouter.get('/auth/check',userAuth,async(req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
module.exports = authRouter;