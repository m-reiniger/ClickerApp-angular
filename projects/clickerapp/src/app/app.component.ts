import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';

import { MainMenuComponent } from '@app/layout/ui-components/main-menu/main-menu.component';

import { environment } from '@app/environments/environment';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatToolbarModule, MatIconModule, MainMenuComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    public ngOnInit(): void {
        if (environment.adsShowBanner) {
            this.initAdMob();
        }
    }

    private async initAdMob(): Promise<void> {
        const adId = environment.adsAdId;

        await AdMob.initialize({ initializeForTesting: environment.adsIsTesting });

        const trackingInfo = await AdMob.trackingAuthorizationStatus();

        if (trackingInfo.status === 'notDetermined') {
            await AdMob.requestTrackingAuthorization();
        }

        const options: BannerAdOptions = {
            adId: adId,
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: environment.adsIsTesting,
            // npa: true
        };
        await AdMob.showBanner(options);
    }
}
