import { Injectable } from '@angular/core';

import { BannerAdPosition, BannerAdSize, BannerAdOptions, AdMob } from '@capacitor-community/admob';

import { environment } from '@app/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AdMobService {
    private adId: string;
    private isTesting: boolean;

    constructor() {
        this.adId = environment.adsAdId;
        this.isTesting = environment.adsIsTesting;
    }

    public async initAdMob(): Promise<void> {
        await AdMob.initialize({ initializeForTesting: this.isTesting });

        const trackingInfo = await AdMob.trackingAuthorizationStatus();

        if (trackingInfo.status === 'notDetermined') {
            await AdMob.requestTrackingAuthorization();
        }

        const options: BannerAdOptions = {
            adId: this.adId,
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: this.isTesting,
            // npa: true
        };
        await AdMob.showBanner(options);
    }
}
