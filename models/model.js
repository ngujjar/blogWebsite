const mongoose = require('mongoose');

// Post Schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

// Exporting Created Schemas
exports.post = postSchema;