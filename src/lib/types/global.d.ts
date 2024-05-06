/**
 * [x, y]
 */
declare type Point = [number, number];

declare type VoidFunction = () => void;

declare type ValueFunction<T> = (value: T) => void;

declare interface Cloneable<T> {
  copyWith(options: T): unknown;
}
