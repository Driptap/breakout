import State from "./State";
import { BALL_RADIUS, PADDLE_WIDTH } from "./constants";

interface Modifier {
  icon: HTMLImageElement;
  function: (state: State) => number;
  type: string;
}

const oneUpIcon = document.getElementById("icon-one-up") as HTMLImageElement;

const bigPaddle = {
  type: "bigPaddle",
  icon: oneUpIcon,
  function: (state: State) => {
    state.paddleWidth = state.paddleWidth + 100;
    state.score += 10;
    return window.setTimeout(() => {
      state.paddleWidth = PADDLE_WIDTH;
    }, 5000);
  },
};

const speedBall = {
  type: "speedBall",
  icon: oneUpIcon,
  function: (state: State) => {
    const originalSpeed = state.speed;
    state.setBallSpeed(state.speed + 1);
    state.score += 10;
    return window.setTimeout(() => {
      state.speed = originalSpeed;
    }, 5000);
  },
};

const bigBall = {
  type: "bigBall",
  icon: oneUpIcon,
  function: (state: State) => {
    state.ballRadius = state.ballRadius + 10;
    state.score += 10;
    return window.setTimeout(() => {
      state.ballRadius = BALL_RADIUS;
    }, 5000);
  },
};

export default class Modifiers {
  private modifiers: Modifier[] = [bigPaddle, bigBall];
  private activeModifiers: {
    [key: string]: number;
  } = {};
  public constructor(private readonly state: State) {}

  public icon(index: number): HTMLImageElement {
    return this.modifiers[index].icon;
  }

  public activate(index: number): void {
    const modifier = this.modifiers[index];
    if (this.activeModifiers[modifier.type]) {
      clearTimeout(this.activeModifiers[modifier.type]);
    }
    this.activeModifiers[modifier.type] = this.modifiers[index].function(
      this.state
    );
  }

  public random(): number {
    return Math.floor(Math.random() * this.modifiers.length);
  }
}
