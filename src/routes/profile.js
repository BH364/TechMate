const express=require('express');
const profileRouter=express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (e) {
        res.status(400).send("Error :" + e.message);
    }
})


module.exports =profileRouter;