import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { setupDevExtreme } from '@my-micro-frontend/shared-core';

setupDevExtreme();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
