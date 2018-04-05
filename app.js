var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
   res.sendFile('./pages/screen.html', {root: __dirname});
});

app.get('/sayhi', (req, res) => {
    socket.broadcast.emit('HI');
    res.send('message sent');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
    console.log('A user connected');

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });

    socket.on('message', (msg) => {
        console.log(msg);
        socket.broadcast.emit('broadcast', msg);
    });
});

http.listen(3000, function() {
   console.log('listening on port 3000');
});