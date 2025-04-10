import { Component, Input, output, signal, Signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { UiCounters } from './types/counters.types';

/**
 * Main home screen component that displays a list of counters and their controls.
 *
 * @Input title - The title to display at the top of the screen (default: 'My Counters')
 * @Input counterList$ - A signal containing the list of counters to display
 *
 * @Output incrementCounter - Emits the ID of the counter to increment
 * @Output decrementCounter - Emits the ID of the counter to decrement
 * @Output navigateToDetail - Emits the ID of the counter to view details
 * @Output addCounter - Emits when the add counter button is clicked
 */
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
