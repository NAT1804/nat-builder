import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SKILL_LEVEL_OPTIONS } from '@models/resume.model';
import { NG_ZORRO_MODULES } from '@shared/ng-zorro.module';
import { DateRangeComponent } from '../date-range/date-range.component';
import { FormFieldComponent } from '../form-field/form-field.component';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'rich-text' | 'radio' | 'date-range';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: any }[];
}

export interface ArraySectionConfig {
  title: string;
  fields: FormFieldConfig[];
  headerTemplate?: (formGroup: FormGroup) => string;
  addButtonText: string;
}

@Component({
  selector: 'app-array-form-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...NG_ZORRO_MODULES,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    CdkDragPlaceholder,
    FormFieldComponent,
    DateRangeComponent,
  ],
  template: `
    <nz-collapse
      cdkDropList
      [cdkDropListData]="formArray.controls"
      (cdkDropListDropped)="onDrop($event)"
      class="collapse-list"
      nzExpandIconPosition="start"
    >
      @for (control of formArray.controls; track control.value; let i = $index)
      {
      <nz-collapse-panel
        [formGroup]="$any(control)"
        [nzHeader]="getHeaderText(i)"
        cdkDrag
        [nzExtra]="extraTpl"
        class="collapse-box"
      >
        <div class="collapse-custom-placeholder" *cdkDragPlaceholder></div>
        <nz-card>
          @if (getFormGroupAt(i); as formGroup) { @for (field of config.fields;
          track field.name) { @switch (field.type) { @case ('date-range') {
          <app-date-range
            [formGroup]="formGroup"
            [label]="field.label"
          ></app-date-range>
          } @case ('radio') {
          <nz-form-item>
            <nz-form-label [nzSpan]="24">{{ field.label }}</nz-form-label>
            <nz-form-control [nzSpan]="24">
              <nz-radio-group [formControlName]="field.name">
                @for (option of field.options; track option.value) {
                <label nz-radio-button [nzValue]="option.value">
                  {{ option.label }}
                </label>
                }
              </nz-radio-group>
            </nz-form-control>
          </nz-form-item>
          } @default {
          <app-form-field
            [label]="field.label"
            [type]="field.type"
            [formControlName]="field.name"
            [placeholder]="field.placeholder || ''"
          ></app-form-field>
          } } }

          <button nz-button nzType="text" nzDanger (click)="removeItem(i)">
            <span nz-icon nzType="delete"></span>
            Remove
          </button>
          }
        </nz-card>

        <div *cdkDragPreview>
          <nz-collapse-panel
            [nzHeader]="getHeaderText(i)"
            class="collapse-box"
          ></nz-collapse-panel>
        </div>

        <ng-template #extraTpl>
          <div cdkDragHandle class="collapse-drag-handle">
            <span nz-icon nzType="drag"></span>
          </div>
        </ng-template>
      </nz-collapse-panel>
      }
    </nz-collapse>
    <div class="add-button-container">
      <button nz-button nzType="dashed" (click)="addItem()">
        <span nz-icon nzType="plus"></span>
        {{ config.addButtonText }}
      </button>
    </div>
  `,
  styleUrls: ['../../form-data-entry.component.less'],
})
export class ArrayFormSectionComponent {
  @Input() formArray!: FormArray;
  @Input() config!: ArraySectionConfig;
  @Output() addItemEvent = new EventEmitter<void>();
  @Output() removeItemEvent = new EventEmitter<number>();

  readonly skillLevelOptions = SKILL_LEVEL_OPTIONS;

  getFormGroupAt(index: number): FormGroup | null {
    if (!this.formArray || index >= this.formArray.length || index < 0) {
      return null;
    }
    return this.formArray.at(index) as FormGroup;
  }

  getHeaderText(index: number): string {
    const formGroup = this.getFormGroupAt(index);

    if (!formGroup) {
      return '(Not specified)';
    }

    if (this.config.headerTemplate) {
      return this.config.headerTemplate(formGroup);
    }

    // Default header logic
    const firstField = this.config.fields[0];
    const secondField = this.config.fields[1];

    const firstValue = formGroup.get(firstField?.name)?.value;
    const secondValue = secondField
      ? formGroup.get(secondField.name)?.value
      : '';

    if (firstValue || secondValue) {
      return `${firstValue || ''} ${
        secondValue ? 'at ' + secondValue : ''
      }`.trim();
    }

    return '(Not specified)';
  }

  addItem() {
    this.addItemEvent.emit();
  }

  removeItem(index: number) {
    this.removeItemEvent.emit(index);
  }

  onDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.formArray.controls,
      event.previousIndex,
      event.currentIndex
    );
    this.formArray.updateValueAndValidity();
  }
}
