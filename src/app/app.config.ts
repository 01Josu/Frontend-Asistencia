import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';

export const appConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient()
  ]
};
