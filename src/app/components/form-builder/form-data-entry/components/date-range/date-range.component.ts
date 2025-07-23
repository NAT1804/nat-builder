import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NG_ZORRO_MODULES } from '@shared/ng-zorro.module';

@Component({
  selector: 'app-date-range',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...NG_ZORRO_MODULES],
  template: `
    <nz-form-item [formGroup]="formGroup">
      <nz-form-label [nzSpan]="labelSpan">{{ label }}</nz-form-label>
      <nz-form-control [nzSpan]="controlSpan">
        <nz-date-picker
          [formControlName]="startDateControlName"
          [nzMode]="mode"
          [nzPlaceHolder]="startPlaceholder"
        ></nz-date-picker>
        &nbsp;
        <nz-date-picker
          [formControlName]="endDateControlName"
          [nzMode]="mode"
          [nzPlaceHolder]="endPlaceholder"
        ></nz-date-picker>
      </nz-form-control>
    </nz-form-item>
  `,
})
export class DateRangeComponent {
  @Input() formGroup!: FormGroup;
  @Input() startDateControlName = 'startDate';
  @Input() endDateControlName = 'endDate';
  @Input() label = 'Start & End Date';
  @Input() startPlaceholder = 'Start Date';
  @Input() endPlaceholder = 'End Date';
  @Input() mode: 'date' | 'month' = 'month';
  @Input() labelSpan = 24;
  @Input() controlSpan = 24;
}
