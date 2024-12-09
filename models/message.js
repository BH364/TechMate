const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    receiverId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
    },
    image:{
        type:String,
    },
    codeSnippet: {
        type: String,
      },
      codeLanguage: {
        type: String,
        enum: ['javascript', 'python', 'java', 'cpp', 'other'],
      }
},{
    timestamps:true

});

const Message = mongoose.model("Message",messageSchema);
module.exports = {Message};