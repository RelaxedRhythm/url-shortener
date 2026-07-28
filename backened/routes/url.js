const express=require("express");
const { handleGenerateShortURL, handleGenerateCustomUrl, handleShortUrlId, handleGetUserUrls, handleGetAnalytics } = require("../controllers/url");
const { restrictToLoggedInUserOnly } = require("../middlewares/auth");
const  rateLimiter  = require("../middlewares/ratelimiter");

const router=express.Router();
 
router.post('/', rateLimiter(20,60) ,handleGenerateShortURL);
router.post('/customUrl', restrictToLoggedInUserOnly, rateLimiter(30,60) ,handleGenerateCustomUrl);

router.get('/analytics/:shortId', restrictToLoggedInUserOnly, handleGetAnalytics);
router.get('/user/urls', restrictToLoggedInUserOnly, handleGetUserUrls);
router.get('/:shortId', handleShortUrlId);

module.exports=router; 

