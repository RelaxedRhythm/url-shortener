const Redis=require("ioredis");

const redis= new Redis('redis://localhost:6379');

redis.on("connect",()=>{
    console.log("Redis connected");
}
);

redis.on("error",(err)=>{
    console.log("Redis error:",err);
})

export default redis;