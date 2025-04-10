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
        expect(service.compute(transactions, initialValue)).toBe(7);
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
        expect(service.compute(transactions, initialValue)).toBe(8);
    });

    describe('edge cases', () => {
        it('should handle empty transaction list', () => {
            const transactions: Transactions = [];
            expect(service.compute(transactions, 10)).toBe(10);
        });

        it('should handle large numbers correctly', () => {
            const transactions: Transactions = [
                {
                    value: Number.MAX_SAFE_INTEGER,
                    operation: TransactionOperation.ADD,
                    created: new Date(),
                },
                {
                    value: 1,
                    operation: TransactionOperation.SUBTRACT,
                    created: new Date(),
                },
            ];
            expect(service.compute(transactions, 0)).toBe(Number.MAX_SAFE_INTEGER - 1);
        });

        it('should handle negative numbers correctly', () => {
            const transactions: Transactions = [
                {
                    value: 10,
                    operation: TransactionOperation.ADD,
                    created: new Date(),
                },
                {
                    value: 15,
                    operation: TransactionOperation.SUBTRACT,
                    created: new Date(),
                },
            ];
            expect(service.compute(transactions, 0)).toBe(-5);
        });
    });

    describe('performance', () => {
        it('should handle large number of transactions efficiently', () => {
            const transactions: Transactions = Array(10000).fill({
                value: 1,
                operation: TransactionOperation.ADD,
                created: new Date(),
            });

            const startTime = performance.now();
            service.compute(transactions, 0);
            const endTime = performance.now();

            // Should complete within 100ms
            expect(endTime - startTime).toBeLessThan(100);
        });
    });

    describe('date handling', () => {
        it('should process transactions in chronological order', () => {
            const now = new Date();
            const transactions: Transactions = [
                {
                    value: 10,
                    operation: TransactionOperation.ADD,
                    created: new Date(now.getTime() - 2000),
                },
                {
                    value: 5,
                    operation: TransactionOperation.SUBTRACT,
                    created: new Date(now.getTime() - 1000),
                },
                {
                    value: 3,
                    operation: TransactionOperation.ADD,
                    created: now,
                },
            ];

            expect(service.compute(transactions, 0)).toBe(8);
        });
    });
});
