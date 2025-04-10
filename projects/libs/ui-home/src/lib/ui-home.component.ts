import { Component, Input, output, signal, Signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { UiCounters } from './types/counters.types';

@Component({
    selector: 'lib-ui-home',
    imports: [NgFor, NgIf, MatButtonModule],
    templateUrl: './ui-home.component.html',
    styleUrl: './ui-home.component.scss',
})
export class UiHomeComponent {
    @Input() public title = 'My Counters';
    @Input() public counterList$: Signal<UiCounters> = signal<UiCounters>([]);

    public incrementCounter = output<string>();
    public decrementCounter = output<string>();
    public navigateToDetail = output<string>();
    public addCounter = output<void>();

    public incrementCounterHandle(event: Event, id: string): void {
        event.stopPropagation();
        this.incrementCounter.emit(id);
    }

    public decrementCounterHandle(event: Event, id: string): void {
        event.stopPropagation();
        this.decrementCounter.emit(id);
    }

    public addCounterHandle(): void {
        this.addCounter.emit();
    }

    public navigateToDetailHandle(id: string): void {
        this.navigateToDetail.emit(id);
    }
}
