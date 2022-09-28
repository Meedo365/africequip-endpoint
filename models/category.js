const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true }
}, {
    timestamps: true
});

const Category = mongoose.model('categories', CategorySchema);

module.exports = Category;