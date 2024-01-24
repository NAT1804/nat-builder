import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { AppInitializerProvider } from './services/initializer/app-initializer.service';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // provideNzI18n(en_US),
    // AppInitializerProvider,
    provideNoopAnimations(),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
