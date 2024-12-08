const {Server} = require("socket.io");
const http=require('http');
const express = require('express');

const app=express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true })); 
const server= http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173",
        "https://tech-mate-front-liard.vercel.app" // Production frontend URL

        ],
        methods: ["GET", "POST"], // Allow specific methods
    credentials: true,
    },
    maxHttpBufferSize: 1e7,

});

const userSocketMap = {};
function getReceiverSocketId(userId){
    return userSocketMap[userId];
 }
io.on('connection', (socket) => {
    console.log("A user connected ", socket.id);
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
    }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    

    socket.on('disconnect', () => {
        console.log("A user disconnected ", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

module.exports= {io,app,server,getReceiverSocketId};

