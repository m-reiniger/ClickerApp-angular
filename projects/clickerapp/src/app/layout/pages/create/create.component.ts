import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CounterForm, CounterFormComponent } from '@libs/counter-form';

import { CounterService } from '@app/core/counter/counter.service';
import { TransactionOperation } from '@app/core/transaction/transaction.type';

@Component({
    selector: 'app-create',
    imports: [CounterFormComponent],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit {
    public editCounter: CounterForm | undefined = undefined;

    private activatedRoute = inject(ActivatedRoute);
    private counterService = inject(CounterService);
    private router = inject(Router);

    public ngOnInit(): void {
        const counterId = this.activatedRoute.snapshot.params['counterId'];
        if (counterId) {
            const counter$ = this.counterService.getCounter$(counterId);
            if (counter$) {
                this.editCounter = {
                    id: counter$().id,
                    name: counter$().name,
                    defaultIncrement: counter$().defaultIncrement,
                    goal: counter$().goal || null,
                };
            }
        }
    }

    public saveCounter(counter: CounterForm): void {
        if (counter.id) {
            this.counterService.updateCounter(
                counter.id,
                counter.name,
                counter.defaultIncrement,
                counter.goal !== undefined && counter.goal !== null ? counter.goal : undefined
            );
            this.router.navigate(['detail', counter.id]);
        } else {
            this.counterService.createCounter(
                counter.name,
                counter.defaultIncrement,
                TransactionOperation.ADD,
                counter.initialValue || 0,
                counter.goal !== undefined && counter.goal !== null ? counter.goal : undefined
            );
            this.router.navigate(['/']);
        }
    }

    public closeOverlay(id: string | undefined): void {
        if (id) {
            this.router.navigate(['detail', id]);
        } else {
            this.router.navigate(['/']);
        }
    }
}
