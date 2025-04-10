import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { StorageService } from '@app/core/storage/storage.service';
import { TransactionService } from '@app/core/transaction/transaction.service';

import { Counter, Counters } from './counter.types';
import { TransactionOperation } from '@app/core/transaction/transaction.type';

@Injectable({
    providedIn: 'root',
})
export class CounterService {
    private counterList: Counters = [];

    private counterList$: WritableSignal<Counters> = signal(this.counterList);
    private counter$: Map<string, WritableSignal<number>> = new Map();

    private transactionService = inject(TransactionService);
    private storageService = inject(StorageService);

    constructor() {
        // initialy load counters from storage
        this.counterList = this.storageService.loadCounters();
    }

    public getCounterList(): Counters {
        return this.counterList;
    }

    /**
     * publicly only expose an immutable signal of the counter list
     */
    public getCounterList$(): Signal<Counters> {
        return this.counterList$ as Signal<Counters>;
    }

    public getCounter(id: string): Counter | undefined {
        return this.counterList.find((counter) => counter.id === id);
    }

    public getCounter$(id: string): Signal<Counter> | undefined {
        const counter = this.counterList.find((counter) => counter.id === id) as Counter;
        if (counter) {
            return signal(counter);
        } else {
            return undefined;
        }
    }

    /**
     * publicly expose a immutable signal of the counter value
     */
    public getCounterValue$(id: string): Signal<number> {
        return this.getCounterValueSignal(id) as Signal<number>;
    }

    private getCounterValueSignal(id: string): WritableSignal<number> {
        if (!this.counter$.has(id)) {
            const counter = this.getCounter(id);
            if (counter) {
                const value = this.transactionService.compute(counter.transactions);
                this.counter$.set(id, signal(value));
            } else {
                this.counter$.set(id, signal(0));
            }
        }
        return this.counter$.get(id) as WritableSignal<number>;
    }

    public createCounter(
        name: string,
        defaultIncrement: number,
        defaultOperation: TransactionOperation,
        initialValue: number
    ): Counter {
        const counter: Counter = {
            id: uuidv4(),
            name,
            transactions: [],
            defaultIncrement,
            defaultOperation,
        };

        const transaction = this.transactionService.create(
            TransactionOperation.RESET,
            initialValue
        );
        counter.transactions.push(transaction);

        this.counterList.push(counter);
        this.counterList$.set(this.counterList);

        this.saveCounters();

        return counter;
    }

    public updateCounter(id: string, name: string, defaultIncrement: number): void {
        const counter = this.getCounter(id);
        if (counter) {
            counter.name = name;
            counter.defaultIncrement = defaultIncrement;

            this.counterList$.set(this.counterList);
            this.saveCounters();
        }
    }

    public deleteCounter(id: string): void {
        this.counterList = this.counterList.filter((counter) => counter.id !== id);
        this.counter$.delete(id);

        this.counterList$.set(this.counterList);
        this.saveCounters();
    }

    public incrementCounter(id: string): void {
        const counter = this.getCounter(id);
        if (counter) {
            const transaction = this.transactionService.create(
                counter.defaultOperation,
                counter.defaultIncrement
            );
            counter.transactions.push(transaction);
            this.updateSignal(id);
            this.saveCounters();
        }
    }

    public decrementCounter(id: string): void {
        const counter = this.getCounter(id);
        if (counter) {
            const transaction = this.transactionService.create(
                counter.defaultOperation === TransactionOperation.ADD
                    ? TransactionOperation.SUBTRACT
                    : TransactionOperation.ADD,
                counter.defaultIncrement
            );
            counter.transactions.push(transaction);
            this.updateSignal(id);
            this.saveCounters();
        }
    }

    private updateSignal(id: string): void {
        const counter = this.getCounter(id);
        if (counter) {
            const value = this.transactionService.compute(counter.transactions);
            const signal = this.getCounterValueSignal(id);
            signal.set(value);
        }
    }

    private saveCounters(): void {
        this.storageService.saveCounters(this.counterList);
    }
}
