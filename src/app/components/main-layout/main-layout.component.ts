import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSelectorComponent } from '@components/theme-selector/theme-selector.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, NzLayoutModule, RouterOutlet, ThemeSelectorComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.less',
})
export class MainLayoutComponent {}
