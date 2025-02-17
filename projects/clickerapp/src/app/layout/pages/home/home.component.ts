import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import { UiHomeComponent, UiCounters } from '@libs/ui-home';
import { CounterService } from '../../../core/Counter/counter.service';

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

    constructor(private counterService: CounterService, private router: Router) { }

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

    public addCounter(): void {
        this.router.navigate(['/create']);
    }
}