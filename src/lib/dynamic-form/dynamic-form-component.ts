import { removeElementChild } from "../utils/element-utils";
import { Table } from "../table";

import "./index.css";

type ComponentType = "input" | "select" | "info" | "point";

export interface FormGroup {
  name: string;
  formItems: FormItem[];
}

interface FormItemBase<T> {
  componentType: ComponentType;
  disabled?: boolean;
  value: T;
  name: string;
  label?: string;
  onValid?: (value: T) => string | undefined;
}

type ComponentNodeTypeUpdatable = HTMLInputElement | HTMLSelectElement;

export interface InputFormItem extends FormItemBase<string> {
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

export interface PointFormItem extends Omit<FormItemBase<Point[]>, "onValid"> {
  componentType: "point";
  onValid: (value: [string, string][]) => string | undefined;
}

export type FormItem = InputFormItem | SelectFormItem | InfoFormItem | PointFormItem;

export type EditableFormItem = Exclude<FormItem, InfoFormItem>;

export interface DynamicFormComponentOptions {
  onChanged: (values: FormValues) => void;
}

export type FormValues = Record<string, string | Point[]>;

export class DynamicFormComponent implements Component {
  private oForm: HTMLFormElement;

  public get node() {
    return this.oForm;
  }

  private _editableFormItemsMap: Map<EditableFormItem["name"], EditableFormItem> = new Map();

  public _formGroups: FormGroup[] = [];

  public get formGroups(): FormGroup[] {
    return this._formGroups;
  }

  public set formGroups(formGroups: FormGroup[]) {
    this._editableFormItemsMap.clear();
    for (const group of formGroups) {
      for (const formItem of group.formItems) {
        if (formItem.componentType === "info") continue;
        this._editableFormItemsMap.set(formItem.name, formItem);
      }
    }

    this._formGroups = formGroups;
  }

  constructor(options: DynamicFormComponentOptions) {
    this.oForm = document.createElement("form");
    this.oForm.className = "dynamic-form";
    this.oForm.addEventListener("input", e => {
      const target = e.target as HTMLElement;
      const elements = this.oForm.elements;
      const field = target.dataset.field!;
      const componentType = target.dataset.componentType as ComponentType;
      if (componentType === "info") return;
      const formItem = this._editableFormItemsMap.get(field)!;
      let value: string | [string, string][];
      if (componentType === "point") {
        const point: [string, string][] = [];
        const formData = new FormData(this.oForm);
        for (let index = 0, length = formItem.value.length; index < length; index++) {
          const [x, y] = formData.getAll(pointElementName(field, index));
          point.push([`${x}`, `${y}`]);
        }
        value = point;
      } else {
        const element = elements.namedItem(target.dataset.field as string) as ComponentNodeTypeUpdatable;
        value = element.value;
      }

      const errorText = formItem.onValid
        ? formItem.onValid(value as string & [string, string][]) ?? undefined
        : undefined;

      this.handleValid(formItem, errorText);
      if (!errorText) options.onChanged(this.getValues());
    });
  }

  public isValid(): boolean {
    const oErrorTextCollection = this.oForm.getElementsByClassName("form-item__error-text");
    if (oErrorTextCollection.length > 0) return true;
    return false;
  }

  public getValues(): FormValues {
    const formData = new FormData(this.oForm);
    const elements = this.oForm.elements;
    const values: FormValues = {};

    for (const item of this._editableFormItemsMap.values()) {
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
    oFormItem.className = `form-item form-item-${formItem.name}`;

    const oDisplay = this.createFormItemDisplay(formItem);
    oFormItem.append(oDisplay);

    const oErrorText = this.createErrorText();
    oFormItem.append(oErrorText);

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

  private createErrorText(): HTMLElement {
    const oErrorText = document.createElement("div");
    oErrorText.className = "form-item__error-text";
    return oErrorText;
  }

  private handleValid(item: FormItem, errorText?: string): void {
    const oFormItem = document.querySelector(`.form-item.form-item-${item.name}`) as HTMLElement;
    const oErrorText = oFormItem.querySelector(".form-item__error-text") as HTMLElement;
    if (errorText) {
      oFormItem.classList.add("error");
      oErrorText.textContent = errorText;
    } else {
      oFormItem.classList.remove("error");
      oErrorText.textContent = "";
    }
  }

  public clean(): void {
    removeElementChild(this.oForm);
  }

  public update(formGroups: FormGroup[]): void {
    const oldFormGroups = this._formGroups;
    const newFormGroups = formGroups;

    if (newFormGroups === oldFormGroups) return;

    this.formGroups = formGroups;

    // TODO
    // Optimization
    const diffs = diffValue(getFormItems(newFormGroups), getFormItems(oldFormGroups));
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
  oInput.dataset.field = item.name;
  oInput.dataset.componentType = item.componentType;
  if (item.disabled) oInput.disabled = item.disabled;

  return oInput;
}

function createSelectComp(item: SelectFormItem): HTMLElement {
  const oSelect = document.createElement("select");
  oSelect.id = item.name;
  oSelect.name = item.name;
  oSelect.dataset.field = item.name;
  oSelect.dataset.componentType = item.componentType;
  if (item.disabled) oSelect.disabled = item.disabled;

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
  oInfo.dataset.field = item.name;
  oInfo.textContent = item.value;
  oInfo.dataset.componentType = item.componentType;
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
          oIndex.dataset.field = item.name;
          oIndex.dataset.componentType = item.componentType;
          oIndex.textContent = index.toString();
          return oIndex;
        },
      },
      {
        name: "x",
        render: (data, index) => {
          const oInput = document.createElement("input");
          oInput.name = pointElementName(item.name, index);
          oInput.dataset.field = item.name;
          oInput.dataset.componentType = item.componentType;
          oInput.value = data[0].toString();
          return oInput;
        },
      },
      {
        name: "y",
        render: (data, index) => {
          const oInput = document.createElement("input");
          oInput.name = pointElementName(item.name, index);
          oInput.dataset.field = item.name;
          oInput.dataset.componentType = item.componentType;
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
