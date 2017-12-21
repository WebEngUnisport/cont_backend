const Mongoose = require('mongoose');

var universitySchema = Mongoose.Schema({
    name: String,
    code: String
});

module.exports = universitySchema;
