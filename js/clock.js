var toastr = require('toastr');

module.exports = {
        seconds : 0,
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
            clock.interval = setInterval(function(){
                if(clock.paused === false){
                    clock.seconds += 1;
                    toastr.success(`${clock.seconds} seconds`);
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
        }

};
