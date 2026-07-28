const mongoose = require("mongoose");
const visitSchema = new mongoose.Schema({
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "URL",
        required: true,
        index: true,
    },

    timestamp: {
        type: Date,
        default: Date.now,
    },

    ip: {
        type: String,
    },

    userAgent: {
        type: String,
    },

    referrer: {
        type: String,
    },
});

module.exports = mongoose.model("Visit", visitSchema);