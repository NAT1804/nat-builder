import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilderComponent } from '@components/form-builder/form-builder.component';
import { ThemeSelectorComponent } from '@components/theme-selector/theme-selector.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormBuilderComponent, ThemeSelectorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
})
export class HomeComponent {}
