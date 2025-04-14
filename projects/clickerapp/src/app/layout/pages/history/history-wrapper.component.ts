import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CounterService } from '@app/core/counter/counter.service';
import { TransactionService } from '@app/core/transaction/transaction.service';
import { Transaction, TransactionOperation } from '@app/core/transaction/transaction.type';
import {
    HistoryViewComponent as HistoryLibComponent,
    HistoryViewTransaction as HistoryTransaction,
    HistoryViewTransactionOperation as HistoryTransactionOperation,
} from '@libs/history-view';

@Component({
    selector: 'app-history-wrapper',
    imports: [HistoryLibComponent],
    templateUrl: './history-wrapper.component.html',
    styleUrl: './history-wrapper.component.scss',
})
export class HistoryWrapperComponent implements OnInit {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    private counterService = inject(CounterService);
    private transactionService = inject(TransactionService);

    public counterName = '';
    public counterId = '';
    public transactions: HistoryTransaction[] = [];

    public ngOnInit(): void {
        const counterId = this.activatedRoute.snapshot.params['counterId'];
        if (counterId) {
            const counter$ = this.counterService.getCounter$(counterId);
            if (counter$) {
                this.counterName = counter$().name;
                this.counterId = counter$().id;
                this.transactions = this.transformTransactions(counter$().transactions);
            }
        }
    }

    public closeOverlay(): void {
        this.router.navigate(['detail', this.counterId]);
    }

    private transformTransactions(transactions: Transaction[]): HistoryTransaction[] {
        const transformedTransactions: HistoryTransaction[] = [];
        for (let i = 0, len = transactions.length; i < len; i++) {
            const transaction = transactions[i];
            const transformedTransaction = this.transformTransaction(transaction);

            const previousTransactions = transactions.slice(0, i + 1);
            transformedTransaction.currentValue =
                this.transactionService.compute(previousTransactions);

            transformedTransactions.push(transformedTransaction);
        }
        return transformedTransactions;
    }

    private transformTransaction(transaction: Transaction): HistoryTransaction {
        return {
            operation: HistoryWrapperComponent.transformTransactionOperation(transaction.operation),
            value: transaction.value,
            currentValue: 0, // TODO: get current value
            timestamp: transaction.created,
        };
    }

    private static transformTransactionOperation(
        operation: TransactionOperation
    ): HistoryTransactionOperation {
        switch (operation) {
            case TransactionOperation.ADD:
                return 'add';
            case TransactionOperation.SUBTRACT:
                return 'subtract';
            case TransactionOperation.RESET:
                return 'reset';
            case TransactionOperation.SNAPSHOT:
                return 'snapshot';
        }
    }
}
