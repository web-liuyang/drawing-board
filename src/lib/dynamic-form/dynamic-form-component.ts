import { removeElementChild } from "../utils/element-utils";
import { Table } from "../table";

import "./index.css";

type ComponentType = "input" | "select" | "info" | "point";

export interface FormGroup {
  name: string;
  formItems: FormItem[];
}

interface FormItemBase<T, E = Event> {
  componentType: ComponentType;
  disabled?: boolean;
  value: T;
  name: string;
  label?: string;
  onChanged?: (value: T, event: E) => void;
  onValid?: (value: T) => string | void;
}

type ComponentNodeTypeUpdatable = HTMLInputElement | HTMLSelectElement;

export interface InputFormItem extends FormItemBase<string, InputEvent> {
  componentType: "input";
}

export type Option = {
  label: string;
  value: string;
};

export interface SelectFormItem extends FormItemBase<Option["value"]> {
  componentType: "select";
  options: Option[];
}

export interface InfoFormItem extends Omit<FormItemBase<string>, "disabled" | "onChanged" | "onValid"> {
  componentType: "info";
}

export interface PointFormItem extends FormItemBase<Point[]> {
  componentType: "point";
}

export type FormItem = InputFormItem | SelectFormItem | InfoFormItem | PointFormItem;

export interface DynamicFormComponentOptions {
  onChanged: (values: FormValues) => void;
}

export type FormValues = Record<string, string | Point[]>;

export class DynamicFormComponent implements Component {
  private oForm: HTMLFormElement;

  public get node() {
    return this.oForm;
  }

  private get formItemAll(): FormItem[] {
    return getFormItems(this._formGroups);
  }

  public _formGroups: FormGroup[] = [];

  public get formGroups(): FormGroup[] {
    return this._formGroups;
  }

  public set formGroups(formGroups: FormGroup[]) {
    this._formGroups = formGroups;
  }

  constructor(options: DynamicFormComponentOptions) {
    this.oForm = document.createElement("form");
    this.oForm.className = "dynamic-form";
    this.oForm.addEventListener("input", () => {
      options.onChanged(this.getValues());
    });
  }

  public isValid(): boolean {
    const values = this.getValues();
    const formItems = this.formItemAll;

    for (const item of formItems) {
      if (item.componentType === "info") continue;
      const value = values[item.name];
      const errorText = item.onValid ? item.onValid(value as string & Point[]) : undefined;
      if (errorText) return false;
    }

    return true;
  }

  public getValues(): FormValues {
    const formData = new FormData(this.oForm);
    const elements = this.oForm.elements;
    const values: FormValues = {};

    for (const item of this.formItemAll) {
      if (item.componentType === "info") continue;
      if (item.componentType === "point") {
        const points: Point[] = [];

        for (let index = 0, length = item.value.length; index < length; index++) {
          const [x, y] = formData.getAll(pointElementName(item.name, index));
          points.push([Number(x), Number(y)]);
        }

        values[item.name] = points;
      } else {
        const element = elements.namedItem(item.name) as ComponentNodeTypeUpdatable;
        values[item.name] = element.value;
      }
    }

    return values;
  }

  private createFormGroup(fromGroup: FormGroup): HTMLElement {
    const oFormGroup = document.createElement("div");
    oFormGroup.className = "form-group-item";

    const oName = document.createElement("div");
    oName.className = "form-group-item__name";
    oName.textContent = fromGroup.name;
    oFormGroup.append(oName);

    const oContent = document.createElement("div");
    oContent.className = "form-group-item__content";
    for (const item of fromGroup.formItems) {
      const oFormItem = this.createFormItem(item);
      oContent.append(oFormItem);
    }

    oFormGroup.append(oContent);

    return oFormGroup;
  }

  private createFormItem(formItem: FormItem): HTMLElement {
    const oFormItem = document.createElement("div");
    oFormItem.className = "form-item";

    const oDisplay = this.createFormItemDisplay(formItem);
    oFormItem.append(oDisplay);

    return oFormItem;
  }

  private createFormItemDisplay(formItem: FormItem): HTMLElement {
    const oDisplay = document.createElement("div");
    oDisplay.className = "form-item__display";

    const oLabel = document.createElement("label");
    oLabel.className = "display__label";
    oLabel.htmlFor = formItem.name;
    oLabel.textContent = formItem.label ?? "";
    oDisplay.append(oLabel);

    const oComp = createComp(formItem);
    oDisplay.append(oComp);

    return oDisplay;
  }

  public clean(): void {
    removeElementChild(this.oForm);
  }

