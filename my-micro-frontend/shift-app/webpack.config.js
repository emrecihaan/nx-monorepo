const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const { join } = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

// Prevent Nx host-app environment variables from leaking into the remote's webpack config
delete process.env.NX_BUILD_TARGET;
process.env.NX_TASK_TARGET_PROJECT = 'shiftApp';

module.exports = {
  output: {
    path: join(__dirname, '../dist/shift-app'),
    clean: true,
    publicPath: 'auto',
  },
  experiments: {
    outputModule: true,
  },
  devServer: {
    port: 4217,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: [],
      styles: [],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    new NxReactWebpackPlugin({}),
    new ModuleFederationPlugin({
      name: 'shiftApp',
      filename: 'remoteEntry.mjs',
      library: { type: 'module' },
      exposes: {
        './Module': './src/bootstrap.tsx',
      },
      shared: {
        react: { singleton: true, eager: false, requiredVersion: false },
        'react-dom': { singleton: true, eager: false, requiredVersion: false },
        'react-router-dom': { singleton: true, eager: false, requiredVersion: false },
      },
    }),
  ],
};
