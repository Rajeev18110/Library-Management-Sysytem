const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String, default: null } // optional cover image URL
});

module.exports = mongoose.model('Book', bookSchema);
