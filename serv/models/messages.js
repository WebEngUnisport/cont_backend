var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	contant: String
});

module.exports = mongoose.model('Message', MessageSchema)