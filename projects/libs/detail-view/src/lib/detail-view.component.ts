import { Component, inject, Input, output, Signal, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { CounterDetail } from './types/counter-detail.types';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';

/**
 * Component that displays detailed information about a counter and provides controls for manipulation.
 *
 * @Input counterDetail - Signal containing the counter details to display
 * @Input counterValue - Signal containing the current value of the counter
 *
 * @Output incrementCounter - Emits the counter ID when increment button is clicked
 * @Output decrementCounter - Emits the counter ID when decrement button is clicked
 * @Output editCounter - Emits the counter ID when edit button is clicked
 * @Output deleteCounter - Emits the counter ID when delete button is clicked
 * @Output closeOverlay - Emits when the detail view is closed
 */
@Component({
    selector: 'lib-detail-view',
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './detail-view.component.html',
    styleUrl: './detail-view.component.scss',
})
export class DetailViewComponent {
    private readonly dialog = inject(MatDialog);

    @Input() public counterDetail: Signal<CounterDetail | undefined> = signal<
        CounterDetail | undefined
    >(undefined);
    @Input() public counterValue: Signal<number> = signal(0);

    public incrementCounter = output<string | undefined>();
    public decrementCounter = output<string | undefined>();
    public editCounter = output<string | undefined>();
    public deleteCounter = output<string>();
    public closeOverlay = output<void>();

    public close(): void {
        this.closeOverlay.emit();
    }

    public incrementCounterHandle(event: Event, id: string | undefined): void {
        event.stopPropagation();
        this.incrementCounter.emit(id);
    }

    public decrementCounterHandle(event: Event, id: string | undefined): void {
        event.stopPropagation();
        this.decrementCounter.emit(id);
    }

    public editCounterHandle(event: Event, id: string | undefined): void {
        event.stopPropagation();
        this.editCounter.emit(id);
    }

    public confirmDelete(): void {
        this.dialog.open(ConfirmDeleteComponent, {
            data: {
                closeHandle: this.closeOverlay,
                deleteCounterHandle: this.deleteCounter,
                id: this.counterDetail()?.id,
            },
        });
    }
}
