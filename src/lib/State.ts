import { MAX_SPEED } from "./constants";

export default class State {
    public constructor(
        public score: number,
        public brickSmashCount: number,
        public rightPressed: boolean,
        public leftPressed: boolean,
        public paddleHeight: number,
        public paddleWidth: number,
        public paddleX: number,
        public ballRadius: number,
        public speed: number,
        public dx: number,
        public dy: number,
        public x: number,
        public y: number,
        public brickOffsetTop: number,
        public brickOffsetLeft: number,
        public brickPadding: number,
        public brickHeight: number,
        public brickWidth: number,
        public lives: number,
        public loop: boolean
    ) {}

    public setBallSpeed(speed: number) {
        this.speed = speed > MAX_SPEED ? MAX_SPEED : speed;
        if (this.dx < 0) {
            this.dx = -this.speed;
        } else {
            this.dx = this.speed;
        }

        if (this.dy < 0) {
            this.dy = -this.speed;
        } else {
            this.dy = this.speed;
        }
    }
}
