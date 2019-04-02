const mongoose = require("mongoose");

const image_schema = new mongoose.Schema({
    image_url: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [
        {
            liker: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            like_type: {
                type: String,
                enum: ["normal", "super"]
            }
        }
    ]
});

module.exports = mongoose.model('Image', image_schema, "images");