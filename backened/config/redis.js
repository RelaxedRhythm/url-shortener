//local development
// const Redis = require("ioredis");
// const redis= new Redis({'redis://localhost:6379'});

const { Redis }= require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// for io redis version

// redis.on("connect",()=>{
//     console.log("Redis connected");
// }
// );

// redis.on("error",(err)=>{
//     console.log("Redis error:",err);
// })

module.exports = redis;