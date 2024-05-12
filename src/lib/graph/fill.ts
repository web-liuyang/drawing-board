interface FillOptions {
  color: string;
}

export class Fill implements Cloneable<FillOptions>, Equatable<Fill> {
  public readonly color: string;

  constructor(options: FillOptions) {
    this.color = options.color;
  }

  public copyWith(options: Partial<FillOptions>): Fill {
    return new Fill({
      color: options.color ?? this.color,
    });
  }

  public equals(other: Fill): boolean {
    return this.color === other.color;
  }
}
