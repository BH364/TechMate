const express = require('express');

const app = express();
const { User } = require("../src/models/user.js")
const { connectDb } = require("../src/config/database.js");
const { validateSignUp } = require('./utils/validate.js');
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const { userAuth } = require('../src/middlewares/userAuth.js');
app.use(express.json());
app.use(cookieParser());
app.post('/signup', async (req, res) => {
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


app.post('/login', async (req, res) => {
    try {

        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isValidPassword = await user.isvalidPassword(password);
        if (!isValidPassword) {
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
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (e) {
        res.status(400).send("Error :" + e.message);
    }
})
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    }
    catch (e) {
        res.status(500).send("No documents")
    }

})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }
    catch (e) {
        res.status(400).send("Sorry error occured");
    }
})

app.patch('/user/:userId', async (req, res) => {
    // const userEmail=req.body.emailId;
    const userId = req.params.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ['skills', 'gender', 'age', 'photurl', 'about', 'lastName']
        const isValid = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isValid) {
            throw new error("Invalid fields to update");
        }
        if (data?.skills?.length > 10) {
            throw new error("User cannot have more than 10 skills");
        }
        const users = await User.findOneAndUpdate({ _id: userId }, data, { runValidators: true });

        console.log(users);
        res.send("user updated successfully");

    }
    catch (e) {
        res.status(500).send("Error occured");
    }
})
connectDb().then(() => {
    console.log("Connection established");
    app.listen(7777, () => {
        console.log("server running on 7777...");
    })
})
    .catch((err) => {
        console.error("Error encountered while connecting to server")
    })



