const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World! From backend')
})

app.listen(10080, function () {
  console.log('Example app listening on port 8080!')
})
