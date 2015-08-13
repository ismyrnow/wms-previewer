var express = require('express');
var request = require('request');

var port = process.env.PORT || 3000;
var app = express();

app.use(express.static('public'));

app.use('/proxy', function(req, res) {
  var url = req.url.substring(1);
  req.pipe(request(url)).pipe(res);
});

app.listen(port);
console.log('Serving application on port ' + port);
