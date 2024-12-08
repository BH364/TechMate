const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// CORS Middleware for HTTP Requests
const corsOptions = {
    origin: ["http://localhost:5173", "https://tech-mate-front-liard.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
};
app.use(cors(corsOptions));

// Parse JSON requests
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Socket.IO Configuration
const io = new Server(server, {
    cors: corsOptions, // Use the same CORS options as HTTP
    maxHttpBufferSize: 1e7,
});

const userSocketMap = {};
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Send online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

// Start the Server
server.listen(process.env.PORT || 7777, () => {
    console.log(`Server running on port ${process.env.PORT || 7777}`);
});

module.exports = { io, app, server };
