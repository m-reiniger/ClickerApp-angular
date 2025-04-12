import { environment as defaultEnvironment } from './environment.main';

export const environment = {
    ...defaultEnvironment,
    production: true,

    // admob banner
    adsIsTesting: false,
};
