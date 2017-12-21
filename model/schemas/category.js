const Mongoose = require('mongoose');

var categorySchema = Mongoose.Schema({
    name: String,
    code: String
});

module.exports = categorySchema;
