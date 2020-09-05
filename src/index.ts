import { startGame } from './Breakout';

const canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement;

if (!canvas) {
	throw new Error('No canvas element found');
} else {
	startGame(canvas);
}
