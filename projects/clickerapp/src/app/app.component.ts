import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { AdMobService } from '@app/util/ads/ad-mob.service';
import { ColorSchemeService } from '@app/util/color-scheme/color-scheme.service';

import { MainMenuComponent } from '@app/layout/ui-components/main-menu/main-menu.component';

import { environment } from '@app/environments/environment';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatToolbarModule, MatIconModule, MainMenuComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    private adMobService = inject(AdMobService);
    private colorSchemeService = inject(ColorSchemeService);

    public ngOnInit(): void {
        this.colorSchemeService.setUpColorScheme();

        if (environment.adsShowBanner) {
            this.adMobService.initAdMob();
        }
    }
}
