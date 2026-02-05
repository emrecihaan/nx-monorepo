import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

import('./bootstrap').catch((err) => console.error(err));
// bootstrapApplication(AppComponent, appConfig).catch((err) =>
//   console.error(err)
// );