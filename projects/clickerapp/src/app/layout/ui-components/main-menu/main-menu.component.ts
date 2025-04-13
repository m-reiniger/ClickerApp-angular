import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { ColorSchemeSelectService } from '@app/layout/ui-components/color-scheme-select/color-scheme-select.service';

@Component({
    selector: 'app-main-menu',
    imports: [MatIconModule, MatMenuModule, MatButtonModule],
    templateUrl: './main-menu.component.html',
    styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent {
    private colorSchemeSelectService = inject(ColorSchemeSelectService);
    private router = inject(Router);

    public openColorSchemeSelect(): void {
        this.colorSchemeSelectService.openDialog();
    }

    public navigateToAbout(): void {
        this.router.navigate(['/about']);
    }
}
