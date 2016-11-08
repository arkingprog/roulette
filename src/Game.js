const EventEmitter = require('events').EventEmitter;

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

class Game extends EventEmitter {
    constructor(socket) {
        super();
        this.socket = socket;
        this.time = 30;
        this.lastWin = 0;
        this.lastWins = [];
        this.players = [];
        this.arrayRange = ['green', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'black', 'black', 'black', 'black', 'black', 'black', 'black'];
        this.mainLoop();


    }

    sendLastResult() {
        this.socket.emit('sendLastResult', this.lastWins.slice(Math.max(this.lastWins.length - 5, 1)));
    }

    mainLoop() {
        let _this = this;
        this.emit('game:newGame');
        let mainInterval = setInterval(function() {
            --_this.time;
            if (_this.time === 0) {
                _this.time = 30;
                _this.emit('game:startRaffle');

                setTimeout(function() { // raffle
                    let win = _this.raffle();
                    _this.lastWins.push(win);
                    _this.emit('game:resultRaffle', win);
                    _this.mainLoop();
                }.bind(_this), 8 * 1000);

                clearInterval(mainInterval);
            }
        }, 1 * 1000)
    }

    getTime() {
        return this.time;
    }

    raffle() {
        return randomInteger(0, 14);
    }
}

module.exports = Game;
