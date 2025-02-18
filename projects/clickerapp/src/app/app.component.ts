import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

import { CounterService } from './core/counter/counter.service';
import { TransactionOperation } from './core/transaction/transaction.type';


@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatToolbarModule,
        MatIconModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'clickerapp';

    constructor(private counterService: CounterService) { }

    public ngOnInit() {
        // this.counterService.createCounter('Bier 🍻', 1, TransactionOperation.ADD, 0);
        // this.counterService.createCounter('Runden 🔄', 1, TransactionOperation.SUBTRACT, 13);
        // this.counterService.createCounter('Boss said "AI" 🤖', 2, TransactionOperation.ADD, 4);
    }
}