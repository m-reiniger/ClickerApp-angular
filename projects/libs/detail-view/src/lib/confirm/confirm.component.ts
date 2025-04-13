import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';

/**
 * Dialog component for confirming actions.
 *
 * @Input data - Dialog data containing:
 *   - id: string - The ID of the counter
 *   - closeHandle: Output<void> - Function to close the dialog
 *   - deleteCounterHandle: Output<string> - Function to trigger counter deletion
 *   - resetCounterHandle: Output<string> - Function to trigger counter reset
 *
 * @Output confirmed - Emits when the user confirms the action
 */
@Component({
    selector: 'lib-confirm',
    imports: [
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
        MatCheckboxModule,
        FormsModule,
    ],
    templateUrl: './confirm.component.html',
    styleUrl: './confirm.component.css',
})
export class ConfirmComponent {
    public data = inject(MAT_DIALOG_DATA);
    public keepHistory = true;

    public confirmed(): void {
        if (this.data.actionHandle) {
            this.data.actionHandle.emit(
                this.data.askToKeepHistory
                    ? { id: this.data.id, keepHistory: this.keepHistory }
                    : this.data.id
            );
        }
        if (this.data.closeHandle) {
            this.data.closeHandle.emit();
        }
    }
}
