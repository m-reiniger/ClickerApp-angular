import { TestBed } from '@angular/core/testing';

import { TransactionService } from './transaction.service';
import { TransactionOperation, Transactions } from './transaction.type';

describe('TransactionService', () => {
    let service: TransactionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TransactionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create a new transaction', () => {
        const transaction = service.create(TransactionOperation.ADD, 14);
        expect(transaction.operation).toBe(TransactionOperation.ADD);
        expect(transaction.value).toBe(14);
    });

    it('should compute the current value of an transaction stack', () => {
        const initialValue = 5;
        const transactions: Transactions = [
            {
                value: 1,
                operation: TransactionOperation.ADD,
                created: new Date(),
            },
            {
                value: 5,
                operation: TransactionOperation.ADD,
                created: new Date(),
            },
            {
                value: 2,
                operation: TransactionOperation.SUBTRACT,
                created: new Date(),
            },
            {
                value: 3,
                operation: TransactionOperation.SUBTRACT,
                created: new Date(),
            },
            {
                value: 1,
                operation: TransactionOperation.ADD,
                created: new Date(),
            },
        ];
        expect(service.compute(transactions, initialValue)).toBe(7); // should be 7
    });

    it('should compute the current value of an transaction stack with an reset', () => {
        const initialValue = 0;
        const transactions: Transactions = [
            {
                value: 1,
                operation: TransactionOperation.ADD,
                created: new Date(),
            },
            {
                value: 10,
                operation: TransactionOperation.RESET,
                created: new Date(),
            },
            {
                value: 3,
                operation: TransactionOperation.SUBTRACT,
                created: new Date(),
            },
            {
                value: 1,
                operation: TransactionOperation.ADD,
                created: new Date(),
            },
        ];
        expect(service.compute(transactions, initialValue)).toBe(8); // should be 8
    });
});
