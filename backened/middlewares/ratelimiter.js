const redis= require("../config/redis");

const rateLimiter = (limit,window)=>{
    return async(req,res,next)=>{
        const ip=req.ip;
        const key= `rate:${ip}`;

        const requests= await redis.incr(key);

        if(requests===1) await redis.expire(key,window);

        if(requests > limit){
            return res.status(429).json({
                success:false,
                message:"Too many requests. please try again later",
            });
        }
        next();
    };
};

module.exports = rateLimiter;