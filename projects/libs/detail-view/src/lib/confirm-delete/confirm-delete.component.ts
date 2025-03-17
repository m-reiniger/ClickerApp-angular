import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'confirm-delete',
    imports: [
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent
    ],
    templateUrl: './confirm-delete.component.html',
    styleUrl: './confirm-delete.component.css'
})
export class ConfirmDeleteComponent {
    
    data = inject(MAT_DIALOG_DATA);

    public confirmed() {
        this.data.deleteCounterHandle.emit(this.data.id);
        this.data.closeHandle.emit();
    }

}
