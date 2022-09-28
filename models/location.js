const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    place: { type: String, required: true, trim: true }
}, {
    timestamps: true
});

const Location = mongoose.model('locations', LocationSchema);

module.exports = Location;