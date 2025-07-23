import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NG_ZORRO_MODULES } from '@shared/ng-zorro.module';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'app-summary-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...NG_ZORRO_MODULES,
    FormFieldComponent,
  ],
  template: `
    @if (formGroup) {
    <div [formGroup]="formGroup">
      <app-form-field
        label="Summary"
        type="rich-text"
        formControlName="summary"
      ></app-form-field>
    </div>
    }
  `,
})
export class SummaryFormComponent {
  @Input() formGroup!: FormGroup;
}
