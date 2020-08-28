const mongoose = require('mongoose');

//======================================================
// ADMIN DB MODEL
//======================================================

const adminSchema = new mongoose.Schema({
    pseudo: String,
    password: String
});

module.exports = mongoose.model('Admin', adminSchema);
