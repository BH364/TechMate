const express = require('express');
const {app,server} = require('../src/lib/socket.js')
const {connectDb}  = require("../src/config/database.js");
const cookieParser = require('cookie-parser');
const authRouter=require('../src/routes/auth.js');
const profileRouter = require('../src/routes/profile.js');
const requestRouter=require('../src/routes/request.js');
const userRouter=require('../src/routes/user.js')
require("dotenv").config(); 
const cors=require('cors');
const messageRouter = require('./routes/message.js');
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
})
);
app.use(express.json());
app.use(cookieParser());


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/messages",messageRouter)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});
connectDb().then(() => {
    server.listen(7777, () => {
        console.log("App is running on 7777")
    })
})
    .catch((err) => {
        console.error("Error encountered while connecting to server")
    })



