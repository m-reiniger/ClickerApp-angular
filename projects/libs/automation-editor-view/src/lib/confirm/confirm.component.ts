import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';

/**
 * Dialog component for confirming actions.
 */
@Component({
    selector: 'lib-automation-confirm',
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
    templateUrl: './confirm.component.html',
    styleUrl: './confirm.component.css',
})
export class ConfirmComponent {
    public data = inject(MAT_DIALOG_DATA);

    public confirmed(): void {
        if (this.data.actionHandle) {
            this.data.actionHandle.emit(this.data.id);
        }
        if (this.data.closeHandle) {
            this.data.closeHandle.emit();
        }
    }
}
