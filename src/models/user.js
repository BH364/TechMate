const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config(); 

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50

    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid emailId");
            }
        }

    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter strong password");
            }
        }


    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        enum:{
            values:["Male","Female","Other"],
            message:"{value} is not a valid gender"
        }
       
    },
    skills: {
        type: [String]
      
    },
    photourl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photurl");
            }
        }
    },
    about: {
        type: String,
        
    }


}, {
    timestamps: true,
}
);
userSchema.index({firstName:1},{lastName:1});
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
    return token;
}
userSchema.methods.isvalidPassword = async function (passwordByUser) {
    const user = this;
    const passwordHashed = user.password;
    const isValid = await bcrypt.compare(passwordByUser, passwordHashed);
    return isValid;
}
const User = mongoose.model('User', userSchema);
module.exports = { User };