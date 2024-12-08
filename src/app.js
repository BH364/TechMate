const express = require('express');
const { app, server } = require('../src/lib/socket.js');
const { connectDb } = require("../src/config/database.js");
const cookieParser = require('cookie-parser');
const authRouter = require('../src/routes/auth.js');
const profileRouter = require('../src/routes/profile.js');
const requestRouter = require('../src/routes/request.js');
const userRouter = require('../src/routes/user.js');
const messageRouter = require('./routes/message.js');
require("dotenv").config();
const cors = require('cors');

// Middleware for handling CORS
const corsOptions = {
    origin: [
        "http://localhost:5173", // Local development frontend URL
        "https://tech-mate-front-liard.vercel.app" // Production frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-XSRF-TOKEN"],
    credentials: true // This is important to allow credentials (cookies)
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions)); // Handle preflight OPTIONS requests


// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Route handlers
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/requests", requestRouter);
app.use("/users", userRouter);
app.use("/messages", messageRouter);

// Database connection and server initialization
connectDb()
    .then(() => {
        server.listen(7777, () => {
            console.log("App is running on 7777");
        });
    })
    .catch((err) => {
        console.error("Error encountered while connecting to the database:", err);
    });

// Catch-all handler for 404 errors
app.use((req, res) => {
    res.status(404).json({ message: "404: NOT_FOUND" });
});
