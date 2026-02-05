import config from 'devextreme/core/config';
import { DEVE_EXTREME_LICENSE_KEY } from './license';

export function setupDevExtreme() {
    config({
        licenseKey: DEVE_EXTREME_LICENSE_KEY,
        // Diğer global ayarları buraya ekleyebilirsiniz
        rtlEnabled: false,
        floatingActionButtonConfig: { icon: 'add' }
    });
    console.log('DevExtreme license applied.');
}
