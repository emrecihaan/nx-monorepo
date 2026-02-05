import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'host-app',
  /**
   * Production URLs for IIS deployment:
   * - user-app: http://your-server:4212
   * - sap-app: http://your-server:4213 (adjust as needed)
   * 
   * For development, Nx will use localhost ports automatically.
   * For production, update these URLs to match your server.
   */
  remotes: [
    ['user-app', 'http://localhost:4212/remoteEntry.mjs'],
    ['sap-app', 'http://localhost:4213/remoteEntry.mjs']
  ],
  shared: (libraryName, sharedConfig) => {
    // ngx-translate servisinin tüm workspace'te tek bir "hafızası" olmasını sağlar
    if (libraryName === '@ngx-translate/core') {
      return {
        ...sharedConfig,
        singleton: true,
        strictVersion: false, // Allow version flexibility to avoid conflicts
        requiredVersion: false,
      };
    }
    // Diğer kütüphaneler için (Angular Core vb.) Nx'in varsayılan ayarlarını koru
    return sharedConfig;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
