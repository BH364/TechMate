const adminAuth= (req,res,next)=>{
    const token="xyz";
    const isAuth=token==="abc";
    if(!isAuth){
        res.status(401).send("Admin not authorized");
    }
    else{
        next();
    }
}
module.exports={adminAuth};