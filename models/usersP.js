const mongoose = require('mongoose');

var UserpSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    name: { type: String },
    password: {
        type: String,
        minlength: 8
    }
});

const Userp = mongoose.model("userss", UserpSchema);
module.exports = Userp;