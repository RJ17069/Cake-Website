const mongoose = require('mongoose');

//product schema
var categorySchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
    },
});

var category = module.exports = mongoose.model('category', categorySchema);