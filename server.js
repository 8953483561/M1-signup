const express=require('express');
const app=express();
const dbConnection=require('./connection/dbConnection');
const router = require('./routers/userRouter');
const userModel=require("./models/userModel");
const staticRouter = require('./routers/staticRouter');





app.use(express.json({limit:'16mb'}));
app.use('/user',router);
app.use('/static',staticRouter);
app.get("/",(req,res)=>{
    console.log("I am comming");
})

const port=5050;
app.listen(port,(err,res)=>{
    if(err){
        console.log("Server Error");
    }else{
        console.log(`server Start on port:${port}`);
        
    }
})

