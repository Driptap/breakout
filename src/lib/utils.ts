export function getRandomColor(): string {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export interface Position {
  x: number;
  y: number;
}

export interface Rect extends Position {
  height: number;
  width: number;
}

export function isInside(pos: Position, rect: Rect): boolean {
  return (
    pos.x > rect.x &&
    pos.x < rect.x + rect.width &&
    pos.y < rect.y + rect.height &&
    pos.y > rect.y
  );
}

export function getMousePos(
  e: MouseEvent,
  canvas: HTMLCanvasElement
): Position {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}
