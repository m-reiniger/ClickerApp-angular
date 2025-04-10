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
 * Dialog component for confirming counter deletion.
 *
 * @Input data - Dialog data containing:
 *   - id: string - The ID of the counter to delete
 *   - closeHandle: Output<void> - Function to close the dialog
 *   - deleteCounterHandle: Output<string> - Function to trigger counter deletion
 *
 * @Output confirmed - Emits when the user confirms the deletion
 */
@Component({
    selector: 'lib-confirm-delete',
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
    templateUrl: './confirm-delete.component.html',
    styleUrl: './confirm-delete.component.css',
})
export class ConfirmDeleteComponent {
    public data = inject(MAT_DIALOG_DATA);

    public confirmed(): void {
        this.data.deleteCounterHandle.emit(this.data.id);
        this.data.closeHandle.emit();
    }
}
