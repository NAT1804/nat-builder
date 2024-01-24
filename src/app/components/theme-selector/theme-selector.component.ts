import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ThemeService } from '@services/theme/theme.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'nat-theme-selector',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzDropDownModule, NzIconModule],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.less',
})
export class ThemeSelectorComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  isBrowser = false;
  currentTheme = 'default';

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.themeService.loadTheme().then((currTheme) => {
        this.currentTheme = currTheme;
      });
    }
  }

  setTheme(event: any, theme: string) {
    event.preventDefault();
    this.themeService.changeTheme(theme).then((currTheme) => {
      this.currentTheme = currTheme;
    });
  }
}