  public update(formGroups: FormGroup[]): void {
    const oldFormGroups = this._formGroups;
    const newFormGroups = formGroups;
    if (newFormGroups === oldFormGroups) return;

    this._formGroups = formGroups;
    const diffs = diffValue(getFormItems(newFormGroups), this.formItemAll);
    if (diffs.some(formItem => formItem.componentType === "point")) {
      this.render();
      return;
    }

    const elements = this.oForm.elements;
    for (const formItem of diffs) {
      const oElement = elements.namedItem(formItem.name) as ComponentNodeTypeUpdatable | undefined;
      if (!oElement) continue;
      oElement.value = formItem.value as string;
    }
  }

  public render(): void {
    this.clean();
    for (const group of this._formGroups) {
      const node = this.createFormGroup(group);
      this.oForm.append(node);
    }
  }
}

function diffValue(newFormItems: FormItem[], oldFormItems: FormItem[]): FormItem[] {
  const diffFormItems = [];
  const oldFormItemsMap = new Map<string, FormItem>(oldFormItems.map(item => [item.name, item]));

  for (const item of newFormItems) {
    if (!oldFormItemsMap.has(item.name)) continue;
    const oldItem = oldFormItemsMap.get(item.name)!;
    if (item.value === oldItem.value) continue;
    diffFormItems.push(item);
  }

  return diffFormItems;
}

function getFormItems(formGroups: FormGroup[], type?: ComponentType): FormItem[] {
  const formItems: FormItem[] = [];
  for (const group of formGroups) {
    if (type) {
      for (const formItem of group.formItems) {
        formItem.componentType === type && formItems.push(formItem);
      }
    } else {
      formItems.push(...group.formItems);
    }
  }

  return formItems;
}

function createComp(formItem: FormItem): HTMLElement {
  switch (formItem.componentType) {
    case "input":
      return createInputComp(formItem);
    case "select":
      return createSelectComp(formItem);
    case "info":
      return createInfoComp(formItem);
    case "point":
      return createPointComp(formItem);
  }

  // throw new Error("not support component type: " + formItem.componentType);
}

function createInputComp(item: InputFormItem): HTMLElement {
  const oInput = document.createElement("input");
  oInput.id = item.name;
  oInput.name = item.name;
  oInput.value = item.value;
  if (item.disabled) oInput.disabled = item.disabled;

  let isComposition: boolean = false;
  oInput.addEventListener("compositionstart", () => (isComposition = true));
  oInput.addEventListener("compositionend", e => {
    isComposition = false;
    oInput.dispatchEvent(new InputEvent("input", e));
  });
  oInput.addEventListener("input", e => {
    if (isComposition) return;
    const event = e as InputEvent;
    const target = event.target as HTMLInputElement;

    if (item.onChanged) {
      item.onChanged(target.value, event);
    }

    if (item.onValid) {
      const error = item.onValid(target.value);
      // console.log(error);
    }
  });

  return oInput;
}

function createSelectComp(item: SelectFormItem): HTMLElement {
  const oSelect = document.createElement("select");
  oSelect.id = item.name;
  oSelect.name = item.name;
  if (item.disabled) oSelect.disabled = item.disabled;
  oSelect.addEventListener("input", event => {
    const target = event.target as HTMLSelectElement;
    if (item.onChanged) {
      item.onChanged(target.value, event);
    }

    if (item.onValid) {
      const error = item.onValid(target.value);
      console.log(error);
    }
  });

  for (const option of item.options) {
    const oOption = document.createElement("option");
    oOption.value = option.value;
    oOption.textContent = option.label;
    oSelect.append(oOption);
  }

  oSelect.value = item.value;

  return oSelect;
}

function createInfoComp(item: InfoFormItem): HTMLElement {
  const oInfo = document.createElement("span");
  oInfo.id = item.name;
  oInfo.textContent = item.value;
  return oInfo;
}

function createPointComp(item: PointFormItem): HTMLElement {
  const oBox = document.createElement("div");
  oBox.className = "point-box";

  const table = new Table<Point>({
    dataSrouce: item.value,
    columns: [
      {
        name: "index",
        render: (data, index) => {
          const oIndex = document.createElement("span");
          oIndex.id = item.name;
          oIndex.textContent = index.toString();
          return oIndex;
        },
      },
      {
        name: "x",
        render: (data, index) => {
          const oInput = document.createElement("input");
          oInput.name = pointElementName(item.name, index);
          oInput.value = data[0].toString();
          return oInput;
        },
      },
      {
        name: "y",
        render: (data, index) => {
          const oInput = document.createElement("input");
          oInput.name = pointElementName(item.name, index);
          oInput.value = data[1].toString();
          return oInput;
        },
      },
    ],
  });

  table.render();
  const oTable = table.node;
  oTable.id = item.name;

  oBox.append(oTable);

  return oBox;
}

function pointElementName(name: string, index: number): string {
  return `${name}_${index}`;
}
