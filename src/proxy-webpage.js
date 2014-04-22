/**
* Utils for generating the stuff to be appended to the last part of the
* page.
*/
'use strict';

var request = require('request');
var url = require('url');
var path = require('path');

var _genSocketScript = function (serverUri) {
  var script =
    '<script src="http://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js"></script>' +
    '<script>' +
      "var socket = io.connect('" + serverUri + "');" +
      "socket.on('code', function (data) {" +
        "eval(data);" +
      "});" +

      "socket.on('reload', function (data) {" +
        "window.location.reload();" +
      "})" +
    '</script>';

  return script;
};

var _genCssAndJsScript = function (jsFile, cssFile) {
  var script =
    "var d=document;var s;" +
    "var h = d.getElementsByTagName('head')[0];";

    if (jsFile) {
      script +=
        "s = d.createElement('script');" +
        "s.type='text/javascript';" +
        "s.async=true;" +
        "s.src='" + jsFile + "';" +
        "h.appendChild(s);";
    }

    if (cssFile) {
      script +=
        "s = d.createElement('link');" +
        "s.href = '" + cssFile + "';" +
        "s.rel = 'stylesheet';" +
        "s.type = 'text/css';" +
        "h.appendChild(s);";
    }

    return script;
}

var _genLoadScript = function (jsFile, cssFile, socketIoUri) {

  var onLoadEventScript = "<script>window.onload = function () {" +
    _genCssAndJsScript(jsFile, cssFile) + "};</script>";

  return socketIoUri
    ? onLoadEventScript + _genSocketScript(socketIoUri)
    : onLoadEventScript;
};

/**
 * Connect middleware for proxying a webpage based on a config object.
 */
module.exports = function (answers) {

  var fun = function (req, res, next) {

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
              _genLoadScript(jsDir, cssDir,
                                    'http://localhost:' + answers.port));
        } else {
          res.end(body +
              _genLoadScript(answers.files.js,
                                    answers.files.css));
        }
      }
    });
  };

  return fun;

};
