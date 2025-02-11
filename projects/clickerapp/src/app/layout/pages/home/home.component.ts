import { Component, effect, OnInit, signal, Signal, WritableSignal } from '@angular/core';

import { UiHomeComponent, UiCounters } from 'ui-home';
import { CounterService } from '../../../core/Counter/counter.service';
import { Counters } from '../../../core/Counter/counter.types';

@Component({
    selector: 'app-home',
    imports: [
        UiHomeComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

    public counterList$: WritableSignal<UiCounters> = signal<UiCounters>([]);

    constructor(private counterService: CounterService) { }

    public ngOnInit() {
        const counters = this.counterService.getCounters();
        this.counterList$.set(counters.map(counter => ({
            id: counter.id,
            name: counter.name,
            value: this.counterService.getCounterValue$(counter.id),
            defaultIncrement: counter.defaultIncrement
        })));
    }

    public incrementCounter(id: string): void {
        this.counterService.incrementCounter(id);
    }

    public decrementCounter(id: string): void {
        this.counterService.decrementCounter(id);
    }
}