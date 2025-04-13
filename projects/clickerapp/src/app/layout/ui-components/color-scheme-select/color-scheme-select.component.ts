import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

import { ColorSchemeService } from '@app/util/color-scheme/color-scheme.service';

@Component({
    selector: 'app-color-scheme-select',
    standalone: true,
    imports: [MatButtonModule, FormsModule, MatDialogModule, MatRadioModule],
    templateUrl: './color-scheme-select.component.html',
    styleUrl: './color-scheme-select.component.scss',
})
export class ColorSchemeSelectComponent implements OnInit {
    private dialogRef = inject(MatDialogRef<ColorSchemeSelectComponent>);
    private colorSchemeService = inject(ColorSchemeService);

    public selectedScheme: 'light' | 'dark' | 'system' = 'system';

    public ngOnInit(): void {
        this.selectedScheme = this.colorSchemeService.getUserPreferedColorScheme() as
            | 'light'
            | 'dark'
            | 'system';
    }

    public onCancel(): void {
        this.dialogRef.close();
    }

    public onApply(): void {
        this.colorSchemeService.saveUserPreferedColorScheme(this.selectedScheme);
        this.colorSchemeService.setUpColorScheme();
        this.dialogRef.close();
    }
}
