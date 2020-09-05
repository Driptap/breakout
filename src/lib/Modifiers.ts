import State from "./State";

interface Modifier {
  icon: HTMLImageElement;
  function: (state: State) => void;
}

const oneUpIcon = document.getElementById("icon-one-up") as HTMLImageElement;

const bigPaddle = {
  icon: oneUpIcon,
  function: (state: State) => {
    const originalPaddleWidth = state.paddleWidth;
    state.paddleWidth = state.paddleWidth + 100;
    state.score += 10;
    setTimeout(() => {
      state.paddleWidth = originalPaddleWidth;
    }, 5000);
  },
};

const speedBall = {
  icon: oneUpIcon,
  function: (state: State) => {
    const originalSpeed = state.speed;
    const newSpeed = state.speed + 5;
    if (newSpeed > 20) {
      state.speed = originalSpeed;
    } else {
      state.speed = newSpeed;
    }
    state.score += 10;
    setTimeout(() => {
      state.speed = originalSpeed;
    }, 5000);
  },
};

const bigBall = {
  icon: oneUpIcon,
  function: (state: State) => {
    const originalBallSize = state.ballRadius;
    state.ballRadius = originalBallSize + 3;
    state.score += 10;
    setTimeout(() => {
      state.ballRadius = originalBallSize;
    }, 5000);
  },
};

export default class Modifiers {
  private modifiers: Modifier[] = [speedBall, bigPaddle, bigBall];

  public constructor(private readonly state: State) {}

  public icon(index: number): HTMLImageElement {
    return this.modifiers[index].icon;
  }

  public activate(index: number): void {
    this.modifiers[index].function(this.state);
  }

  public random(): number {
    return Math.floor(Math.random() * this.modifiers.length);
  }
}
