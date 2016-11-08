$(window).on('load', function() {
    var arrayRange = ['green', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'black', 'black', 'black', 'black', 'black', 'black', 'black'];


    var user = getUserFromLocalStorage();
    $('.balance').text(user.balance);

    var time = 0;
    var timeText = $('.time');
    // updateUserInLocalStorage(user);
    var socket = io.connect('http://localhost:3000');

    socket.on('newUser', function(data) {
        console.log(data);
        setTime(data);
    });

    socket.on('newGame', function(data) {
        setTime({
            time: 30
        })
    });
    socket.on('sendLastResult', function(data) {
        console.log(data);
        $('.lastResult').empty();
        data.forEach(function(i) {
            var innerText='<span style="color:'+ arrayRange[i] +'"> ' + i + ' </span>'
            $('.lastResult').append(innerText);
        })
    })

    socket.on('resultRaffle', function(data) {
        console.log(data);
        if (data.playerWin) {
            $('#win').text(data.playerWin);
            user.balance += data.playerWin;
            $('.balance').text(user.balance);
            updateUserInLocalStorage(user);
        }
    });

    socket.on('startRaffle', function(data) {
        console.log(data);
    });

    $('#btnPlay').on('click', function() {
        socket.emit('newBet', {
            betPrice: $("#betPrice").val(),
            betColor: $("input:radio:checked").val(),
            user: user
        })
    })

    socket.on('user:win', function(data) {
        console.log(data);
    })

    function getUserFromLocalStorage() {
        var user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            return user;
        } else {
            user = {
                balance: 1000,
                username: 'anonim',
                id: Date.now()
            };
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
    }

    function updateUserInLocalStorage(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    function setTime(data) {
        time = data.time;
        $(timeText).text(--time);
        var timer = setInterval(function() {
            $(timeText).text(--time);
            if (time === 0) {
                $(timeText).text('Идет розыгрыш');
                clearInterval(timer);
            }
        }, 1000)
    }
})
