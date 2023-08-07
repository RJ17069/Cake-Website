const mongoose = require('mongoose');

//product schema
var signupSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    slug: {
        type: String,
    },
    password: {
        type: String,
        require: true
    },
    confirmPassword: {
        type: String,
        require: true
    },
    admin: {
        type: Number
    }
});

var signup = module.exports = mongoose.model('signup', signupSchema);