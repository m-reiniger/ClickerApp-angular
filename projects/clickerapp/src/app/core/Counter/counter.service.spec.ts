/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';

import { CounterService } from './counter.service';
import { TransactionOperation } from '@app/core/transaction/transaction.type';

describe('CounterService', () => {
    let service: CounterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CounterService);
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('createCounter', () => {
        it('should create a counter with initial value', () => {
            const counter = service.createCounter('Test Counter', 1, TransactionOperation.ADD, 0);
            expect(counter).toBeDefined();
            expect(counter.name).toBe('Test Counter');
            expect(counter.defaultIncrement).toBe(1);
            expect(counter.defaultOperation).toBe(TransactionOperation.ADD);
            expect(counter.transactions.length).toBe(1);
            expect(counter.transactions[0].operation).toBe(TransactionOperation.RESET);
            expect(counter.transactions[0].value).toBe(0);
        });
    });

    describe('deleteCounter', () => {
        it('should delete counter by id', () => {
            // Create multiple counters
            const counter1 = service.createCounter('Counter 1', 1, TransactionOperation.ADD, 0);
            const counter2 = service.createCounter('Counter 2', 2, TransactionOperation.ADD, 10);
            const counter3 = service.createCounter(
                'Counter 3',
                3,
                TransactionOperation.SUBTRACT,
                20
            );

            const valueSignal = service.getCounterValue$(counter2.id);

            service.deleteCounter(counter2.id);

            expect(service.getCounter(counter2.id)).toBeUndefined();
            expect(service.getCounterList().length).toBe(2);
            expect(service.getCounterList()[0].name).toBe('Counter 1');
            expect(service.getCounterList()[1].name).toBe('Counter 3');
        });

        it('should do nothing when deleting non-existent counter', () => {
            // Create multiple counters
            const counter1 = service.createCounter('Counter 1', 1, TransactionOperation.ADD, 0);
            const counter2 = service.createCounter(
                'Counter 2',
                2,
                TransactionOperation.SUBTRACT,
                10
            );

            service.deleteCounter('non-existent-id');

            expect(service.getCounterList().length).toBe(2);
            expect(service.getCounterList()[0].name).toBe('Counter 1');
            expect(service.getCounterList()[1].name).toBe('Counter 2');
        });
    });

    describe('getCounters', () => {
        it('should return all counters', () => {
            service.createCounter('Counter 1', 1, TransactionOperation.ADD, 0);
            service.createCounter('Counter 2', 2, TransactionOperation.SUBTRACT, 10);

            const counters = service.getCounterList();
            expect(counters.length).toBe(2);
            expect(counters[0].name).toBe('Counter 1');
            expect(counters[1].name).toBe('Counter 2');
        });
    });

    describe('getCounter', () => {
        it('should return counter by id', () => {
            const counter = service.createCounter('Test Counter', 1, TransactionOperation.ADD, 0);
            const found = service.getCounter(counter.id);
            expect(found).toBeDefined();
            expect(found?.id).toBe(counter.id);
        });

        it('should return undefined for non-existent id', () => {
            const found = service.getCounter('non-existent-id');
            expect(found).toBeUndefined();
        });
    });

    describe('incrementCounter', () => {
        it('should increment counter value by default increment', () => {
            const counter = service.createCounter('Test Counter', 5, TransactionOperation.ADD, 10);
            const initialValue = service.getCounterValue$(counter.id)();
            service.incrementCounter(counter.id);
            const newValue = service.getCounterValue$(counter.id)();
            expect(newValue).toBe(initialValue + 5);
        });

        it('should add a new transaction when incrementing', () => {
            const counter = service.createCounter('Test Counter', 5, TransactionOperation.ADD, 10);
            const initialTransactionCount = counter.transactions.length;
            service.incrementCounter(counter.id);
            const updatedCounter = service.getCounter(counter.id);
            expect(updatedCounter?.transactions.length).toBe(initialTransactionCount + 1);
        });

        it('should do nothing when incrementing non-existent counter', () => {
            const initialCounters = service.getCounterList().length;
            service.incrementCounter('non-existent-id');
            expect(service.getCounterList().length).toBe(initialCounters);
        });
    });

    describe('decrementCounter', () => {
        it('should decrement counter value by default increment', () => {
            const counter = service.createCounter('Test Counter', 5, TransactionOperation.ADD, 20);
            const initialValue = service.getCounterValue$(counter.id)();

            service.decrementCounter(counter.id);

            const newValue = service.getCounterValue$(counter.id)();
            expect(newValue).toBe(initialValue - 5);
        });

        it('should add a new transaction when decrementing', () => {
            const counter = service.createCounter(
                'Test Counter',
                5,
                TransactionOperation.SUBTRACT,
                20
            );
            const initialTransactionCount = counter.transactions.length;

            service.decrementCounter(counter.id);

            const updatedCounter = service.getCounter(counter.id);
            expect(updatedCounter?.transactions.length).toBe(initialTransactionCount + 1);
        });

        it('should do nothing when decrementing non-existent counter', () => {
            const initialCounters = service.getCounterList().length;
            service.decrementCounter('non-existent-id');
            expect(service.getCounterList().length).toBe(initialCounters);
        });
    });

    describe('updateCounter', () => {
        it('should update counter name and default increment', () => {
            const counter = service.createCounter('Test Counter', 1, TransactionOperation.ADD, 0);
            const newName = 'Updated Counter';
            const newIncrement = 10;

            service.updateCounter(counter.id, newName, newIncrement);

            const updatedCounter = service.getCounter(counter.id);
            expect(updatedCounter?.name).toBe(newName);
            expect(updatedCounter?.defaultIncrement).toBe(newIncrement);
        });

        it('should not update non-existent counter', () => {
            const initialCounters = service.getCounterList().length;
            service.updateCounter('non-existent-id', 'New Name', 10);
            expect(service.getCounterList().length).toBe(initialCounters);
        });
    });

    describe('signal behavior', () => {
        it('should update signal when counter list changes', () => {
            const counterListSignal = service.getCounterList$();
            const initialValue = counterListSignal();

            service.createCounter('Test Counter', 1, TransactionOperation.ADD, 0);

            expect(counterListSignal()).not.toBe(initialValue);
            expect(counterListSignal().length).toBe(initialValue.length + 1);
        });

        it('should update counter value signal when counter changes', () => {
            const counter = service.createCounter('Test Counter', 1, TransactionOperation.ADD, 0);
            const valueSignal = service.getCounterValue$(counter.id);
            const initialValue = valueSignal();

            service.incrementCounter(counter.id);

            expect(valueSignal()).toBe(initialValue + 1);
        });
    });

    describe('getCounterValueSignal', () => {
        it('should return signal with initial value', () => {
            const counter = service.createCounter('Test Counter', 1, TransactionOperation.ADD, 5);
            const valueSignal = service.getCounterValue$(counter.id);
            expect(valueSignal()).toBe(5);
        });

        it('should return signal with value 0 for non-existent counter', () => {
            const valueSignal = service.getCounterValue$('non-existent-id');
            expect(valueSignal()).toBe(0);
        });

        it('should return a signal and acknowledge changes', () => {
            const counter = service.createCounter('Test Counter', 3, TransactionOperation.ADD, 5);
            const valueSignal = service.getCounterValue$(counter.id);
            expect(valueSignal()).toBe(5);
            service.incrementCounter(counter.id);
            expect(valueSignal()).toBe(8);
            service.decrementCounter(counter.id);
            expect(valueSignal()).toBe(5);
        });
    });
});
