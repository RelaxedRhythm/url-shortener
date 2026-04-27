const express=require("express");
const { handleGenerateShortURL, handleGenerateCustomUrl, handleShortUrlId, handleGetUserUrls, handleGetAnalytics } = require("../controllers/url");
const { restrictToLoggedInUserOnly } = require("../middlewares/auth");

const router=express.Router();
 
router.post('/', handleGenerateShortURL);
router.post('/customUrl', restrictToLoggedInUserOnly, handleGenerateCustomUrl);

router.get('/analytics/:shortId', restrictToLoggedInUserOnly, handleGetAnalytics);
router.get('/user/urls', restrictToLoggedInUserOnly, handleGetUserUrls);
router.get('/:shortId', handleShortUrlId);

module.exports=router; 

