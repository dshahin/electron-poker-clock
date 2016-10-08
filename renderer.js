// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
const storage = require('electron-json-storage');

storage.get('foobar', (error, data) => {
  if (error) throw error;
  $('body').css({'background-color' : data.background});
  console.log(data);
  storage.set('foobar',{'background' : 'gray'},(error,data)=>{
      if (error) throw error;
      console.log('set background', data);
  });
});
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const {ipcMain} = require('electron');

require('electron').ipcRenderer.on('toggle', () => {
  clock.togglePause();
});

require('electron').ipcRenderer.on('next', () => {
  clock.nextRound();
});

require('electron').ipcRenderer.on('prev', () => {
  clock.prevRound();
});

var clock = require ('./js/clock.js');

var $ = require('jquery');
clock.init();
var Handlebars = require('handlebars');

var source   = $("#entry-template").html();
var template = Handlebars.compile(source);
var context = {rounds:clock.rounds};
console.log(context);
var html    = template(context);
$('div.rounds').html(html);

$('div.clock .time').click(function(){
    clock.togglePause();
    var $timer = $(this);
    $timer.addClass('animated rubberBand')
        .one('oanimationend animationend', ()=>{
             $timer.removeClass('animated rubberBand');
         });
});
$('ol.rounds li').click(function(){
    var $round = $(this),
        index = $round.data('index');
        console.log(index);
    clock.loadRound(index);
});
$('div.next').click(()=> clock.nextRound());
$('div.prev').click(()=> clock.prevRound());
clock.start();
