import { Component, effect, Input, output, signal, Signal } from '@angular/core';
import { NgFor } from '@angular/common';

import { UiCounters } from './types/counters.types';

@Component({
    selector: 'ui-home',
    imports: [
        NgFor
    ],
    templateUrl: './ui-home.component.html',
    styleUrl: './ui-home.component.scss'
})
export class UiHomeComponent {

    @Input() counterList$: Signal<UiCounters> = signal<UiCounters>([]);

    incrementCounter = output<string>();
    decrementCounter = output<string>();

    constructor() { }

    public incrementCounterHandle(id: string) {
        this.incrementCounter.emit(id);
    }

    public decrementCounterHandle(id: string) {
        this.decrementCounter.emit(id);
    }
}
