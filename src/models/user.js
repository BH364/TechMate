const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
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
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Invalid gender");
            }
        }
    },
    skills: {
        type: [String],

    },
    photourl: {
        type: String,
        validate(value) {
            if (validator.isURL(value)) {
                throw new Error("Invalid photurl");
            }
        }
    },
    about: {
        type: String,
        default: "Hello this is a default about"
    }


}, {
    timestamps: true,
}
)
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Tinder@WEB3", {
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