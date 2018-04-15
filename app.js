'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socketUsers = require('socket.io.users');
socketUsers.Session(app);

/*  User handling   */
var users = [];

function getUser(id) {
    return users.find(x => x.id === id);
}

app.use(express.static(__dirname + '/'));
io.use(socketUsers.Middleware());

app.get('/', function(req, res) {
   res.sendFile('./pages/screen.html', {root: __dirname});
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
    console.log('User ' + socket.id + ' connected');
    users.push({
        id: socket.id,
        x: 0,
        y: 0
    });

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        var userNum = users.indexOf(getUser(socket.id));
        users.splice(userNum, 1);
        console.log(userNum);
        console.log('User ' + socket.id + ' disconnected');
        console.log(users);
        socket.broadcast.emit('broadcast', users);
    });

    socket.on('message', (msg) => {
        console.log(msg);
        console.log(socket.id);
        var user = getUser(socket.id);
        user.x = msg.x;
        user.y = msg.y;
        socket.broadcast.emit('broadcast', users);
        socket.emit('broadcast', users);
    });
});

http.listen(3000, function() {
   console.log('listening on port 3000');
});