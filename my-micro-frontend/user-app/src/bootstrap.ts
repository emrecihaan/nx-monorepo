import { bootstrapApplication } from '@angular/platform-browser';
import { registerDevExtremeLicense } from '@my-micro-frontend/shared-core';
import { appConfig } from './app/app.config';
import { RemoteEntryComponent } from './app/remote-entry/entry';
registerDevExtremeLicense();

bootstrapApplication(RemoteEntryComponent, appConfig).catch((err) => console.error(err));
