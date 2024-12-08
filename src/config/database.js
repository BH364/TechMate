const mongoose = require("mongoose");
require('dotenv').config();  // Ensure .env variables are loaded

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("DB connected");
    } catch (err) {
        console.error("Error connecting to DB:", err);
    }
};

module.exports = { connectDb };
