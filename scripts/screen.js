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
        var users = [];

        /*  Player logic    */
        var player = {
            x: 0,
            y: 0
        };

        $(document).on('keypress', (e) => {
            switch (e.which) {
            case 119:    // up
                player.y -= speed;
                break;
            case 115:    // down
                player.y += speed;
                break;
            case 97:    // left
                player.x -= speed;
                break;
            case 100:    // right
                player.x += speed;
                break;
            default:
                return;
            }
            e.preventDefault();
            drawPlayers();
            socket.emit('message', {x: player.x, y: player.y});
        });

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
    });
});
