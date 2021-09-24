const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/Sukeshsingh',
{   useNewUrlParser:true, 
    // useUnifiedTopology: true,
    //  useFindAndModify: false

},(Err,Res)=>{
    if(Err){
        console.log("Not Connected to dataBase ");
    }else{
        console.log("Connection successfull In Mongoose Db");
    }
})