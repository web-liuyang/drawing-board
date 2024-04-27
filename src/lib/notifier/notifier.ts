export type ValueCallback<T> = (value: T) => void;

export type ChangeCallback = () => void;

type Callback<T> = T extends undefined ? ChangeCallback : ValueCallback<T>;

export abstract class Notifier<T = undefined> {
  protected listeners: Callback<T>[] = [];

  public addListener(cb: Callback<T>): void {
    this.listeners.push(cb);
  }

  public removeListener(cb: Callback<T>): void {
    const index = this.listeners.indexOf(cb);
    if (index === -1) return;
    this.listeners.splice(index, 1);
  }

  public abstract notifyListeners(value?: T): void;
}
