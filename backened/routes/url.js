const express=require("express");
const { handleGenerateShortURL, handleGenerateCustomUrl, handleShortUrlId, handlegetAnalytics } = require("../controllers/url");
const { restrictToLoggedInUserOnly } = require("../middlewares/auth");

const router=express.Router();
 
router.post('/', handleGenerateShortURL);
router.post('/customUrl', restrictToLoggedInUserOnly, handleGenerateCustomUrl);

router.get('/:shortId',handleShortUrlId);
router.get('/analytics/:shortId',handlegetAnalytics);
module.exports=router; 

