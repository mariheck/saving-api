const mongoose = require('mongoose');

//======================================================
// VIDEOS DB MODEL
//======================================================

const videoSchema = new mongoose.Schema({
    src: String,
    name: String,
    collections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'VideoCollection'
        }
    ]
});

module.exports = mongoose.model('Video', videoSchema);
