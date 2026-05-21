import 'zone.js';
import { registerDevExtremeLicense } from '@my-micro-frontend/shared-core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

registerDevExtremeLicense();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
