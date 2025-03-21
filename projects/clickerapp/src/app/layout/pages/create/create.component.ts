import { Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CounterForm, CounterFormComponent } from '@libs/counter-form';

import { CounterService } from '@app/core/counter/counter.service';
import { TransactionOperation } from '@app/core/transaction/transaction.type';

@Component({
    selector: 'app-create',
    imports: [
        CounterFormComponent
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {

    public editCounter: CounterForm| undefined = undefined;

    private activatedRoute = inject(ActivatedRoute);
    private counterService = inject(CounterService);
    private router = inject(Router);

    ngOnInit() {
        const counterId = this.activatedRoute.snapshot.params['counterId'];
        if (counterId) {
            const counter$ = this.counterService.getCounter$(counterId);
            this.editCounter = {
                id: counter$().id,
                name: counter$().name,
                defaultIncrement: counter$().defaultIncrement
            }
        }
    }

    public saveCounter(counter: CounterForm) {
        if (counter.id) {
            this.counterService.updateCounter(counter.id, counter.name, counter.defaultIncrement);
            this.router.navigate(['detail', counter.id]);
        } else {
            this.counterService.createCounter(counter.name, counter.defaultIncrement, TransactionOperation.ADD, counter.initialValue || 0);
            this.router.navigate(['/']);
        }
    }

    public closeOverlay(id: string | undefined) {
        if (id) {
            this.router.navigate(['detail', id]);
        } else {
            this.router.navigate(['/']);
        }
    }
}
