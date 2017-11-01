const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://mongodb/datatest');

var port = process.env.PORT || 10080;

var router = express.Router();


var Message = require('./models/messages');


app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

router.get('/', function (req, res) {
	res.json({message: 'Hello from the backend API'});
});

router.route('/messages')
	.post(function(req,res){
		var message = new Message();
		message.content = req.body.content;
		
		message.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({message: 'New post content!'});
		});
	})
	.get(function(req, res){
		Message.find(function(err, messages){
			if(err){
				res.send(err);
			}
			res.json(messages)
		});
	});

app.use('/api', router);

app.get('/', function (req, res) {
  res.send('Hello World! From backend');
});

app.listen(port, function () {
  console.log('Example app listening on port'+port+'!')
});
