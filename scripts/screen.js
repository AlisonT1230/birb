'use strict';

const speed = 5;

$(document).ready(() => {

    /*  Connection to server    */

    var socket = io();

    socket.on('connect', () => {
        console.log("Connected to server.");

        /*  Canvas  */
        var canvas = document.getElementById('screen');
        var ctx = canvas.getContext('2d');

        /*  Player logic    */
        var users = [];
        var player = {
            x: 0,
            y: 0
        };
        var keyState = {};

        window.addEventListener('keydown', (e) => {
            keyState[e.keyCode || e.which] = true;
        },true);

        window.addEventListener('keyup', (e) => {
            keyState[e.keyCode || e.which] = false;
        },true);

        function update() {
            var updated = false;
            if(keyState[37] && player.x > 0) {
                player.x -= speed;
                updated = true;
            } else if(keyState[39] && player.x < ctx.canvas.width) {
                player.x += speed;
                updated = true;
            }
            if(keyState[38] && player.y > 0) {
                player.y -= speed;
                updated = true;
            } else if(keyState[40] && player.y < ctx.canvas.height) {
                player.y += speed;
                updated = true;
            }
            if(updated) {
                drawPlayers();
                socket.emit('message', {x: player.x, y: player.y});
            }
            setTimeout(update, 10);
        }

        function clear() {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        function drawPlayers() {
            clear();
            for (var u in users) {
                ctx.fillStyle = 'black';
                ctx.fillRect(users[u].x, users[u].y, 10, 10);
            }
            ctx.fillRect(player.x, player.y, 10, 10);
        }

        ctx.canvas.width = $(window).width();
        ctx.canvas.height = $(window).height();

        socket.on('broadcast', (msg) => {
            users = msg;
            drawPlayers();
        });

        update();
    });
});
