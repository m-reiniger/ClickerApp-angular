import { Component, inject, OnInit, signal, computed, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

    public counter$: Signal<CounterDetail | undefined> = signal<CounterDetail | undefined>(undefined);
    public counterValue$: Signal<number> = signal(0);


    private activatedRoute = inject(ActivatedRoute);
    private counterService = inject(CounterService);

    ngOnInit() {
        const counterId = this.activatedRoute.snapshot.params['counterId'];
        const counter$ = this.counterService.getCounter$(counterId);
        this.counter$ = computed(() => ({
            id: counter$().id,
            name: counter$().name,
        }));
        this.counterValue$ = this.counterService.getCounterValue$(counter$().id);
    }
}
