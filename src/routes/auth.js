const express=require('express');
const authRouter=express.Router();
const { User }= require('../models/user.js')
const bcrypt = require("bcrypt");
const { validateSignUp } = require('../utils/validate.js');

authRouter.post('/signup', async (req, res) => {
    const data = req.body;

    try {
        validateSignUp(req);
        const { firstName, lastName, password, emailId } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, emailId, password: hashedPassword });
        await user.save();
        res.status(201).send("User created successfully");

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
            res.send("Login successful");
        }
    }
    catch (e) {
        res.status(400).send("Error : " + e.message);
    }


})

authRouter.post('/logout',async (req,res)=>{
    res.cookie('token',null,{
        expires : new Date(Date.now())
    });
    res.send("Logout successful");
})

module.exports = authRouter;