// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const {ipcMain} = require('electron');

require('electron').ipcRenderer.on('toggle', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.returnValue = 'pong'
  clock.togglePause();
});



var clock = require ('./js/clock.js');

var $ = require('jquery');

var Handlebars = require('handlebars');

var source   = $("#entry-template").html();
var template = Handlebars.compile(source);
var context = {rounds:clock.rounds};
console.log(context);
var html    = template(context);
$('div.rounds').html(html);

$('div.clock').click(function(){
    clock.togglePause();
});
clock.start();
