import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NG_ZORRO_MODULES } from '@shared/ng-zorro.module';
import { QuillModule } from 'ngx-quill';

export type FormFieldType =
  | 'text'
  | 'email'
  | 'textarea'
  | 'rich-text'
  | 'date'
  | 'month';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ...NG_ZORRO_MODULES,
    QuillModule,
  ],
  template: `
    <nz-form-item>
      <nz-form-label [nzSm]="labelSpan" [nzXs]="labelSpan">{{
        label
      }}</nz-form-label>
      <nz-form-control
        [nzSm]="controlSpan"
        [nzXs]="controlSpan"
        [nzErrorTip]="errorTip"
      >
        @switch (type) { @case ('email') {
        <input
          nz-input
          type="email"
          [placeholder]="placeholder"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [disabled]="disabled"
        />
        } @case ('textarea') {
        <textarea
          nz-input
          [placeholder]="placeholder"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [disabled]="disabled"
          [nzAutosize]="autosize"
        ></textarea>
        } @case ('rich-text') {
        <quill-editor
          [ngModel]="value"
          (ngModelChange)="onChange($event)"
          (onBlur)="onTouched()"
          [readOnly]="disabled"
          [modules]="quillConfig"
        ></quill-editor>
        } @case ('date') {
        <nz-date-picker
          [ngModel]="value"
          (ngModelChange)="onChange($event)"
          (nzOnBlur)="onTouched()"
          [nzDisabled]="disabled"
          [nzPlaceHolder]="placeholder"
        ></nz-date-picker>
        } @case ('month') {
        <nz-date-picker
          [ngModel]="value"
          (ngModelChange)="onChange($event)"
          (nzOnBlur)="onTouched()"
          [nzDisabled]="disabled"
          [nzPlaceHolder]="placeholder"
          nzMode="month"
        ></nz-date-picker>
        } @default {
        <input
          nz-input
          type="text"
          [placeholder]="placeholder"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [disabled]="disabled"
        />
        } }
      </nz-form-control>
    </nz-form-item>
  `,
  styles: [
    `
      nz-form-label {
        text-align: left;
      }

      quill-editor {
        width: 100%;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true,
    },
  ],
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: FormFieldType = 'text';
  @Input() placeholder = '';
  @Input() errorTip = '';
  @Input() labelSpan = 24;
  @Input() controlSpan = 24;
  @Input() autosize = { minRows: 3, maxRows: 6 };

  value: any = '';
  disabled = false;

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
      ],
    },
    'emoji-toolbar': false,
    'emoji-textarea': false,
    'emoji-shortname': false,
  };

  onChange = (value: any) => {};
  onTouched = () => {};

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
