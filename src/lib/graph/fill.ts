interface FillOptions {
  color: string;
}

export class Fill implements Cloneable<FillOptions> {
  public readonly color: string;

  constructor(options: FillOptions) {
    this.color = options.color;
  }

  public copyWith(options: Partial<FillOptions>): Fill {
    return new Fill({
      color: options.color ?? this.color,
    });
  }
}
