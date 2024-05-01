import { Notifier } from "./notifier";

export class ValueNotifier<T> extends Notifier<T> {
  private defaultValue: T;

  private _value: T;

  get value() {
    return this._value;
  }

  set value(v: T) {
    if (v === this._value) return;
    this._value = v;
    this.notifyListeners(v);
  }

  constructor(value: T) {
    super();
    this.defaultValue = value;
    this._value = value;
  }

  public override notifyListeners(value: T): void {
    for (const cb of this.listeners) {
      cb(value);
    }
  }

  public reset() {
    this.value = this.defaultValue;
  }
}
