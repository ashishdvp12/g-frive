const mongoose=require('mongoose');

function connectTodb(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("connected to Db");

    })
}

module.exports=connectTodb;