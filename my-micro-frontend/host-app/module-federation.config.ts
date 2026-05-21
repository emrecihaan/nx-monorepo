import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'host-app',
  // Localde çalışırken Nx'in projeleri otomatik keşfetmesi için sadece isimlerini veriyoruz.
  // IP tanımları webpack.prod.config.ts içerisinde production build için geçerlidir.
  remotes: ['user-app', 'auth-app', 'workflowApp', 'formApp'],
  shared: (libraryName, sharedConfig) => {
    const isCore = libraryName.startsWith('@angular/') ||
      libraryName.startsWith('rxjs') ||
      libraryName === 'zone.js' ||
      libraryName === 'tslib' ||
      libraryName.startsWith('@ngx-translate/') ||
      libraryName === 'primeng' ||
      libraryName.startsWith('primeng/') ||
      libraryName.startsWith('@primeng/themes');

    if (isCore) {
      return {
        ...sharedConfig,
        singleton: true,
        strictVersion: false,
        requiredVersion: false,
        eager: true // Prod ortamında 'Class extends value undefined' hatasını önlemek için true olmalı
      };
    }

    if (libraryName.includes('devextreme')) {
      return false;
    }

    return sharedConfig;
  },
};

export default config;
