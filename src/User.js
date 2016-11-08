const EventEmitter = require('events').EventEmitter;

class User extends EventEmitter {
    constructor(user, socket) {
        super();

        this.betPrice = user.betPrice;
        this.betColor = user.betColor;
        Object.assign(this, user.user);
        this.playerWin = 0;


        this.on('user:win', () => {
            socket.emit('user:win',this)
        })

    }
    playerWin(){
        return this.playerWin;
    }
}
module.exports = User;
