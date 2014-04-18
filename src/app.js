#!/usr/bin/env node

'use strict';
/**
 * Serves static pages with the app/css from the localapps.
 * It takes a few cli arguments to configure it well.
 */

var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
var express = require('express');
var request = require('request');
var myUtils = require('./util');

var cliAnswers;
var app = express(),
  server,
  io = null,
  answers = {},
  args = process.argv.slice(2);

/**
 * Configures server settings based on cli args.
 */
if (args.length) {
  args.forEach(function (arg) {
    var thisArg = arg.split('=');
    var flag = thisArg[0];

    answers.files = {};

    switch (flag) {
    case '--webpage':
      var webpage = thisArg[1];
      answers.webpage = webpage;

      if (webpage.protocol !== 'http:' || webpage.protocol !== 'https:') {
        answers.webpage = 'http://' + answers.webpage;
      }
      break;

    case '--dir':
      answers.dir = path.resolve(thisArg[1]);
      break;

    case '--watch':
      answers.watch = true;
      break;

    case '--jsfile':
      answers.files.js = thisArg[1];
      break;

    case '--cssfile':
      answers.files.css = thisArg[1];
      break;

    default:
      console.log("Invalid arg.");
      process.exit(1);
    }
  });
} else {
  answers = require('./cli-questions');
}

/**
 * Express specific stuff
 */
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.compress());

/**
 * Proxying logic. If it takes .css or .js files, don't do a thing, just
 * stop and send the request to the next middleware - which knows how to
 * deal greatly with them, otherwise, let the magic happen!
 */
app.use(function (req, res, next) {

  var requestUrl = req.url;
  var pl = url.parse(requestUrl).path.split('/');
  var fileServed = pl[pl.length - 1];

  if (fileServed.match(/\.js/) || fileServed.match(/\.css/)) {
    next();
    return;
  }

  request(url.resolve(answers.webpage, requestUrl), function (err, resp, body) {

    if (err || resp.statusCode !== 200) {
      next(err);
    } else {

      var jsDir = answers.files.js
          ? path.join(answers.dir, answers.files.js)
          : null;
      var cssDir = answers.files.css
          ? path.join(answers.dir, answers.files.css)
          : null;

      if (answers.watch) {
        res.end(body +
            myUtils.genLoadScript(jsDir, cssDir,
                                  'http://localhost:' + app.get('port')));
      } else {
        res.end(body +
            myUtils.genLoadScript(answers.files.js,
                                  answers.files.css));
      }
    }
  });
});

if (answers.dir) {
  app.use(answers.dir, express.static(answers.dir));
}

// Server Initialization

server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});


/**
 * Socket.io stuff
 */

if (answers.watch) {
  io = require('socket.io').listen(server);
  io.sockets.on('connection', socketsConnectionHandler);
}

/**
 * Handles the connection of a socket into the sockets.io server.
 */
function socketsConnectionHandler (socket) {
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
