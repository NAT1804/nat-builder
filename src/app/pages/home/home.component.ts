import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilderComponent } from '@components/form-builder/form-builder.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormBuilderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
})
export class HomeComponent {}
