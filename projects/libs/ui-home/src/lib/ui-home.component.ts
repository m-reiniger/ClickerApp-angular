import { Component, Input, output, signal, Signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { UiCounters } from './types/counters.types';

@Component({
    selector: 'ui-home',
    imports: [
        NgFor,
        MatButtonModule
    ],
    templateUrl: './ui-home.component.html',
    styleUrl: './ui-home.component.scss'
})
export class UiHomeComponent {

    @Input() counterList$: Signal<UiCounters> = signal<UiCounters>([]);

    incrementCounter = output<string>();
    decrementCounter = output<string>();
    addCounter = output<void>();

    constructor() { }

    public incrementCounterHandle(id: string) {
        this.incrementCounter.emit(id);
    }

    public decrementCounterHandle(id: string) {
        this.decrementCounter.emit(id);
    }

    public addCounterHandle() {
        this.addCounter.emit();
    }
}
