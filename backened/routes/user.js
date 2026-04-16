const express=require("express");
const {handleUserSignUp,handleUserLogin}=require("../controllers/user");
const {checkAuth}=require("../middlewares/auth");
const router =express.Router();

router.post("/signup",handleUserSignUp);
router.post("/login",handleUserLogin);
router.get("/me", checkAuth, (req, res) => {
    if (req.user) {
        return res.json({ user: { name: req.user.name, email: req.user.email } });
    } else {
        return res.status(401).json({ error: "Not logged in" });
    }
});
module.exports=router;