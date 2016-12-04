// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
const storage = require('electron-json-storage');
const toastr = require('toastr');
require('./js/toastrDefaults');
const defaults = require('./js/defaults');
const structures = require('./js/structures');
var clock = require ('./js/clock.js');

var $ = require('jquery');
var Handlebars = require('handlebars');


defaults.getDefaults().then((data)=>{
    if(!data.background){
        return defaults.setDefaults().then((newDefs)=>{
            toastr.error('loading defaults');
        });
    }
    return data;

}).then((data)=>{
    defaults.getDefaults().then((data)=>{
        $('body').css({'background-color' : data.background});
    });
}).catch((error)=>{
    toastr.error(error);
});

structures.setup()
  .then((structures)=> {
    var source   = $("#entry-template").html();
    var template = Handlebars.compile(source);

    console.log(context);
      console.log('structures',structures);
      clock.structures = structures;
      var context = {rounds:clock.structures[0].rounds};
      var html    = template(context);
      $('div.rounds').html(html);
      clock.init();
      clock.start();
      setCurrentRound(clock.round);
  })
  .catch((err)=> toastr.error(err));



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
  setCurrentRound(clock.round);
});

require('electron').ipcRenderer.on('prev', () => {
  clock.prevRound();
  setCurrentRound(clock.round);
});

$(document).ready(function(){
    // $('body').on('structure-loaded',()=>{
    //     toastr.info('got structure-loaded');
    // });
    $('body').on('end-of-round',()=>{
        toastr.info('The round is over');
    });

    $('.time').click(function(){
        clock.togglePause();
        var $timer = $(this);
        bounceClock();
    });

    $('body').on('click','tr.index',function(){
        var index = $(this).data('index');
        clock.loadRound(index);
        setCurrentRound(index);
    });

    $('div.next').click(()=> {
        clock.nextRound();
        setCurrentRound(clock.round);
    });
    $('div.prev').click(()=> {
        clock.prevRound();
        setCurrentRound(clock.round);
    });


    $('body').on('change','#muted',function(){

        clock.toggleMute();
        if(!clock.muted){
          clock.say("unmuted");
          toastr.success("Unmuted");
        }else{
          toastr.warning("Muted");
        }

    });

    $('body').on('click','span.clearAllData',()=>{
        defaults.clearAllData().then(()=> {
            toastr.success('cleared all data');
            $('body').css({'background-color' : 'pink'});
        });
    });

    $('body').on('change','#structure',()=>{
        var elem = $(this);
        alert(elem.val());
        toastr.success(`value: ${elem.val()}`);
    });
});

function setCurrentRound(index){
    $('tr.index').removeClass('selected');
    $(`tr.index-${index}`).addClass('selected');
}

function bounceClock(){
    var $timer = $('.time');
    $timer.addClass('animated rubberBand')
    .one('animationend', ()=>{
         $timer.removeClass('animated rubberBand');
     });
}
