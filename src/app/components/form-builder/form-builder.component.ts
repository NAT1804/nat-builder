import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzListModule } from 'ng-zorro-antd/list';
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { UploadFileComponent } from '@components/common/upload-file/upload-file.component';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '@components/common/input/input.component';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzListModule,
    NzIconModule,
    NzNotificationModule,
    CdkDropList,
    CdkDrag,
    UploadFileComponent,
    ReactiveFormsModule,
    InputComponent,
  ],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.less',
  host: { ngSkipHydration: 'true' },
})
export class FormBuilderComponent {
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  private readonly fb = inject(NonNullableFormBuilder);

  constructor() {}

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  registrationForm = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        // Validators.minLength(2),
        // Validators.pattern('^[_A-z0-9]*((-|s)*[_A-z0-9])*$'),
      ],
    ],
  });

  // Submit Registration Form
  onSubmit() {
    console.log(this.registrationForm);
    if (!this.registrationForm.valid) {
      return false;
    } else {
      console.log(this.registrationForm.value);
      return true;
    }
  }
}
