const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, minlength: 8, trim: true, required: true },
    image: { type: String, default: 'https://africequip.com/images/user.jpg' },
    phone: { type: String, minlength: 10, maxlength: 11 },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

const User = mongoose.model('users', UserSchema);

module.exports = User;