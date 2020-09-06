const level1 = {
  brickRowCount: 2,
  brickColumnCount: 3,
  complete: false,
};

const level2 = {
  brickRowCount: 4,
  brickColumnCount: 3,
  complete: false,
};

const level3 = {
  brickRowCount: 6,
  brickColumnCount: 5,
  complete: false,
};

const level4 = {
  brickRowCount: 7,
  brickColumnCount: 6,
  complete: false,
};

const level5 = {
  brickRowCount: 8,
  brickColumnCount: 6,
  complete: false,
};

const level6 = {
  brickRowCount: 9,
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
    this.setCurrentLevelIdx();
  }

  public reset(): void {
    this.levels = this.levels.map((level) => ({ ...level, complete: false }));
    this.setCurrentLevelIdx();
  }

  public get currentNumber(): number {
    return this.currentLevelIdx + 1;
  }

  public get complete(): boolean {
    return this.currentLevelIdx === -1;
  }

  private setCurrentLevelIdx() {
    this.currentLevelIdx = this.levels.findIndex(
      (level) => level.complete === false
    );
  }
}
