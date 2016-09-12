var toastr = require('toastr');
var moment = require('moment');
var $ = require('jquery');

module.exports = {
        minutes : 10,
        duration : moment.duration(10, 'm'),
        round : 0,
        interval : undefined,
        paused : false,
        togglePause: function(){
            var clock = this;
            clock.paused = !this.paused;
            clock.say('paused or something');

        },
        pause :function(){
            this.paused = true;
        },
        unpause :function(){
            this.paused = false;
        },
        start : function(){
            var clock = this;
            // if(!clock.duration){
            //   clock.duration = moment.duration(clock.seconds, 'm');
            // }
            clock.interval = setInterval(function(){
                if(clock.paused === false){
                    clock.duration.subtract(1,'s');
                    //clock.seconds -= 1;
                    $('span.hours').html(zeroPad(clock.duration.hours()));
                    $('span.minutes').html(zeroPad(clock.duration.minutes()));
                    $('span.seconds').html(zeroPad(clock.duration.seconds()));
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
