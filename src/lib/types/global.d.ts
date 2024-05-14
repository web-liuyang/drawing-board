/**
 * [x, y]
 */
declare type Point = [number, number];

declare type VoidFunction = () => void;

declare type ValueFunction<T> = (value: T) => void;

declare interface Cloneable<T> {
  copyWith(options: T): unknown;
}

declare interface Equatable<T> {
  equals(other: T): boolean;
}

declare interface Component {
  node: HTMLElement;
  clean(): void;
  update(...args: unknown[]): void;
  render(): void;
}
