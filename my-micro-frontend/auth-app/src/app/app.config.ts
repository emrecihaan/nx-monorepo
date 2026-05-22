import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    provideSharedTranslation,
    provideDevExtreme,
    authInterceptor,
    errorInterceptor,
} from '@my-micro-frontend/shared-core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(appRoutes, withHashLocation()),
        provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
        provideSharedTranslation(),
        provideDevExtreme(),
        provideAnimations(),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
        MessageService
    ],
};
