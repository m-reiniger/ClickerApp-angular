import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { StorageService } from '@app/core/storage/storage.service';
import { TransactionService } from '@app/core/transaction/transaction.service';

import { Counter, Counters } from './counter.types';
import { TransactionOperation } from '@app/core/transaction/transaction.type';

@Injectable({
    providedIn: 'root'
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

    public createCounter(name: string, defaultIncrement: number, defaultOperation: TransactionOperation, initialValue: number): Counter {
        const counter: Counter = {
            id: uuidv4(),
            name,
            transactions: [],
            defaultIncrement,
            defaultOperation
        }

        const transaction = this.transactionService.create(TransactionOperation.RESET, initialValue);
        counter.transactions.push(transaction);

        this.counterList.push(counter);
        this.counterList$.set(this.counterList);

        this.saveCounters();

        return counter;
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
        return this.counterList.find(counter => counter.id === id);
    }

    public getCounter$(id: string): Signal<Counter> {
        return signal(this.counterList.find(counter => counter.id === id) as Counter);
    }

    /**
     * publicly expose a immutable signal of the counter value
     */
    public getCounterValue$(id: string): Signal<number> {
        return this.getCounterValueSignal_(id) as Signal<number>;
    }

    public deleteCounter(id: string): void {
        this.counterList = this.counterList.filter(counter => counter.id !== id);
        this.counter$.delete(id);
        this.counterList$.set(this.counterList);

        this.saveCounters();
    }

    public incrementCounter(id: string): void {
        const counter = this.getCounter(id);
        if (counter) {
            const transaction = this.transactionService.create(TransactionOperation.ADD, counter.defaultIncrement);
            counter.transactions.push(transaction);
        }
        this.updateSignal(id);
        this.saveCounters();
    }

    public decrementCounter(id: string): void {
        const counter = this.getCounter(id);
        if (counter) {
            const transaction = this.transactionService.create(TransactionOperation.SUBTRACT, counter.defaultIncrement);
            counter.transactions.push(transaction);
        }
        this.updateSignal(id);
        this.saveCounters();
    }

    private getCounterValueSignal_(id: string): WritableSignal<number> {
        const counter = this.getCounter(id);
        let value = 0;
        let valueSignal: WritableSignal<number>;

        if (counter) {
            value = this.transactionService.compute(counter.transactions);
        }

        if (!this.counter$.has(id)) {
            valueSignal = signal(value);
            this.counter$.set(id, valueSignal);
        } else {
            valueSignal = this.counter$.get(id) as WritableSignal<number>;
            valueSignal.set(value);
        }

        return valueSignal;
    }

    private updateSignal(id: string): void {
        const value = this.getCounterValueSignal_(id);
        const counter = this.getCounter(id);

        if (value && counter) {
            value.set(this.transactionService.compute(counter.transactions));
        }
    }

    private saveCounters(): void {
        this.storageService.saveCounters(this.counterList);
    }
}
