export default class Sound {
  private ctx: AudioContext;

  private brickSmashOscillator: OscillatorNode;
  private powerUpOscillator: OscillatorNode;
  private looseALifeOscillator: OscillatorNode;

  public constructor() {
    this.ctx = new window.AudioContext();
    this.startOscillators();
  }

  public brickSmash() {
    this.brickSmashOscillator.connect(this.ctx.destination);
    setTimeout(
      () => this.brickSmashOscillator.disconnect(this.ctx.destination),
      25
    );
  }

  public powerUp() {
    this.powerUpOscillator.connect(this.ctx.destination);
    setTimeout(() => {
      this.powerUpOscillator.frequency.value = 475;
    }, 20);
    setTimeout(() => {
      this.powerUpOscillator.frequency.value = 525;
    }, 40);
    setTimeout(() => {
      this.powerUpOscillator.frequency.value = 625;
    }, 60);
    setTimeout(
      () => this.powerUpOscillator.disconnect(this.ctx.destination),
      75
    );
  }

  public looseALife() {
    this.looseALifeOscillator.connect(this.ctx.destination);
    setTimeout(
      () => this.looseALifeOscillator.disconnect(this.ctx.destination),
      45
    );
  }

  private startOscillators() {
    this.startBrickSmashOscillator();
    this.startPowerUpOscillator();
    this.startLooseALifeOscillator();
  }

  private startBrickSmashOscillator() {
    this.brickSmashOscillator = this.ctx.createOscillator();
    this.brickSmashOscillator.frequency.value = 125;
    this.brickSmashOscillator.type = "square";
    this.brickSmashOscillator.start();
  }

  private startPowerUpOscillator() {
    this.powerUpOscillator = this.ctx.createOscillator();
    this.powerUpOscillator.frequency.value = 425;
    this.powerUpOscillator.start();
  }

  private startLooseALifeOscillator() {
    var bufferSize = 2 * this.ctx.sampleRate,
      noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate),
      output = noiseBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 4 - 1;
    }

    this.looseALifeOscillator = this.ctx.createBufferSource();
    this.looseALifeOscillator.buffer = noiseBuffer;
    this.looseALifeOscillator.loop = true;
    this.looseALifeOscillator.start(0);
  }
}
