const { User } = require("../models/user.js");
const { ConnectionRequest } = require("../models/connectionRequest.js");
const {Message} = require('../models/message.js');
const { getReceiverSocketId ,io} = require("../lib/socket.js");
const safe_fields= ["firstName","lastName" ,"age", "about", "photourl", "gender","skills"];
const cloudinary=require('../lib/cloudinary.js')
const getUsersForSideBar = async (req, res) => {
    try {
        const user=req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {toUserId:user._id , status:"accepted"},

                {fromUserId:user._id , status:"accepted"},
            ],
        })
        .populate("fromUserId",safe_fields)
        .populate("toUserId",safe_fields);
        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === user._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.status(200).json({
            message: "Filtered users for the sidebar",
            data: data
        });
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
};

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 }); // Sort messages by creation time

        res.status(200).json({
            messages: messages || [],
        
        });
    } catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const sendMessage = async (req, res) => {
    try {
        const { text, image,codeSnippet ,codeLanguage} = req.body;
        
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;

        if (image) {
            const response = await cloudinary.uploader.upload(image, {
                resource_type: 'image',
            });
            imageUrl = response.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            codeSnippet,
            codeLanguage,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(400).send("Error: " + error.message);
    }
};

module.exports = {getUsersForSideBar,getMessages,sendMessage};
