import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'user-app',
  exposes: {
    './Routes': 'user-app/src/app/remote-entry/entry.routes.ts',
  },
  shared: (libraryName, sharedConfig) => {
    const isCore = libraryName.startsWith('@angular/') ||
      libraryName.startsWith('rxjs') ||
      libraryName === 'zone.js' ||
      libraryName === 'tslib' ||
      libraryName.startsWith('@ngx-translate/') ||
      libraryName === 'primeng' ||
      libraryName.startsWith('primeng/') ||
      libraryName.startsWith('@primeng/themes') || libraryName === '@my-micro-frontend/shared-core';

    if (isCore) {
      return {
        ...sharedConfig,
        singleton: true,
        strictVersion: false,
        requiredVersion: false,
        eager: true
      };
    }

    // DevExtreme is bundled locally
    if (libraryName.includes('devextreme')) {
      return false;
    }

    return sharedConfig;
  },
};

export default config;
