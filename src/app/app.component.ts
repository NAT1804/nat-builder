import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSelectorComponent } from '@components/theme-selector/theme-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeSelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'nat-builder';
}
