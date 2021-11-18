export default class TestMethod {
    
    constructor(gameWidth, gameHeight) {
        this.width = 150;
        this.height = 20;

        this.position = {

            x: gameWidth / 2 - this.width / 2,

            y: gameHeight - this.height,
        }
    }

    
    draw(context) {
        context.fillStyle = '#f00';
        context.fillRect(100, 100, 100, 10 );
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

 }