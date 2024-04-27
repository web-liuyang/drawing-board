export interface DrawOptinos {
  ctx: CanvasRenderingContext2D;
}

export class Draw {
  private ctx: CanvasRenderingContext2D;

  constructor(options: DrawOptinos) {
    this.ctx = options.ctx;
  }
}
