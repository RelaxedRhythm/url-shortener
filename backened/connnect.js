const mongoose=require("mongoose");

async function connectMongoDb(url){
    return mongoose.connect(url)
    .then(()=>{console.log("connnected to mongodb")})
    // .error((err)=>{console.log("error occured",err)});
}

module.exports= connectMongoDb;