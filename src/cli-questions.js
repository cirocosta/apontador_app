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
var answers;

function getResponseFromUser () {
  var response = {};

  console.log('');

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

module.exports = answers;
