let Game = require('./Game');
let User = require('./User');
module.exports = function(io) {

    let game = new Game(io.sockets);
    game.setMaxListeners(0);

    io.on('connection', function(socket) {

        let currentPlayer = {};

        socket.emit('newUser', {
            time: game.getTime(),
            lastWin: game.lastWin
        })

        socket.on('newBet', (data) => {
            currentPlayer = new User(data, socket);
        })

        game.on('game:newGame', () => {
            socket.emit('newGame', {
                newGame: true,
                lastWin: game.lastWin
            });
        })

        game.on('game:startRaffle', () => {
            socket.emit('startRaffle', {
                startRaffle: 'startRaffle'
            })
        })

        game.on('game:resultRaffle', (win) => {
            let winColor = game.arrayRange[win];
            if (Object.keys(currentPlayer).length == 0) {
                socket.emit('resultRaffle', {
                    win: winColor
                })
            } else {
                currentPlayer.playerWin = 1;
                if (currentPlayer.betColor == winColor) {
                    switch (winColor) {
                        case 'red':
                        case 'black':
                            currentPlayer.playerWin = currentPlayer.betPrice * 2;
                            break;
                        case 'green':
                            currentPlayer.playerWin = currentPlayer.betPrice * 14;
                            break;
                    }
                } else {
                    currentPlayer.playerWin = -currentPlayer.betPrice;
                }
                socket.emit('resultRaffle', {
                    win: game.arrayRange[win],
                    playerWin: currentPlayer.playerWin,
                    playerBet: currentPlayer.betColor
                })
                currentPlayer.emit('user:win')
                currentPlayer = {};
            }
        })

        socket.on('disconnect', function(data) {

        });
    });
}
