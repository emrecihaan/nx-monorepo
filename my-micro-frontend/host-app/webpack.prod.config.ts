import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';

/**
 * DTS Plugin is disabled in Nx Workspaces as Nx already provides Typing support for Module Federation
 * The DTS Plugin can be enabled by setting dts: true
 * Learn more about the DTS Plugin here: https://module-federation.io/configure/dts.html
 */
export default withModuleFederation(
  {
    ...config,
    /*
     * Remote overrides for production.
     * Host app is on 4210, User app is on 4212.
     * Replace 'localhost' with your server IP if accessing from outside.
     */
    remotes: [
      ['user-app', 'http://172.28.161.186:4212/remoteEntry.mjs'],
      ['auth-app', 'http://172.28.161.186:4214/remoteEntry.mjs'],
      ['formApp', 'http://172.28.161.186:4215/remoteEntry.mjs'],
      ['workflowApp', 'http://172.28.161.186:4216/remoteEntry.mjs'],
    ],
  },
  { dts: false },
);
