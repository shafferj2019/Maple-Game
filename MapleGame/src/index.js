/*
Jett Shaffer
Maple Game
11-17-2021
*/

let canvas = document.getElementById("gameScreen");
let context = canvas.getContext('2d');

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 400;

let upTimerId
let colCheck = false;
let colliding = false;
let jumping = false;
let walkingTimerId;
let backgroundTimerId;
let score = 0;
let spawnRate = 500;

animate();

//Player controlled object
class Maple {
    constructor(gameWidth, gameHeight) {
        this.image = document.getElementById('MapleStill');

        this.width = 200;
        this.height = 100;
        this.maxSpeed = 3;
        this.speed = 0;
        this.up = 0;
        this.frontOfMaple = 50;

        this.position = {

            x: 50,

            y: gameHeight - this.height - 9,
        }
    }

    //Display object at current position
    draw(context) {
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    //Update positional values
    update(deltaTime) {
        if(!deltaTime) return;

        this.position.x += this.speed;

        this.frontOfMaple = this.position.x + 200;
        this.bottomOfMaple = this.position.y;

        if(this.position.x < 0) this.position.x = 0;
        if(this.position.x + this.width > this.gameWidth) this.position.x = this.gameWidth - this.width;  

    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }

    moveRight() {
        this.speed = this.maxSpeed;
    }

    stop() {
        this.speed = 0;
    }

    jump() {
        if(jumping) 
            return;

        jumping = true;
        let counter = 0;
        let newY = this;

        //Function that handles y-axis values during jump
        upTimerId = setInterval(function () {

            collisionCheck();

            if(counter < 30) {
                newY.position.y -= 8;
                counter++;
            }
            else if(counter >= 31 && counter < 41) {
                counter++;
            }
            else if(counter < 70) {
                newY.position.y += 8;
                counter++;
            }
            else {
                jumping = false;
                window.clearInterval(upTimerId);
            }
                
        }, 10);
    }
}

//Assigns user input to actions
class InputHandler {
    constructor(player) {
        document.addEventListener("keydown", event => {
            switch(event.keyCode) {
                case 37:
                    player.moveLeft();
                    break;

                case 39:
                    player.moveRight();
                    break;

                case 32:
                    player.jump();
                    break;
            }
        });

        document.addEventListener("keyup", event => {
            switch(event.keyCode) {
                case 37:
                    if(player.speed < 0) player.stop();
                    break;

                case 39:
                    if(player.speed > 0) player.stop();
                    break;
            }
        });
    }
}

//Spawn and displays background objects
class Background {
    constructor(gameWidth, gameHeight) {
        this.resetCloud();

    }
    /* todo: Add logic for various different background objects to spawn
    spawnRand() {

        var t;
    
        if(Math.random() < 0.50) 
        {
            t = "cloud"

        }
            
        else
        {
            t= "bush";
        }

        var object = {
            type: t,
        }
    

        this.backObjs.push(object);

        return object;
    }
    */
    //Reassign values for cloud object
    resetCloud() {
        this.image = document.getElementById('Cloud1');
        this.width = 200;
        this.height = 100;
        this.position = {

            x: GAME_WIDTH,

            y: getRandom(100, 20),
        }
    }

    //Display object at current position
    draw(context) {
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    //Update positional values
    update(deltaTime) {
        this.position.x -= 1

        //If cloud reaches end of screen, respawn
        if(this.position.x == -200) {
            this.resetCloud();
            this.draw(context);
        }
    }
}

//Spawns and handles logic for post objects
class Posts {
    constructor(gameWidth) {

        this.image = document.getElementById('75px_Post');
        this.width = 10;
        this.height = 75;
        this.position = {

            x: gameWidth,
    
            y: 315,
        }

        this.leftOfPost = this.position.x - this.width;
        this.topOfPost = this.position.y - this.height;
    }

    //Assigns values for a standing post
    standing() {
        colCheck = false

        this.image = document.getElementById('75px_Post');

        this.width = 10;
        this.height = 75;

        this.position.x = GAME_WIDTH;
        this.position.y = 315
    }

    //Assigns values for a fallen post
    fallen() {
        this.image = document.getElementById('75px_PostFall');
        this.width = 75;
        this.height = 10;
        this.position.y = GAME_HEIGHT - 20;
        colCheck = true;
        score--;
    }

    //Display object at current position
    draw(context) {
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    ////Update positional values
    update(deltaTime) {
        this.position.x -= 2;
        this.leftOfPost = this.position.x - this.width;
        this.topOfPost = this.position.y - this.height;

        //If post reaches end of screen, check if it has fallen
        if(this.position.x == 0) {
            if(colCheck == false)
                score++;

            //Resets post
            this.standing();
            this.draw(context);
        }

    }
}

//Initialize objects
let player  = new Maple(GAME_WIDTH, GAME_HEIGHT);
let post = new Posts(GAME_WIDTH, GAME_HEIGHT);
let background = new Background();

new InputHandler(player);

let lastTime = 0;

//Generates random number between two given values
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

//Check if player has collided with a post
function collisionCheck() {
    //While Maple is colliding with post
    if(player.frontOfMaple >= post.leftOfPost && post.leftOfPost + 10 > player.frontOfMaple - 200
        && (player.bottomOfMaple >= post.topOfPost)) {
        colliding = true;
    }

    //If player has and is no longer colliding with post
    if(colCheck == false && colliding == true) {
        post.fallen();
        colliding = false;
        colCheck = true;
    }

    colliding = false;

}

//Display score
function drawScore() {
context.font = "40px Arial";
context.fillStyle = "green";
context.fillText("Score: " + score, 50, 100);
}

//Logic for player's walking animation
function animate () {

    let counter = 0;

    walkingTimerId = setInterval( function() {
        if(counter == 0) {
            player.image = document.getElementById("MapleStill");
            counter++;
        }

        else if(counter == 1) {
            player.image = document.getElementById("MapleWalking1");
            counter++;
        }

        else if(counter == 2) {
            player.image = document.getElementById("MapleStill");
            counter++;
        }

        else if(counter == 3) {
            player.image = document.getElementById("MapleWalking2");
            counter = 0
        }

    }, 100)

}

//Runs game
function gameLoop(timestamp) {

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    context.fillStyle = "lime";
    context.fillRect(0, GAME_HEIGHT-10, GAME_WIDTH, 10);
    context.fillStyle = "#15ced3";
    context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT-10);

    background.draw(context);
    background.update(context);
    player.update(deltaTime);
    player.draw(context);
    post.update(deltaTime);
    post.draw(context);
    

    collisionCheck();
    drawScore();

    requestAnimationFrame(gameLoop);
}

gameLoop();