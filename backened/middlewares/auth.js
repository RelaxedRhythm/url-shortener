const {getUser} = require("../service/auth")

async function restrictToLoggedInUserOnly(req,res,next){
    const tokenCookie = req.cookies?.token;
    const authHeader = req.headers.authorization;
    const token = tokenCookie || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);

    if(!token) return res.status(401).json({ error: "Login required" });

    const user = getUser(token);
    if(!user) return res.status(401).json({ error: "Invalid token" });

    req.user = user;
    next();
}
async function checkAuth(req,res,next) {
    const tokenCookie = req.cookies?.token;
    const authHeader = req.headers.authorization;
    const token = tokenCookie || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);

    const user = getUser(token);

    req.user = user;
    next();
}


function checkForAuth(req,res,next){
    const tokenCookie=req.cookies?.token;
    req.user =null;
    if(!tokenCookie) return next();
    const token=tokenCookie;
    const user=getUser(token);

    req.user=user;
    return next();
}

function restrictTo(roles=[]){
    return function(req,res,next){
        if(!req.user) return res.redirect('/login');
        if(!roles.includes(req.user.role)) return res.status(403).send("unauthorized");

        return next();
    }
}

module.exports= {restrictToLoggedInUserOnly,checkAuth ,checkForAuth,restrictTo};