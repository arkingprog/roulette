let Game = require('./Game');
module.exports = function (io) {
    let game = new Game(io.sockets);
    game.setMaxListeners(0);

    io.on('connection', function (socket) {
        let currentPlayer = {};
        socket.emit('newUser', {time: game.getTime(), lastWin: game.lastWin})

        socket.on('newBet', (data)=> {
            currentPlayer = data;
        })
        game.on('newGame', () => {
            socket.emit('newGame', {newGame: true, lastWin: game.lastWin});
        })
        game.on('startRaffle', ()=> {
            socket.emit('startRaffle', {startRaffle: 'startRaffle'})
        })
        game.on('resultRaffle', (win)=> {
            let winColor = game.arrayRange[win];
            if (Object.keys(currentPlayer).length == 0) {
                console.log(Object.keys(currentPlayer).length,'no');
                socket.emit('resultRaffle', {win: winColor})
            } else {
                let playerWin = 1;
                // console.log(currentPlayer,'yse');
                if (currentPlayer.betColor == winColor) {
                    switch (winColor) {
                        case 'red':
                        case 'black':
                            playerWin = currentPlayer.betPrice * 2;
                            break;
                        case 'green':
                            playerWin = currentPlayer.betPrice * 14;
                            break;
                    }
                } else {
                    playerWin = -currentPlayer.betPrice;
                }
                console.log(currentPlayer.betColor);
                socket.emit('resultRaffle', {win: game.arrayRange[win], playerWin: playerWin,playerBet:currentPlayer.betColor})
                currentPlayer = {};
            }

        })

        socket.on('disconnect', function (data) {
        });

    });
}
