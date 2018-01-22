function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

var port = 39832;//process.env.PORT || 3001
var moves = {};
moves[37] = 'left';
moves[39] = 'right';
moves[38] = 'top';
moves[40] = 'bottom';

$(document).ready(function () {
    var player = {
        myId: guid(),
        positionX: 0,
        positionY: 0
    }

    //var backendUrl = 'https://promisekokos.localtunnel.me';//'http://localhost:3001'
    var backendUrl = 'http://glacial-mesa-83495.herokuapp.com:'+port;

    $.ajax({
        type: "POST",
        url: backendUrl + '/register',
        data: player,
        dataType:'jsonp',
        success: function () {
            setInterval(function () {
                $.ajax({
                    type: "GET",
                    url: backendUrl + '/map',
                    data: null,
                    success: function (a) {
                        document.app.players = a;
                    },
                    dataType:'jsonp' 
                });
            }, 100);

        }
    });


    document.body.onkeydown = function (e) {
        //alert(String.fromCharCode(e.keyCode) + " --> " + e.keyCode);
        var selectedMove = moves[e.keyCode];
        if (selectedMove) {
            $.ajax({
                type: "POST",
                url: backendUrl + '/' + selectedMove,
                data: {
                    id: player.myId
                },
                success: function () {},
                dataType:'jsonp' 
            });
        }

    };
});