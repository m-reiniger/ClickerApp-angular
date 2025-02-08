import { Injectable } from '@angular/core';

import { Transaction, TransactionOperation, Transactions } from './transaction.type';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor() { }

    public create(operation: TransactionOperation, value = 1): Transaction {
        return {
            value: value,
            operation: operation,
            created: new Date()
        }
    }

    public compute(transactions: Transactions, initialValue = 0): number {
        return transactions.reduce(this.process, initialValue);
    }

    private process(accumulator: number, transaction: Transaction): number {
        switch (transaction.operation) {
            case TransactionOperation.ADD: return accumulator + transaction.value; break;
            case TransactionOperation.SUBTRACT: return accumulator - transaction.value; break;
            case TransactionOperation.RESET: return transaction.value; break;
        }
    }

}
