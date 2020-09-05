const level1 = {
  brickRowCount: 2,
  brickColumnCount: 3,
  complete: false,
};

const level2 = {
  brickRowCount: 3,
  brickColumnCount: 3,
  complete: false,
};

const level3 = {
  brickRowCount: 3,
  brickColumnCount: 5,
  complete: false,
};

const level4 = {
  brickRowCount: 4,
  brickColumnCount: 6,
  complete: false,
};

const level5 = {
  brickRowCount: 5,
  brickColumnCount: 6,
  complete: false,
};

const level6 = {
  brickRowCount: 6,
  brickColumnCount: 8,
  complete: false,
};

interface Level {
  brickRowCount: number;
  brickColumnCount: number;
  complete: boolean;
}

export default class Levels {
  private levels: Level[] = [level1, level2, level3, level4, level5, level6];

  private currentLevelIdx: number = 0;

  public get current(): Level {
    return this.levels[this.currentLevelIdx];
  }

  public completedCurrent(): void {
    this.levels[this.currentLevelIdx].complete = true;
    this.currentLevelIdx = this.levels.findIndex(
      (level) => level.complete === false
    );
  }

  public get currentNumber(): number {
    return this.currentLevelIdx + 1;
  }

  public get complete(): boolean {
    return this.currentLevelIdx === -1;
  }
}
