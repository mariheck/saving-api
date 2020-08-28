const mongoose = require('mongoose');

//======================================================
// PHOTOS DB MODEL
//======================================================

const photoSchema = new mongoose.Schema({
    src: String,
    collections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PhotoCollection'
        }
    ]
});

module.exports = mongoose.model('Photo', photoSchema);
