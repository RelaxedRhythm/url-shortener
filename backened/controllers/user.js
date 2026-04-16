const User=require("../models/user")
// const {v4:uuidv4} =require("uuid")
const {getUser,setUser}=require("../service/auth")


async function handleUserSignUp(req,res){
    const {name,email,password}=req.body;
    console.log(req.body);
    try {
        const user = await User.create({
            name,
            email,
            password
        });
        return res.json({
            success: true,
            user: { name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(400).json({
            success: false,
            error: error.code === 11000 ? "Email already exists" : "Signup failed",
        });
    }
}

async function handleUserLogin(req,res){
    const {email,password}=req.body;
    // console.log(req.body);
    const user= await User.findOne({email,password});
    if(!user) return res.status(401).json({
        error:"invalid username or password",
    })

    const token = setUser(user);
    res.cookie("token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.json({success: true, user: {name: user.name, email: user.email}});   
}
module.exports={handleUserSignUp,handleUserLogin}