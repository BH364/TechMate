const express = require('express');
const app = express();
const {connectDb}  = require("../src/config/database.js");
const cookieParser = require('cookie-parser');
const authRouter=require('../src/routes/auth.js');
const profileRouter = require('../src/routes/profile.js');
const requestRouter=require('../src/routes/request.js');
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectDb().then(() => {
    console.log("Connection established");
    app.listen(7777, () => {
        console.log("server running on 7777...");
    })
})
    .catch((err) => {
        console.error("Error encountered while connecting to server")
    })



