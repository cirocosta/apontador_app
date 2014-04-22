#!/usr/bin/env node
'use strict';

var http = require('http');
var express = require('express');
var proxyWebpage = require('./proxy-webpage');

var app = express();
var server;
var io = null;
var answers = {};
var args = process.argv.slice(2);


if (args.length) {
  answers = require('./cli').fromArgs(args);
} else {
  answers = require('./cli').fromQuestions();
}

/////////////
// Express //
/////////////

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.compress());

answers.port = app.get('port');

app.use(proxyWebpage(answers));

if (answers.dir) {
  app.use(answers.dir, express.static(answers.dir));
}

// Server Initialization

server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Injetador server is now running on port ' + app.get('port'));
});

///////////////
// socket.io //
///////////////

if (answers.watch) {
  io = require('socket.io').listen(server);
  io.set('log level', 2);
  io.sockets.on('connection', socketsConnectionHandler);
}

function socketsConnectionHandler (socket) {
  var fs = require('fs');

  if (answers.watch) {
    fs.watch(answers.dir, function (ev, filename) {
      if (ev === 'rename') {
        // do something if it was just a rename
      } else if (ev === 'change') {
        socket.emit('reload', {data: 'reload the browser'});
      }
    });
  }
};
