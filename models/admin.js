const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//======================================================
// ADMIN DB MODEL
//======================================================

const adminSchema = new mongoose.Schema({
    username: String
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', adminSchema);
