import { Component, Input, output, Signal, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CounterDetail } from './types/counter-detail.types';

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

    @Input() counterDetail: Signal<CounterDetail | undefined> = signal<CounterDetail | undefined>(undefined);
    @Input() counterValue: Signal<number> = signal(0);

    public closeOverlay = output<void>();

    public close() {
        this.closeOverlay.emit();
    }

    public incrementCounterHandle(event: Event, id: string | undefined) {
        event.stopPropagation();
        // this.incrementCounter.emit(id);
    }

    public decrementCounterHandle(event: Event, id: string | undefined) {
        event.stopPropagation();
        // this.decrementCounter.emit(id);
    }

}
