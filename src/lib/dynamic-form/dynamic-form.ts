import type { FormGroup, DynamicFormComponentOptions } from "./dynamic-form-component";
import { DynamicFormComponent } from "./dynamic-form-component";

export interface DynamicFormOption extends DynamicFormComponentOptions {}

export class DynamicForm {
  private component: DynamicFormComponent;

  public get node(): HTMLFormElement {
    return this.component.node;
  }

  constructor(options: DynamicFormOption) {
    this.component = new DynamicFormComponent({
      onChanged: options.onChanged,
    });
  }

  public getValues(): Record<string, string> {
    const formDataIter = new FormData(this.node).entries();

    const values: Record<string, string> = {};
    for (const [key, value] of formDataIter) {
      values[key] = value as string;
    }

    return values;
  }

  public isValid(): boolean {
    return true;
  }

  public update(formGroups: FormGroup[]): void {
    this.component.update(formGroups);
  }

  public render(formGroups: FormGroup[]): void {
    this.component.setFormGroups(formGroups);
    this.component.render();
  }
}
