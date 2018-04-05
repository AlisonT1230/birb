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
            draw();
            socket.emit('message', {x: player.x, y: player.y});
        });

        function draw() {
            ctx.fillRect(player.x, player.y, 10, 10);
        }

        draw();
        ctx.canvas.width = $(window).width();
        ctx.canvas.height = $(window).height();

        socket.on('broadcast', (msg) => {
            ctx.fillRect(msg.x, msg.y, 10, 10);
        });
    });
});
