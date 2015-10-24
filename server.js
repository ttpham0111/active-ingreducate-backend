'use strict';

var express    = require('express');

// Use middleware
var app = express();

var SERVER_ADDRESS = process.env.SERVER_ADDRESS || 'localhost';
var SERVER_PORT = process.env.SERVER_PORT || 9000;

// Routing
require('./routes/imageParser')(app);

// Handle 404 Error
app.use(function(req, res, next)
{
  res.send('Not Found');
});


var server = app.listen(SERVER_PORT, SERVER_ADDRESS, function () 
{
  var host = server.address().address;
  var port = server.address().port;
});
