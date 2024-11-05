const express = require('express');
const app = express();
const {connectDb}  = require("../src/config/database.js");
const cookieParser = require('cookie-parser');
const authRouter=require('../src/routes/auth.js');
const profileRouter = require('../src/routes/profile.js');
const requestRouter=require('../src/routes/request.js');
const userRouter=require('../src/routes/user.js')
require("dotenv").config(); 
const cors=require('cors');
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
connectDb().then(() => {
    app.listen(7777, () => {
    })
})
    .catch((err) => {
        console.error("Error encountered while connecting to server")
    })



