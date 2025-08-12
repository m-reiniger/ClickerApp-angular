import { Component, inject, OnInit, signal, computed, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DetailViewCounter, DetailViewComponent } from '@libs/detail-view';

import { AutomationService } from '@app/core/automation/automation.service';
import { CounterService } from '@app/core/counter/counter.service';

@Component({
    selector: 'app-detail-wrapper',
    imports: [DetailViewComponent],
    templateUrl: './detail-wrapper.component.html',
    styleUrl: './detail-wrapper.component.scss',
})
export class DetailWrapperComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    private counterService = inject(CounterService);
    private automationService = inject(AutomationService);
    private router = inject(Router);

    public counter$: Signal<DetailViewCounter | undefined> = signal<DetailViewCounter | undefined>(
        undefined
    );
    public counterValue$: Signal<number> = signal(0);
    public nextAutomationRun: Date | null = null;

    public ngOnInit(): void {
        const counterId = this.activatedRoute.snapshot.params['counterId'];
        if (counterId) {
            const counter$ = this.counterService.getCounter$(counterId);
            if (counter$) {
                this.counter$ = computed(() => ({
                    id: counter$().id,
                    name: counter$().name,
                    defaultIncrement: counter$().defaultIncrement,
                    initialValue: counter$().initialValue,
                    goal: counter$().goal,
                    color: counter$().color,
                }));
                this.counterValue$ = this.counterService.getCounterValue$(counter$().id);
                this.nextAutomationRun = this.automationService.getNextAutomationRun(counter$().id);
            }
        }
    }

    public closeOverlay(): void {
        this.router.navigate(['/']);
    }

    public editCounter(id: string | undefined): void {
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

    public resetCounter(options: { id: string | undefined; keepHistory: boolean }): void {
        if (options.id) {
            this.counterService.resetCounter(options.id, options.keepHistory);
        }
    }

    public showHistory(id: string | undefined): void {
        if (id) {
            this.router.navigate(['history', id]);
        }
    }

    public editAutomations(id: string | undefined): void {
        if (id) {
            this.router.navigate(['automation', id]);
        }
    }
}
