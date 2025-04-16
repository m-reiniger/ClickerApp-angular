import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import { HomeViewComponent, HomeViewCounters } from '@libs/home-view';

import { CounterService } from '@app/core/counter/counter.service';

@Component({
    selector: 'app-home-wrapper',
    standalone: true,
    imports: [HomeViewComponent],
    templateUrl: './home-wrapper.component.html',
    styleUrl: './home-wrapper.component.scss',
})
export class HomeWrapperComponent implements OnInit {
    public counterList$: WritableSignal<HomeViewCounters> = signal<HomeViewCounters>([]);

    private counterService = inject(CounterService);
    private router = inject(Router);

    public ngOnInit(): void {
        const counters = this.counterService.getCounterList();
        this.counterList$.set(
            counters.map((counter) => ({
                id: counter.id,
                name: counter.name,
                value: this.counterService.getCounterValue$(counter.id),
                defaultIncrement: counter.defaultIncrement,
                initialValue: counter.initialValue,
                goal: counter.goal !== undefined ? counter.goal : null,
                color: counter.color,
            }))
        );
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

    public navigateToDetail(id: string): void {
        this.router.navigate(['/detail', id]);
    }
}
