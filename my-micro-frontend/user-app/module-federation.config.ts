import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'user-app',
  exposes: {
    './Routes': 'user-app/src/app/remote-entry/entry.routes.ts',
  },
  shared: (libraryName, sharedConfig) => {
    // ngx-translate'in tüm uygulamalarda tek bir instance olmasını sağlıyoruz
    if (libraryName === '@ngx-translate/core') {
      return {
        ...sharedConfig,
        singleton: true,
        strictVersion: false,
        requiredVersion: false,
      };
    }
    // Diğer kütüphaneler için varsayılan ayarları koru
    return sharedConfig;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
