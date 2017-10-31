var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	content: String
});

module.exports = mongoose.model('Message', MessageSchema)