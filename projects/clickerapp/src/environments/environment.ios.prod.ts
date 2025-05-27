import { environment as defaultEnvironment } from './environment.ios';

export const environment = {
    ...defaultEnvironment,
    production: true,

    // admob banner
    adsIsTesting: false,
};
