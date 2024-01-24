import { Injectable } from '@angular/core';

export enum ThemeType {
  dark = 'dark',
  default = 'default',
  system = 'auto',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme = ThemeType.default;

  private getThemeType(theme: string): ThemeType {
    if (theme === ThemeType.dark) return ThemeType.dark;
    else if (theme === ThemeType.default) return ThemeType.default;
    else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return ThemeType.dark;
      }
      return ThemeType.default;
    }
  }

  private removeUnusedTheme(theme: ThemeType): void {
    const arrRemoveThemes = Object.values(ThemeType).filter((t) => t !== theme);
    arrRemoveThemes.forEach((removeTheme) => {
      document.documentElement.classList.remove(removeTheme);
      const removedThemeStyle = document.getElementById(removeTheme);
      if (removedThemeStyle) {
        document.head.removeChild(removedThemeStyle);
      }
    });
  }

  private loadCss(href: string, id: string): Promise<Event> {
    return new Promise((resolve, reject) => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = href;
      style.id = id;
      style.onload = resolve;
      style.onerror = reject;
      document.head.append(style);
    });
  }

  public loadTheme(firstLoad = true): Promise<string> {
    const theme = this.getThemeType(
      localStorage.getItem('currentTheme') ?? this.currentTheme
    );
    if (firstLoad) {
      document.documentElement.classList.add(theme);
    }
    return new Promise<string>((resolve, reject) => {
      this.loadCss(`${theme}.css`, theme).then(
        (e) => {
          if (!firstLoad) {
            document.documentElement.classList.add(theme);
          }
          this.removeUnusedTheme(theme);
          resolve(localStorage.getItem('currentTheme') ?? 'default');
        },
        (e) => reject(e)
      );
    });
  }

  public changeTheme(theme: string): Promise<string> {
    localStorage.setItem('currentTheme', theme);
    this.currentTheme = this.getThemeType(theme);
    return this.loadTheme(false);
  }
}
