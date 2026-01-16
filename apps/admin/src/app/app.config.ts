import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { HttpContextToken, provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from '../interceptors/http-interceptor';
import { errorInterceptor } from '../interceptors/error-interceptor';
import { authInterceptor } from '../interceptors/auth-interceptor';
import { provideNgxMask } from 'ngx-mask';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';

registerLocaleData(localeTr)

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideNgxMask(),
    provideHttpClient(withInterceptors([
      httpInterceptor,
      authInterceptor,
      errorInterceptor])),
    { provide: LOCALE_ID, useValue: 'tr-TR' },
  ],
};

export const SKIP_ERROR_HANDLER = new HttpContextToken<boolean>(() => false);
