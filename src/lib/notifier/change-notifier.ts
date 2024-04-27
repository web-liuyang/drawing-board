import { Notifier } from "./notifier";

export class ChangeNotifier extends Notifier {
  public override notifyListeners(): void {
    for (const cb of this.listeners) {
      cb();
    }
  }
}
