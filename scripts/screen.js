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
        ctx.canvas.width = $(window).width();
        ctx.canvas.height = $(window).height();

        /*  Player logic    */
        var users = [];
        var gravity = 1.15;
        var player = {
            x: 50,
            y: 10,
            r: 30,
            legHeight: 10,
            dy: 0,
            imgsrc: '../assets/images/birb.png'
        };
        var keyState = {};
        var ground = 700;
        var left = true;

        window.addEventListener('keydown', (e) => {
            keyState[e.keyCode || e.which] = true;
        },true);

        window.addEventListener('keyup', (e) => {
            keyState[e.keyCode || e.which] = false;
        },true);

        function update() {
            var updated = false;
            player.dy += gravity;

            if(player.y + player.r + player.legHeight > ground) {
                player.y = ground - player.r - player.legHeight;
                player.dy = 0;
                updated = true;
            } else if (player.y + player.r + player.legHeight < ground){
                if (player.dy == 0) {
                    player.dy = gravity;
                }
                player.y += player.dy;
                updated = true;
            }

            if(keyState[37] && player.x - player.r > 0) {
                player.x -= speed;
                updated = true;
                left = true;
            } else if(keyState[39] && player.x + player.r < ctx.canvas.width) {
                player.x += speed;
                updated = true;
                left = false;
            }
            if(keyState[38] && player.y > 0 && player.y + player.r + player.legHeight == ground) {  // up
                player.dy = -30;
                player.y += player.dy;
                updated = true;
            }
            if(updated) {
                drawPlayers();
                socket.emit('message', player);
            }
            setTimeout(update, 10);
        }

        function clear() {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        function drawPlayer(p) {
            ctx.fillStyle = '#ff9900';
            ctx.beginPath();
            ctx.moveTo(p.x - p.r/2, p.y + p.r/2);
            ctx.lineTo(p.x - p.r/2 + 1, p.y + p.r/2)
            ctx.lineTo(p.x - p.r/2 + 1, p.y + p.r + p.legHeight);
            ctx.lineTo(p.x - p.r/2, p.y + p.r + p.legHeight);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(p.x + p.r/2, p.y + p.r/2);
            ctx.lineTo(p.x + p.r/2 + 1, p.y + p.r/2);
            ctx.lineTo(p.x + p.r/2 + 1, p.y + p.r + p.legHeight);
            ctx.lineTo(p.x + p.r/2, p.y + p.r + p.legHeight);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            var img = document.createElement('img');
            img.src = p.imgsrc;
            if(!left) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(img, -p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
                ctx.restore();
            } else {
                ctx.drawImage(img, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
            }
            ctx.closePath();
            ctx.restore();
        }

        function drawPlayers() {
            clear();
            for (var u in users) {
                drawPlayer(users[u]);
            }
            drawPlayer(player);
        }

        socket.on('broadcast', (msg) => {
            users = msg;
            drawPlayers();
        });

        update();
    });
});
