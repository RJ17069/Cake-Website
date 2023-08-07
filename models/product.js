const mongoose = require('mongoose');

//product schema
var productSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
    },
    categories: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    image: {
        type: String,
        require: true
    },
});

var product = module.exports = mongoose.model('product', productSchema);