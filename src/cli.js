'use strict';
/**
 * Controls the CLI that will be show to the user if no args are
 * supplied.
 */

var prompt = require('sync-prompt').prompt;
var colors = require('colors');
var path = require('path');
var url = require('url');

var ok = false;
var ini = '> '.cyan;

function getResponseFromUser () {
  var response = {};

  console.log('');

  response.port = prompt(ini + "Injetador's port:[3000] ".bold);

  var port = +response.port;
  if (!port) response.port = 3000;

  response.webpage = prompt(ini + 'Target webpage: '.bold);
  var webpage = url.parse(response.webpage);

  if (webpage.protocol !== 'http:' && webpage.protocol !== 'https:') {
    response.webpage = 'http://' + response.webpage;
  }

  response.dir = prompt(ini + 'Files dir [this]: '.bold);

  if (response.dir === 'this' || !response.dir) {
    response.dir = process.cwd();
  }

  response.dir = path.resolve(response.dir);

  response.watch = prompt(ini + 'Watch files?[Y/n] '.bold).toLowerCase();

  if (!response.watch) response.watch = 'y';

  response.inject = prompt(ini + 'Inject files?[y/N] '.bold).toLowerCase();

  if (!response.inject) response.inject = 'n';

  response.files = {};

  if (response.inject === 'y') {
    response.files.js = prompt(ini + ini + 'JS File: '.bold);
    response.files.css = prompt(ini + ini + 'CSS File: '.bold);
  }

  console.log("\nInjetador".bold + " will use:");
  console.log(JSON.stringify(response, null, 2).cyan);

  return response;
}

function fromQuestions () {
  var answers = {};

  while (!ok) {
    answers = getResponseFromUser();

    var endQuestion = prompt('This seems good?[Y/n] '.bold).toLowerCase();

    if (!endQuestion) endQuestion = 'y';

    if (endQuestion === 'y') {
      ok = true;
      console.log("\n================".cyan);
      console.log("\nLet the hack begin!".rainbow + '\n');
      console.log("================".cyan + '\n');
    }
  }

  return answers;
}

function fromArgs (args) {
  var answers = {};

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

    case '--port':
      var port = +thisArg[1];

      if (!port) port = 3000;
      answers.port = port;
      break;

    default:
      console.log("Invalid argument.");
      console.log("Only --[dir|watch|jsfile|cssfile] are valid args.");
      process.exit(1);
    }
  });

  return answers;
}

module.exports = {
  fromArgs: fromArgs,
  fromQuestions: fromQuestions
};
