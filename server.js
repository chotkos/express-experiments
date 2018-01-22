console.log('Starting server...')
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use("/front", express.static(__dirname + "/front/"));
app.use(bodyParser.urlencoded({
    extended: true
}))
var db = null;
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://chotkos:1607Mati@ds117935.mlab.com:17935/express', (err, database) => {
    if (err) return console.log(err)
    db = database.db('express');
    app.listen(3002, () => {
        console.log('listening on 3002') 

    })
})

app.listen(3001, function () {
    console.log('listening on 3001')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/front/index.html')
})


var move = function (x, y, guid) {
    console.log(move, x, y, guid);
    var oldState = null;
    db.collection('players').findOne({
        'myId': guid
    }, function (err, result) {
        oldState = result;
        console.log('oldstate', oldState);
        var oldX = parseInt(oldState.positionX);
        var oldY = parseInt(oldState.positionY);
        db.collection('players').update({
            'myId': guid
        }, {
            $set: {
                positionX: oldX + x,
                positionY: oldY + y
            }
        });
    });
};


app.post('/register', (req, res) => {
    console.log('registered user');
    db.collection('players').save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('registered to database')
        res.jsonp({
            result: 'ok'
        });
    })
})

app.post('/right', (req, res) => {
    move(5, 0, req.body.id);
    res.jsonp({
        result: 'ok'
    });
})

app.post('/left', (req, res) => {
    move(-5, 0, req.body.id);
    res.jsonp({
        result: 'ok'
    });
})

app.post('/top', (req, res) => {
    move(0, -5, req.body.id);
    res.jsonp({
        result: 'ok'
    });
})

app.post('/bottom', (req, res) => {
    move(0, 5, req.body.id);
    res.jsonp({
        result: 'ok'
    });
})

app.get('/map', (req, res) => {
    var cursor = db.collection('players').find();
    var t = [];
    cursor.each(function (err, item) {
        if (item != null) {
            t.push(item);            
        } else {
            console.log('sending',t);
            res.jsonp(t);
        }
    }); 
});