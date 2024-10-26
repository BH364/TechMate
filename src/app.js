const express=require('express');

const app=express();

// app.use("/test",(req,res)=>{
//     res.send("This is test page");
// })

app.get("/test",(req,res)=>{
    res.send("Get the data");
})

app.post('/test',(req,res)=>{
    res.send("Post the data");
})

app.delete('/test',(req,res)=>{
    res.send("Deleted successfully");
})

app.patch("/test",(req,res)=>{
    res.send("Path the data");
})

app.put("/test",(req,res)=>{
    res.send("put the data");
})

app.get("/user",[(req,res,next)=>{
    console.log("Hello world"); 
    // next();

},
(req,res,next)=>{
     console.log("Hello world");
    next();

},
(req,res,next)=>{
    console.log("Hello world");
    next();

}],
(req,res,next)=>{
    console.log("Hello world");
    res.send("4th conncetion");
}
)
// app.get("/user",(req,res)=>{
//     console.log(req.query);
//     res.send("sucessfull");
// })

// app.get("/user/:userId/:name",(req,res)=>{
//     console.log(req.params);
//     res.send("put the data");
// })
// app.get(/.*fly$/,(req,res)=>{
//     res.send("Put the data");
// })

// app.get('/ab(de)+c',(req,res)=>{
//     res.send("Executed");
// })
// app.get('/ab+c',(req,res)=>{
//     res.send("Executed");
// })

// app.get('/ab?c',(req,res)=>{
//     res.send("Executed");
// })

app.listen(7777,()=>{
    console.log("server running successfully");
});