import State from "./State";

export default class DomListeners {
    constructor(
        private readonly state: State,
        private readonly canvas: HTMLCanvasElement
    ) {
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);
        document.addEventListener("mousemove", this.mouseMoveHandler, false);

        this.canvas.addEventListener("touchmove", this.touchMoveHandler, false);
    }

    private touchMoveHandler = (e: TouchEvent) => {
        e.preventDefault();

        if (e.touches) {
            let relativeX =
                e.touches[0].pageX -
                this.canvas.offsetLeft -
                this.state.paddleWidth / 2;

            if (relativeX > 0 && relativeX < this.canvas.width) {
                this.state.paddleX = relativeX - this.state.paddleWidth / 2;
            }
        }
    };

    private keyDownHandler = (e: KeyboardEvent): void => {
        if (e.key == "Right" || e.key === "ArrowRight") {
            this.state.rightPressed = true;
        } else if (e.key == "Left" || e.key === "ArrowLeft") {
            this.state.leftPressed = true;
        }
    };

    private keyUpHandler = (e: KeyboardEvent): void => {
        if (e.key == "Right" || e.key === "ArrowRight") {
            this.state.rightPressed = false;
        } else if (e.key == "Left" || e.key === "ArrowLeft") {
            this.state.leftPressed = false;
        }
    };

    private mouseMoveHandler = (e: MouseEvent): void => {
        var relativeX = e.clientX - this.canvas.offsetLeft;

        if (relativeX > 0 && relativeX < this.canvas.width) {
            this.state.paddleX = relativeX - this.state.paddleWidth / 2;
        }
    };
}
