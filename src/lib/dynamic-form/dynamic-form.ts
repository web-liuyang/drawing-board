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

  public isValid(): boolean {
    return this.component.isValid();
  }

  public clean() {
    this.component.clean();
  }

  public update(formGroups: FormGroup[]): void {
    this.component.update(formGroups);
  }

  public render(formGroups: FormGroup[]): void {
    this.component.formGroups = formGroups;
    this.component.render();
  }
}
