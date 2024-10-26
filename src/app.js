const express=require('express');

const app=express();
app.use("/test",(req,res)=>{
    res.send("This is test page");
})

app.use("/hello",(req,res)=>{
    res.send("Hello world");
})
app.use("/",(req,res)=>{
    res.send("This is message from backend");
})


app.listen(7777,()=>{
    console.log("server running successfully");
});