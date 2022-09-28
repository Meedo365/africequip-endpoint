const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    category_id: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: "categories"
    },
}, {
    timestamps: true
})

const SubCategory = mongoose.model('sub-categories', SubCategorySchema);

module.exports = SubCategory;