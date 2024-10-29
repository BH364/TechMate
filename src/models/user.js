const mongoose=require("mongoose");
const validator=require("validator");
const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50

    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid emailId");
            }
        }

    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
               throw new Error("Enter strong password");
            }
        }


    },
     age:{
        type:Number,
        min:18,
        max:100
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Invalid gender");
            }
        }
    },
    skills:{
        type:[String],
        
    },
    photourl:{
        type:String,
        validate(value){
            if(validator.isURL(value)){
                 throw new Error("Invalid photurl");
            }
        }
    },
    about:{
        type:String,
        default:"Hello this is a default about"
    }

    
},{
    timestamps:true,
}
)

const User=mongoose.model('User',userSchema);
module.exports={User};