const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:'{value} is not a valid status'
        }
    }

},
{
    timestamps:true,
});
connectionRequestSchema.index({fromUserId:1},{toUserId:1})
connectionRequestSchema.pre('save',function(next){
    const connectionRequest=this;
      if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
          throw new Error("Cannot send request to yourself");
      }
      next();
})
const ConnectionRequest= mongoose.model('ConnectionRequest',connectionRequestSchema);

module.exports= { ConnectionRequest};