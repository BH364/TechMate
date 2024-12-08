const express= require('express');
const { userAuth } = require('../middlewares/userAuth.js');
const {getUsersForSideBar,getMessages,sendMessage} = require('../controllers/message.js');

const messageRouter = express.Router();
messageRouter.get("/users",userAuth,getUsersForSideBar)
messageRouter.get('/:id',userAuth,getMessages);
messageRouter.post('/send/:id',userAuth,sendMessage);
module.exports = messageRouter;