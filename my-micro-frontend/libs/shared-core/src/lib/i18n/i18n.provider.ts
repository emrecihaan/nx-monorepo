import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider, APP_INITIALIZER } from '@angular/core';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export function initializeI18n(translate: TranslateService) {
    return () => {
        translate.setDefaultLang('tr');
        return translate.use('tr');
    };
}

export const provideSharedTranslation = (): (Provider | EnvironmentProviders)[] => {
    return [
        provideTranslateService(),
        provideTranslateHttpLoader({
            prefix: '/assets/i18n/',
            suffix: '.json'
        }),
        {
            provide: APP_INITIALIZER,
            useFactory: initializeI18n,
            deps: [TranslateService],
            multi: true
        }
    ];
};
