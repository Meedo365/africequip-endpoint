const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    price: { type: String, default: 'Contact Us' },
    images: {
        type: Array,
        default: ['/uploads//325picture.jpg']
    },
    brand: { type: String, default: 'Other' },
    transmission: { type: String },
    condition: {
        type: String,
        enum: ["New", "Used"]
    },
    year: { type: String },
    model: { type: String },
    view: { type: Number, default: 0 },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    location_id: {
        type: mongoose.Types.ObjectId,
        ref: "locations"
    },
    subCategory_id: {
        type: mongoose.Types.ObjectId,
        ref: "sub-categories"
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: "categories"
    }
}, {
    timestamps: true
});

const Product = mongoose.model('products', ProductSchema);

module.exports = Product

