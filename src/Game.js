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

    mainLoop() {
        let _this = this;
        this.emit('newGame');
        let mainInterval = setInterval(function() {
            --_this.time;
            if (_this.time === 0) {
                _this.time = 30;
                _this.emit('startRaffle');
                setTimeout(function() { // raffle
                    let win = _this.raffle();
                    _this.emit('resultRaffle', win);
                    // _this.lastWins.push(win);
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
