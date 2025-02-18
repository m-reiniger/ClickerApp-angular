import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CounterForm, CounterFormComponent } from '@libs/counter-form';
import { CounterService } from '../../../../core/counter/counter.service';
import { TransactionOperation } from '../../../../core/transaction/transaction.type';

@Component({
    selector: 'app-create',
    imports: [
        CounterFormComponent
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss'
})
export class CreateComponent {

    constructor(private counterService: CounterService, private router: Router) { }

    public createCounter(counter: CounterForm) {
        this.counterService.createCounter(counter.name, counter.defaultIncrement, TransactionOperation.ADD, counter.initialValue);
        this.router.navigate(['/']);
    }

    public closeOverlay() {
        this.router.navigate(['/']);
    }
}
