import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';

const federatedConfigPromise = withModuleFederation(config, { dts: false });

export default async (webpackConfig: any) => {
    const federatedConfig = await federatedConfigPromise;
    const finalConfig = federatedConfig(webpackConfig);

    if (finalConfig.output) {
        finalConfig.output.scriptType = 'module';
    }

    finalConfig.experiments = {
        ...finalConfig.experiments,
        outputModule: true,
    };

    return finalConfig;
};
