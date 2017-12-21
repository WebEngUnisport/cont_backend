const Mongoose = require('mongoose');

var init = function () {
    Mongoose.model('Course', require('./schemas/course'));
    Mongoose.model('Category', require('./schemas/category'));
    Mongoose.model('University', require('./schemas/university'));
};

module.exports = init();