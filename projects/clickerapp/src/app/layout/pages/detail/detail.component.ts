import { Component, inject, OnInit, signal, computed, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CounterDetail, DetailViewComponent } from '@libs/detail-view';

import { CounterService } from '@app/core/counter/counter.service';

@Component({
    selector: 'app-detail',
    imports: [
        DetailViewComponent
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

    private activatedRoute = inject(ActivatedRoute);
    private counterService = inject(CounterService);
    private router = inject(Router);

    public counter$: Signal<CounterDetail | undefined> = signal<CounterDetail | undefined>(undefined);
    public counterValue$: Signal<number> = signal(0);


    ngOnInit() {
        const counterId = this.activatedRoute.snapshot.params['counterId'];
        const counter$ = this.counterService.getCounter$(counterId);
        this.counter$ = computed(() => ({
            id: counter$().id,
            name: counter$().name,
            defaultIncrement: counter$().defaultIncrement
        }));
        this.counterValue$ = this.counterService.getCounterValue$(counter$().id);
    }

    public closeOverlay() {
        this.router.navigate(['/']);
    }

    public editCounter(id: string | undefined) {
        if (id) {
            this.router.navigate(['edit', id]);
        }
    }

    public incrementCounter(id: string | undefined): void {
        if (id) {
            this.counterService.incrementCounter(id);
        }
    }

    public decrementCounter(id: string | undefined): void {
        if (id) {
            this.counterService.decrementCounter(id);
        }
    }

    public deleteCounter(id: string): void {
        if (id) {
            this.counterService.deleteCounter(id);
        }
    }
}
