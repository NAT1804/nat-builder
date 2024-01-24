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
  ],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.less',
  host: { ngSkipHydration: 'true' },
})
export class FormBuilderComponent {
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

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
}
