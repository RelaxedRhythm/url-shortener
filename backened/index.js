const express=require("express");
const path=require("path");
const cookieParser=require("cookie-parser");
const cors=require("cors");
require("dotenv").config();
const connectMongoDb=require("./connnect");
const urlRoute=require("./routes/url");
const {URL}=require("./models/url");
const staticRouter=require("./routes/staticRouter");
const userRouter=require("./routes/user");
const {restrictToLoggedInUserOnly,checkAuth}=require("./middlewares/auth")

const app=express();
const port=process.env.PORT || 9000;

connectMongoDb(process.env.Db_URL);

app.set("view engine","ejs");
app.set("views",path.resolve("./view")); // yeh btata h ki hme view folder mein se ejs file ko  render krna h

//middleware?
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5175',
    credentials: true
}));
app.use(express.json()); //to parse the body
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.get("/test",async(req,res)=>{
    const allUrls=await URL.find({});
    return res.render("home",{urls:allUrls});
});

app.use("/url",checkAuth,urlRoute);
app.use("/",checkAuth,staticRouter)

app.use("/user",userRouter);

app.listen(port,()=>console.log(`server started at port:${port}`));
