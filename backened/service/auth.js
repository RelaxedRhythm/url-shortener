// const sessionIdToUserMap= new Map();
// function setUser(id,user){
//     sessionIdToUserMap.set(id,user);
// }

// function getUser(id){
//     return sessionIdToUserMap.get(id);
// }

// module.exports={
//     setUser,getUser
// }

const jwt=require("jsonwebtoken");
const secKey="rhysha2805"
function setUser(user){
    if (!user) return null;
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
    };
    try {
        return jwt.sign(payload, secKey);
    } catch {
        return null;
    }
}
function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token, secKey);
    } catch {
        return null;
    }
}

module.exports ={setUser,getUser}