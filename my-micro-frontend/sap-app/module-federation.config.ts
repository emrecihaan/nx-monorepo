import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'sap-app',
  exposes: {
    './Routes': 'sap-app/src/app/remote-entry/entry.routes.ts',
  },
  shared: (libraryName, sharedConfig) => {
    const isShared = libraryName.startsWith('@angular/') ||
      libraryName.startsWith('rxjs') ||
      libraryName === 'zone.js' ||
      libraryName === 'tslib' ||
      libraryName === '@ngx-translate/core' ||
      libraryName === '@my-micro-frontend/shared-core' ||
      libraryName === 'primeng' ||
      libraryName.startsWith('primeng/') ||
      libraryName === '@primeng/themes' ||
      libraryName.startsWith('@primeng/themes/') ||
      libraryName === 'devextreme' ||
      libraryName.startsWith('devextreme/') ||
      libraryName === 'devextreme-angular' ||
      libraryName.startsWith('devextreme-angular/');

    if (isShared) {
      const isEager = libraryName.startsWith('@angular/') ||
        libraryName === 'zone.js' ||
        libraryName.startsWith('rxjs') ||
        libraryName === 'devextreme' ||
        libraryName.startsWith('devextreme/') ||
        libraryName === 'devextreme-angular' ||
        libraryName.startsWith('devextreme-angular/');

      return {
        ...sharedConfig,
        singleton: true,
        strictVersion: false,
        requiredVersion: false,
        eager: isEager
      };
    }
    return sharedConfig;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
