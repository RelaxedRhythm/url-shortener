const redis = require("../config/redis");
const { nanoid } = require("nanoid");
const { URL } = require("../models/url");
const Visit = require("../models/visit");
const visit = require("../models/visit");

async function handleGenerateShortURL(req, res) {
  const body = req.body;
  const ogUrl = body.url;
  // console.log(req.body);
  if (!ogUrl) return res.status(400).json({ error: "url is required" });

  const shortId = nanoid(8);

  await URL.create({
    shortId: shortId,
    redirectUrl: ogUrl,
    visitHistory: [],
    createdBy: req.user ? req.user._id : undefined,
  });
  //caching

  await redis.set(`url:${shortId}`, ogUrl, {
    EX: 60 * 60 * 24 * 7,
  });
  return res.json({ id: shortId });
}

async function handleGenerateCustomUrl(req, res) {
  const body = req.body;
  const ogUrl = body.url;
  const customUrl = body.customId;
  if (!ogUrl || !customId)
    return res.status(400).json({ error: "url and customId is required" });
  if (!req.user)
    return res
      .status(401)
      .json({ error: "Login required to create a custom URL" });

  const existingEntry = await URL.findOne({ shortId: customUrl });
  if (existingEntry) {
    return res.status(400).json({ error: "Custom ID already in use" });
  }

  await URL.create({
    shortId: customUrl,
    redirectUrl: ogUrl,
    visitHistory: [],
    createdBy: req.user._id,
  });
  //caching
  await redis.set(`url:${customUrlId}`, ogUrl, {
    EX: 60 * 60 * 24 * 7,
  });

  return res.json({ id: customUrl });
}

async function handleShortUrlId(req, res) {
  const shortId = req.params.shortId;

  const cacheKey = `url:${shortId}`;
  const cached = await redis.get(cacheKey);
  //cache hit
  if (cached) return res.redirect(cached);

  //cache miss
  const entry = await URL.findOne({ shortId });

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  Visit.create({
    urlId: entry._id,
    timestamp: new Date(),
    ip: req.ip,
    userAgent: req.get("user-agent"),
    referrer: req.get("referer"),
  }).catch((err) => {
    console.error("Failed to record visit:", err);
  });

  // Analytics counter
//   await redis.incr(`analytics:${shortId}:clicks`);

  // caching
  await redis.set(cacheKey, entry.redirectUrl, {
    EX: 3600,
  });

  res.redirect(entry.redirectUrl);
}

async function handleGetUserUrls(req, res) {
  try {
    const userUrls = await URL.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
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
    if (
      urlEntry.createdBy &&
      urlEntry.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized to view this URL's analytics" });
    }

    const visits = await visit
      .find({ urlId: urlEntry._id })
      .sort({ timestamp: -1 });

    const analytics = visits.map((visit) => ({
      timestamp: visit.timestamp,
    }));

    const totalClicks= visits.length;

    // const totalRedisClicks = await redis.get(`analytics:${shortId}:clicks`);
      
    // Convert timeStamp to timestamp for frontend consistency

    res.json({
      shortId,
      totalClicks,
      analytics,
      createdAt: urlEntry.createdAt,
      redirectUrl: urlEntry.redirectUrl,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

module.exports = {
  handleGenerateShortURL,
  handleGenerateCustomUrl,
  handleShortUrlId,
  handleGetUserUrls,
  handleGetAnalytics,
};
