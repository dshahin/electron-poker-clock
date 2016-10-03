// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
var sql = require('sql.js');
var fs = require('fs');
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
var filebuffer = fs.readFileSync('test.sqlite');

var db = new sql.Database(filebuffer);
// Execute some sql
sqlstr = "CREATE TABLE hello (a int, b char);";
sqlstr += "INSERT INTO hello VALUES (0, 'hello');"
sqlstr += "INSERT INTO hello VALUES (1, 'world');"
db.run(sqlstr); // Run the query without returning anything

var res = db.exec("SELECT * FROM hello");
console.log(res);
var data = db.export();
var buffer = new Buffer(data);
fs.writeFileSync("test.sqlite", buffer);
