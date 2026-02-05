import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RemoteEntryComponent } from './app/remote-entry/entry';
import { setupDevExtreme } from '@my-micro-frontend/shared-core';

setupDevExtreme();

bootstrapApplication(RemoteEntryComponent, appConfig).catch((err) => console.error(err));
