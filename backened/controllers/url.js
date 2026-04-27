const {nanoid} =require("nanoid");
const {URL}=require("../models/url")

async function handleGenerateShortURL(req,res){

    const body=req.body;
    // console.log(req.body);
    if(!body.url) return res.status(400).json({error:"url is required"});

    const shortId= nanoid(8);

    await URL.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy: req.user ? req.user._id : undefined,
    })

    return res.json({id:shortId});
}

async function handleGenerateCustomUrl(req,res){
    const body = req.body;
    if(!body.url || !body.customId) return res.status(400).json({error:"url and customId is required"});
    if(!req.user) return res.status(401).json({ error: "Login required to create a custom URL" });

    const existingEntry = await URL.findOne({ shortId: body.customId });
    if (existingEntry) {
        return res.status(400).json({ error: "Custom ID already in use" });
    }

    await URL.create({
        shortId: body.customId,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });

    return res.json({ id: body.customId });
}   

async function handleShortUrlId(req,res){
    const shortId= req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId,
    },{
        $push:{
            visitHistory:{
               timeStamp: Date.now(),
            },
        },
    });
     if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    res.redirect(entry.redirectUrl);
}

async function handleGetUserUrls(req, res) {
    try {
        const userUrls = await URL.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        res.json(userUrls);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user URLs" });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const { shortId } = req.params;
        const urlEntry = await URL.findOne({ shortId });
        
        if (!urlEntry) {
            return res.status(404).json({ error: "URL not found" });
        }

        // Check if user is authorized to view analytics
        if (urlEntry.createdBy && urlEntry.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized to view this URL's analytics" });
        }

        const totalClicks = urlEntry.visitHistory.length;
        
        // Convert timeStamp to timestamp for frontend consistency
        const analytics = urlEntry.visitHistory.map(visit => ({
            timestamp: visit.timeStamp
        }));

        res.json({
            shortId,
            totalClicks,
            analytics,
            createdAt: urlEntry.createdAt,
            redirectUrl: urlEntry.redirectUrl
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
}

module.exports={
    handleGenerateShortURL,handleGenerateCustomUrl,handleShortUrlId,handleGetUserUrls,handleGetAnalytics,
};