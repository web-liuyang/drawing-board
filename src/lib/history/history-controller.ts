import { ChangeNotifier } from "../notifier";

export class HistoryController<T> extends ChangeNotifier {
  private _index = 0;

  private _histories: T[] = [];

  constructor(histories: T[]) {
    super();
    this._histories = histories;
  }

  public forward(): void {
    if (this._index === this._histories.length - 1) return;
    this._index++;
    this.notifyListeners();
  }

  public backward(): void {
    if (this._index === 0) return;
    this._index--;
    this.notifyListeners();
  }

  public push(history: T): void {
    this._histories.push(history);
    this._index++;
    this.notifyListeners();
    console.log(this._histories);
  }

  get state(): T {
    return this._histories[this._index];
  }
}
