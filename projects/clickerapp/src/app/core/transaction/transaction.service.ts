import { Injectable } from '@angular/core';

import { Transaction, TransactionOperation, Transactions } from './transaction.type';

/**
 * Service responsible for managing and computing counter transactions.
 * Handles creation of transactions and computation of counter values based on transaction history.
 */
@Injectable({
    providedIn: 'root',
})
export class TransactionService {
    /**
     * Creates a new transaction with the specified operation and value
     * @param operation - The type of operation (ADD/SUBTRACT/RESET)
     * @param value - The value associated with the transaction
     * @returns A new transaction object with current timestamp
     */
    public create(operation: TransactionOperation, value = 1): Transaction {
        return {
            value: value,
            operation: operation,
            created: new Date(),
        };
    }

    /**
     * Computes the current value of a counter based on its transaction history
     * @param transactions - The array of transactions to process
     * @param initialValue - The initial value to start computation from
     * @returns The computed value after applying all transactions
     */
    public compute(transactions: Transactions, initialValue = 0): number {
        return transactions.reduce(this.process, initialValue);
    }

    /**
     * Processes a single transaction and updates the accumulator
     * @param accumulator - The current accumulated value
     * @param transaction - The transaction to process
     * @returns The new accumulated value after processing the transaction
     */
    private process(accumulator: number, transaction: Transaction): number {
        switch (transaction.operation) {
            case TransactionOperation.ADD:
                return accumulator + transaction.value;
            case TransactionOperation.SUBTRACT:
                return accumulator - transaction.value;
            case TransactionOperation.RESET:
                return transaction.value;
            case TransactionOperation.SNAPSHOT:
                return transaction.value;
            default:
                return accumulator;
        }
    }
}
