const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date, required: true,
        default: Date.now,
        expires: 43200
    }
});

const Token = mongoose.model("tokens", TokenSchema);

module.exports = Token;