import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NG_ZORRO_MODULES } from '@shared/ng-zorro.module';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'app-personal-info-form',
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
        label="Job Title"
        [formControlName]="'jobTitle'"
        placeholder="Enter your job title"
        errorTip="Please input your job title!"
      ></app-form-field>

      <app-form-field
        label="First Name"
        [formControlName]="'firstName'"
        placeholder="Enter your first name"
        errorTip="Please input your first name!"
      ></app-form-field>

      <app-form-field
        label="Last Name"
        [formControlName]="'lastName'"
        placeholder="Enter your last name"
        errorTip="Please input your last name!"
      ></app-form-field>

      <app-form-field
        label="Email"
        type="email"
        [formControlName]="'email'"
        placeholder="Enter your email"
        errorTip="Please input a valid email!"
      ></app-form-field>

      <app-form-field
        label="Phone"
        [formControlName]="'phone'"
        placeholder="Enter your phone number"
        errorTip="Please input a valid phone number!"
      ></app-form-field>

      <app-form-field
        label="Address"
        [formControlName]="'address'"
        placeholder="Enter your address"
      ></app-form-field>

      <app-form-field
        label="City"
        [formControlName]="'city'"
        placeholder="Enter your city"
        errorTip="Please input your city!"
      ></app-form-field>

      <app-form-field
        label="Country"
        [formControlName]="'country'"
        placeholder="Enter your country"
        errorTip="Please input your country!"
      ></app-form-field>
    </div>
    }
  `,
})
export class PersonalInfoFormComponent {
  @Input() formGroup!: FormGroup;
}
