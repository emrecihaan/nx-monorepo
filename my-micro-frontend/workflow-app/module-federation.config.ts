import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'workflowApp',
  exposes: {
    './Routes': 'workflow-app/src/app/remote-entry/entry.routes.ts',
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

    if (libraryName.includes('devextreme')) {
      return false;
    }

    return sharedConfig;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
