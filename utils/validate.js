const validator=require("validator");

const validateSignUp=(req)=>{
    const data=req.data;
    const {firstName,lastName,emailId,password}=req.body;
    if (data?.skills?.length > 10) {
        throw new Error("User cannot have more than 10 skills");
    }
    else if (data?.about?.length > 100) {
        throw new Error("User cannot have more than 100 characters in about");
    }
    else if(!firstName || !lastName ){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }

}
const validUserProfileData=(req)=>{
    const allowedFields= [
        "firstName",
        "lastName",
        "about",
        "photourl",
        "skills",
        "gender",
        "age"
    ];
    const loggedUser=req.body;
    const isValidUpdate=Object.keys(loggedUser).every((k)=>allowedFields.includes(k));
    return isValidUpdate;
}

module.exports={ validateSignUp,validUserProfileData};