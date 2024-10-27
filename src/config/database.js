const mongoose = require("mongoose");

const connectDb= async ()=>{
    await mongoose.connect("mongodb+srv://Harika:Harika2004@cluster0.ghxy0.mongodb.net/devTinder");

}


module.exports= {connectDb};
