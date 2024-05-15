import { removeElementChild } from "../../utils/element-utils";
import { debounce } from "../../utils/optimization-utils";
import { Notifier } from "../../notifier";

import "./index.css";

export interface Output {
  msg: string;
  type: "info" | "success" | "error" | "warn";
}

export class ConsoleController extends Notifier<Output> {
  private outputs: Output[] = [];

  public get value(): Output[] {
    return [...this.outputs];
  }

  constructor(outputs: Output[]) {
    super();
    this.outputs = outputs;
  }

  public override notifyListeners(value: Output): void {
    for (const cb of this.listeners) {
      cb(value);
    }
  }

  public info(msg: string): void {
    this.addOutput(msg, "info");
  }

  public success(msg: string): void {
    this.addOutput(msg, "success");
  }

  public warn(msg: string): void {
    this.addOutput(msg, "warn");
  }

  public error(msg: string): void {
    this.addOutput(msg, "error");
  }

  private getCurrentDate(): string {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  public addOutput(msg: Output["msg"], type: Output["type"]): void {
    const message = `[${this.getCurrentDate()}] ${msg}`;
    const output: Output = { msg: message, type };
    this.outputs.push(output);
    this.notifyListeners(output);
  }
}

export interface ConsoleComponentOptions {
  controller: ConsoleController;
}

export class ConsoleComponent implements Component {
  private oConsole: HTMLElement;

  public readonly controller: ConsoleComponentOptions["controller"];

  public get node(): HTMLElement {
    return this.oConsole;
  }

  constructor(options: ConsoleComponentOptions) {
    this.controller = options.controller;

    this.oConsole = document.createElement("div");
    this.oConsole.className = "console";

    // const scrollToBottom = debounce(this.scrollToBottom.bind(this), 1000 / 60);
    this.controller.addListener(output => {
      const { scrollTop, clientHeight, scrollHeight } = this.oConsole;
      const locatAtBottom: boolean = scrollTop + clientHeight === scrollHeight;
      if (locatAtBottom) this.scrollToBottom();
      this.addMessage(output);
    });
  }

  private scrollToBottom: () => void = debounce(() => {
    this.oConsole.scrollTop = this.oConsole.scrollHeight;
  }, 1000 / 60);

  private createMessage(output: Output): HTMLElement {
    const node = document.createElement("div");
    node.className = `console--${output.type}`;
    node.textContent = output.msg;
    return node;
  }

  private addMessage(output: Output): void {
    const oMessage = this.createMessage(output);
    this.oConsole.append(oMessage);
  }

  public clean(): void {
    removeElementChild(this.oConsole);
  }

  public update(): void {}

  public render(): void {
    this.clean();

    for (const output of this.controller.value) {
      this.addMessage(output);
    }

    this.scrollToBottom();
  }
}
