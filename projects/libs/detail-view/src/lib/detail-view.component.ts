import { Component, inject, Input, output, Signal, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { CounterDetail } from './types/counter-detail.types';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';

@Component({
    selector: 'detail-view',
    imports: [
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './detail-view.component.html',
    styleUrl: './detail-view.component.scss'
})
export class DetailViewComponent {

    readonly dialog = inject(MatDialog);

    @Input() counterDetail: Signal<CounterDetail | undefined> = signal<CounterDetail | undefined>(undefined);
    @Input() counterValue: Signal<number> = signal(0);

    public incrementCounter = output<string | undefined>();
    public decrementCounter = output<string | undefined>();
    public editCounter = output<string | undefined>();
    public deleteCounter = output<string>();

    public closeOverlay = output<void>();

    public close() {
        this.closeOverlay.emit();
    }

    public incrementCounterHandle(event: Event, id: string | undefined) {
        event.stopPropagation();
        this.incrementCounter.emit(id);
    }

    public decrementCounterHandle(event: Event, id: string | undefined) {
        event.stopPropagation();
        this.decrementCounter.emit(id);
    }

    public editCounterHandle(event: Event, id: string | undefined) {
        event.stopPropagation();
        this.editCounter.emit(id);
    }

    public confirmDelete() {
        this.dialog.open(ConfirmDeleteComponent, {
            data: {
                closeHandle: this.closeOverlay,
                deleteCounterHandle: this.deleteCounter,
                id: this.counterDetail()?.id
            }
        });
    }

}
