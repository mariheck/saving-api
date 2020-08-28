const mongoose = require('mongoose');

//======================================================
// PHOTOS COLLECTIONS DB MODEL
//======================================================

const photoCollectionSchema = new mongoose.Schema({
    name: String,
    tag: String,
    photos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Photo'
        }
    ]
});

module.exports = mongoose.model('PhotoCollection', photoCollectionSchema);
