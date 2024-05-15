import { ConsoleController } from "../control-panel";

export class Log {
  static readonly controller: ConsoleController = new ConsoleController([]);

  static info(msg: string): void {
    console.log("A");
    Log.controller.info(msg);
  }

  static success(msg: string): void {
    Log.controller.success(msg);
  }

  static warn(msg: string): void {
    Log.controller.warn(msg);
  }

  static error(msg: string): void {
    Log.controller.error(msg);
  }
}
