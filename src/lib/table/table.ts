import { TableComponent, TableComponentOptions } from "./table-component";

interface TableOptions<T> extends TableComponentOptions<T> {}

export class Table<T> {
  private component: TableComponent<T>;

  public get dataSrouce(): T[] {
    return this.component.dataSrouce;
  }

  public get node() {
    return this.component.node;
  }

  constructor(options: TableOptions<T>) {
    this.component = new TableComponent<T>(options);
  }

  public update(dataSrouce: T[]) {
    this.component.update(dataSrouce);
  }

  public render() {
    this.component.render();
  }
}
