import { Component, Input, output, signal, Signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { UiCounters } from './types/counters.types';

@Component({
    selector: 'ui-home',
    imports: [
        NgFor,
        NgIf,
        MatButtonModule
    ],
    templateUrl: './ui-home.component.html',
    styleUrl: './ui-home.component.scss'
})
export class UiHomeComponent {

    @Input() title: string = 'My Counters';
    @Input() counterList$: Signal<UiCounters> = signal<UiCounters>([]);

    incrementCounter = output<string>();
    decrementCounter = output<string>();
    navigateToDetail = output<string>();
    addCounter = output<void>();

    constructor() { }

    public incrementCounterHandle(event: Event, id: string) {
        event.stopPropagation();
        this.incrementCounter.emit(id);
    }

    public decrementCounterHandle(event: Event, id: string) {
        event.stopPropagation();
        this.decrementCounter.emit(id);
    }

    public addCounterHandle() {
        this.addCounter.emit();
    }

    public navigateToDetailHandle(id: string) {
        this.navigateToDetail.emit(id);
    }
}
