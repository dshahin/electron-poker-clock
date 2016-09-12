// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var clock = require ('./js/clock.js');

var $ = require('jquery');

$('body').click(function(){
    clock.togglePause();
});
clock.start();
