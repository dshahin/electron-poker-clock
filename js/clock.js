var toastr = require('toastr');
var moment = require('moment');
var $ = require('jquery');

module.exports = {
        minutes : 10,
        duration : moment.duration(10, 'm'),
        round : 0,
        currentRound : {},
        interval : undefined,
        paused : true,
        togglePause: function(){
            var clock = this;
            clock.paused = !this.paused;
            if(clock.paused){
                clock.say('clock paused');
            }else{
                clock.say('clock started');
            }

        },
        pause :function(){
            this.paused = true;
        },
        unpause :function(){
            this.paused = false;
        },
        loadRound : function(roundIndex){
            var clock = this;
            this.currentRound = clock.rounds[clock.round];
            $('.clock span.hours').html(zeroPad(clock.duration.hours()));
            $('.clock span.minutes').html(zeroPad(clock.duration.minutes()));
            $('.clock span.seconds').html(zeroPad(clock.duration.seconds()));
        },
        init : function(){
            var clock = this;
            clock.loadRound(0);
            this.initialized = true;
        },
        initialized : false,
        start : function(){
            var clock = this;
            if(!clock.initialized) clock.init();
            var round = clock.currentRound;
            console.log(round);
            clock.interval = setInterval(function(){
              $('.clock span.hours').html(zeroPad(clock.duration.hours()));
              $('.clock span.minutes').html(zeroPad(clock.duration.minutes()));
              $('.clock span.seconds').html(zeroPad(clock.duration.seconds()));
              if(clock.paused === false){
                  clock.duration.subtract(1,'s');
                  //clock.seconds -= 1;

                  if(clock.duration.asSeconds() === 0){
                    toastr.success(`${clock.duration.seconds()} seconds`);
                  }
              }

            },1000);
        },
        say : function(text){
            var utter = new SpeechSynthesisUtterance();
            utter.text = text;
            utter.onend = function(event) {
                console.log('Speech complete');
            };
            speechSynthesis.speak(utter);
        },
        rounds : [
          {minutes: 10, little: 25, big : 50, ante : 0}
        ]

};

function zeroPad(segment){
    if(segment < 10){
      segment = '0' + segment;
    }
    return segment;
}
