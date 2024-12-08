const mongoose = require("mongoose");

const connectDb= async ()=>{
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("DB connected");

}


module.exports= {connectDb};
