const express = require('express');
const { app, server } = require('./lib/socket.js');
const { connectDb } = require("./config/database.js");
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const requestRouter = require('./routes/request.js');
const userRouter = require('./routes/user.js');
const messageRouter = require('./routes/message.js');
require("dotenv").config();
const cors = require('cors');
app.use(express.json());
app.use(cookieParser());
// Middleware for handling CORS
const corsOptions = {
    origin: [
        "http://localhost:5173", // Local development frontend URL
        "https://tech-mate-front-liard.vercel.app" // Production frontend URL
    ],
    credentials: true // This is important to allow credentials (cookies)
};

app.use(cors(corsOptions));



// Middleware for parsing JSON and cookies

// oute handlers
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/requests", requestRouter);
app.use("/users", userRouter);
app.use("/messages", messageRouter);
app.get('/',(req,res)=>{
    res.send("API working")
})
// Database connection and server initialization
connectDb()
    .then(() => {
        server.listen(process.env.PORT || 7777, () => {
            console.log("App is running on 7777");
        });
    })
    .catch((err) => {
        console.error("Error encountered while connecting to the database:", err);
    });

// Catch-all handler for 404 errors



