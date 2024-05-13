import { removeElementChild } from "../utils/element-utils";

import "./index.css";

type ComponentType = "input" | "select" | "info";

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
  onChanged?: (event: E, value: T) => void;
  onValid?: (event: E, value: T) => string | void;
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

export type FormItem = InputFormItem | SelectFormItem | InfoFormItem;

export interface DynamicFormComponentOptions {
  onChanged: () => void;
}

export class DynamicFormComponent implements Component {
  private oForm: HTMLFormElement;

  public get node() {
    return this.oForm;
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
    this.oForm.addEventListener("input", () => options.onChanged());
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
    if (this._formGroups === formGroups) return;
    const elements = this.oForm.elements;
    const diffs = diffValue(getformItems(formGroups), getformItems(this._formGroups));

    for (const formItem of diffs) {
      const oElement = elements.namedItem(formItem.name) as ComponentNodeTypeUpdatable | undefined;
      if (!oElement) continue;
      oElement.value = formItem.value;
    }

    this._formGroups = formGroups;
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

function getformItems(formGroups: FormGroup[]): FormItem[] {
  const formItems: FormItem[] = [];
  for (const group of formGroups) {
    formItems.push(...group.formItems);
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
      item.onChanged(event, target.value);
    }

    if (item.onValid) {
      const error = item.onValid(event, target.value);
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
      item.onChanged(event, target.value);
    }

    if (item.onValid) {
      const error = item.onValid(event, target.value);
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
