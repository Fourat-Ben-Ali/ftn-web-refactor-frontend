import { Component, Input } from '@angular/core';
import { formInputs } from 'models';


@Component({
  selector: 'Form-Input',
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
})
export class InputFieldComponent {
  @Input() inputField!: formInputs;

  ngOnInit() {
    if (!this.inputField) {
      throw new Error('InputFieldComponent requires an inputField to be provided.');    }
  }
}
