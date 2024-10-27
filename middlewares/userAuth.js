const userAuth=(req,res,next)=>{
   const token="xyz";
   const isAuth=token==="xyz";
   if(!isAuth){
       res.status(401).send("User not authorized");
   }
   else{
    next();
   }
}

module.exports={userAuth};