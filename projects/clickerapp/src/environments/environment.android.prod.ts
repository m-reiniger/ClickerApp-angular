import { environment as defaultEnvironment } from './environment.android';

export const environment = {
    ...defaultEnvironment,
    production: true,

    // admob banner
    adsIsTesting: false,
};
