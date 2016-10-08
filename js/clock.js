var toastr = require('toastr');
var moment = require('moment');
var $ = require('jquery');
var speech = window.speechSynthesis;

module.exports = {
    minutes: 10,
    duration: moment.duration(0, 'm'),
    round: 0,
    currentRound: {},
    interval: undefined,
    warningAt: 3,
    warningColor: 'red',
    paused: true,
    fx :{
        alert: new Audio("audio/alert.wav"),
        warning : new Audio("audio/flint.wav")
    },
    togglePause: function() {
        var clock = this;

        clock.paused = !this.paused;
        if (clock.paused) {
            clock.say('clock paused', true);
        } else {
            clock.say('clock started', true);
        }

    },
    pause: function() {
        this.paused = true;

    },
    unpause: function() {
        this.paused = false;
    },
    loadRound: function(roundIndex) {
        var clock = this;
        clock.round = roundIndex;
        clock.currentRound = clock.rounds[roundIndex];

        var nextRound = clock.rounds[clock.round] || {
            break: true
        };
        var round = clock.currentRound;
        console.log(`loading round ${clock.round}`, round);
        clock.say(
            `round ${clock.round + 1}.
                This is a ${clock.currentRound.minutes} minute round.
                Small blind is ${clock.currentRound.little} dollars,
                Big Blind is ${clock.currentRound.big} dollars.
                `, true);

        if (clock.currentRound.ante) {
            clock.say(`There is a ${clock.currentRound.ante} dollar ante.`)
        }
        clock.duration = moment.duration(0);

        clock.duration.add(clock.rounds[clock.round].minutes, 'm');
        $('.clock span.hours').html(zeroPad(clock.duration.hours()));
        $('.clock span.minutes').html(zeroPad(clock.duration.minutes()));
        $('.clock span.seconds').html(zeroPad(clock.duration.seconds()));

        $('span.little').html(round.little);
        $('span.big').html(round.big);
        var $ante  = $('span.ante');
        $ante.html(round.ante);
        if(round.ante){
            $ante.show();
            $('.anteLabel').show();
        }else{
            $ante.hide();
            $('.anteLabel').hide();
        }
    },
    loadStructure : function(structureIndex){
        var clock = this;
        clock.selectedStructure = structureIndex;
        var structure = clock.structures[clock.selectedStructure];
        clock.rounds = structure.rounds;
    },
    init: function() {
        var clock = this;
        clock.loadStructure(0);
        clock.loadRound(0);
        clock.say('click anywhere to start the clock');
        this.initialized = true;
    },
    initialized: false,
    start: function() {
        var clock = this;
        if (!clock.initialized) clock.init();
        var round = clock.currentRound;
        //console.log(round);
        clock.interval = setInterval(function() {
            clock.tick();

        }, 1000);
    },
    tick: function() {
        var clock = this;
        $('.clock span.hours').html(zeroPad(clock.duration.hours()));
        $('.clock span.minutes').html(zeroPad(clock.duration.minutes()));
        $('.clock span.seconds').html(zeroPad(clock.duration.seconds()));
        if (clock.paused === false && clock.duration.asSeconds() > 0) {
            clock.duration.subtract(1, 's');
            if (clock.duration.asSeconds() === 0) {
                clock.fx.alert.play();
                toastr.success(`End of this round`);
                clock.say('End of this round');
                clock.nextRound();
            } else if (clock.duration.asSeconds() === clock.warningAt) {
                clock.fx.warning.play();
                clock.say(`${clock.warningAt} second warning`);
            }
        }
    },
    nextRound: function() {

        var clock = this;
        if (clock.rounds[clock.round + 1] !== undefined) {
            clock.round++;
            clock.loadRound(clock.round);
        } else {
            clock.pause();
            clock.say(`there are no more rounds.  this is round ${clock.round}`, true);
        }
    },
    prevRound: function() {
        var clock = this;
        if (clock.round - 1 >= 0) {
            clock.round--;
            clock.loadRound(clock.round);
        } else {
            clock.pause();
            clock.say(`there are no previous rounds. this is round ${clock.round}`, true);
        }
    },
    say: function(text, cancel) {
        var utter = new SpeechSynthesisUtterance();
        utter.text = text;
        utter.onend = function(event) {
            console.log('Speech complete');
        };
        //stop speaking previous utterance
        if (cancel) speech.cancel();
        speechSynthesis.speak(utter);

    },
    rounds: [],
    selectedStructure : 0,
    structures: [{
        name: 'Default Structure',
        rounds: [{
            minutes: .15,
            little: 25,
            big: 50,
            ante: 0
        }, {
            minutes: 2,
            little: 50,
            big: 100,
            ante: 25
        }, {
            minutes: 3,
            little: 100,
            big: 200,
            ante: 0
        }]
    }]

};

function zeroPad(segment) {
    if (segment < 10) {
        segment = '0' + segment;
    }
    return segment;
}
