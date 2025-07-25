import { Injectable } from '@angular/core';
import { SvgConfig } from '@models/svg.model';

@Injectable({
  providedIn: 'root',
})
export class FontConfigService {
  private defaultConfig: SvgConfig = {
    page: {
      width: 210, // A4 in mm
      height: 297,
      margins: { top: 10, right: 10, bottom: 10, left: 10 },
      enablePageSplitting: true,
    },
    fonts: {
      family: 'Courier New, monospace',
      sizes: {
        small: 3,
        default: 5,
        large: 8,
      },
      lineHeights: {
        small: 1,
        default: 1.2,
        large: 1.4,
      },
    },
    colors: {
      primary: '#2c3e50',
      text: '#333333',
      divider: '#e0e0e0',
    },
    spacing: {
      sectionGap: 10,
      elementGap: 5,
      lineGap: 3,
    },
  };

  getDefaultConfig(): SvgConfig {
    return { ...this.defaultConfig };
  }

  updateFontConfig(
    config: SvgConfig,
    fontFamily?: string,
    baseFontSize?: number
  ): SvgConfig {
    const updatedConfig = { ...config };

    if (fontFamily) {
      updatedConfig.fonts.family = fontFamily;
    }

    if (baseFontSize) {
      // Scale all font sizes proportionally
      const scale = baseFontSize / config.fonts.sizes.default;
      updatedConfig.fonts.sizes = {
        small: config.fonts.sizes.small * scale,
        default: baseFontSize,
        large: config.fonts.sizes.large * scale,
      };
    }

    return updatedConfig;
  }

  getAvailableFonts() {
    return [
      {
        label: 'Courier New, monospace',
        value: 'Courier New, monospace',
      },
      {
        label: 'Arial, sans-serif',
        value: 'Arial, sans-serif',
      },
      {
        label: 'Times New Roman, serif',
        value: 'Times New Roman, serif',
      },
      {
        label: 'Helvetica, sans-serif',
        value: 'Helvetica, sans-serif',
      },
    ];
  }
}
