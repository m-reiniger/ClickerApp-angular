import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ColorSchemeSelectComponent } from './color-scheme-select.component';

@Injectable({
    providedIn: 'root',
})
export class ColorSchemeSelectService {
    constructor(private dialog: MatDialog) {}

    public openDialog(): void {
        this.dialog.open(ColorSchemeSelectComponent, {
            width: '300px',
        });
    }
}
