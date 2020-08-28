const mongoose = require('mongoose');

//======================================================
// VIDEOS COLLECTIONS DB MODEL
//======================================================

const videoCollectionSchema = new mongoose.Schema({
    name: String,
    tag: String,
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]
});

module.exports = mongoose.model('VideoCollection', videoCollectionSchema);
