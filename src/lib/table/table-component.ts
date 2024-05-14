import { removeElementChild } from "../utils/element-utils";

import "./index.css";

export interface TableComponentOptions<T> {
  dataSrouce: T[];
  columns: Column<T>[];
}

export interface Column<T> {
  name: string;
  render: (item: T, index: number) => HTMLElement;
}

export class TableComponent<T> implements Component {
  private oTable: HTMLTableElement;
  private oTHead: HTMLTableSectionElement;
  private oTBody: HTMLTableSectionElement;

  public get node(): HTMLTableElement {
    return this.oTable;
  }

  private _dataSrouce: T[] = [];

  public get dataSrouce() {
    return [...this._dataSrouce];
  }

  public set dataSrouce(dataSrouce: T[]) {
    this._dataSrouce = dataSrouce;
  }

  private _columns: Column<T>[] = [];

  constructor(options: TableComponentOptions<T>) {
    this._dataSrouce = options.dataSrouce;
    this._columns = options.columns;

    this.oTable = document.createElement("table");
    this.oTHead = document.createElement("thead");
    this.oTBody = document.createElement("tbody");
    this.oTable.className = "table";
    this.oTHead.className = "thead";
    this.oTBody.className = "tbody";

    this.oTable.append(this.oTHead, this.oTBody);
  }

  public clean(): void {
    removeElementChild(this.oTHead);
    removeElementChild(this.oTBody);
  }

  public update(dataSrouce: T[]): void {
    if (dataSrouce === this.dataSrouce) return;
    this._dataSrouce = dataSrouce;

    removeElementChild(this.oTBody);
    this._updateTBody(this.oTBody, this._columns, this._dataSrouce);
  }

  private _updateTHead(oTHead: HTMLTableSectionElement, columns: Column<T>[]): void {
    const oTr = document.createElement("tr");
    for (const column of columns) {
      const oTd = document.createElement("td");
      oTr.append(oTd);
      oTd.textContent = column.name;
    }

    oTHead.append(oTr);
  }

  private _updateTBody(oTBody: HTMLTableSectionElement, columns: Column<T>[], dataSrouce: T[]): void {
    for (let i = 0; i < dataSrouce.length; i++) {
      const data = dataSrouce[i];

      const oTr = document.createElement("tr");
      for (const column of columns) {
        const oTd = document.createElement("td");
        oTr.append(oTd);
        oTd.append(column.render(data, i));
      }

      oTBody.append(oTr);
    }
  }

  public render(): void {
    const columns = this._columns;
    const dataSrouce = this._dataSrouce;
    const oTHead = this.oTHead;
    const oTBody = this.oTBody;

    this.clean();
    this._updateTHead(oTHead, columns);
    this._updateTBody(oTBody, columns, dataSrouce);
  }
}
