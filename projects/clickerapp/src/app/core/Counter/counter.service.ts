import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { StorageService } from '@app/core/storage/storage.service';
import { TransactionService } from '@app/core/transaction/transaction.service';

import { Counter, Counters } from './counter.types';
import { TransactionOperation } from '@app/core/transaction/transaction.type';

/**
 * Service responsible for managing counters and their operations.
 * Handles creation, updating, deletion, and value manipulation of counters.
 * Uses signals for reactive state management and local storage for persistence.
 */
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

    /**
     * Retrieves the current list of counters
     * @returns The array of counters
     */
    public getCounterList(): Counters {
        return this.counterList;
    }

    /**
     * Retrieves a reactive signal of the counter list
     * @returns A signal containing the current list of counters
     */
    public getCounterList$(): Signal<Counters> {
        return this.counterList$ as Signal<Counters>;
    }

    /**
     * Finds a counter by its ID
     * @param id - The ID of the counter to find
     * @returns The counter if found, undefined otherwise
     */
    public getCounter(id: string): Counter | undefined {
        return this.counterList.find((counter) => counter.id === id);
    }

    /**
     * Retrieves a reactive signal of a specific counter
     * @param id - The ID of the counter
     * @returns A signal containing the counter if found
     */
    public getCounter$(id: string): Signal<Counter> {
        return signal(this.counterList.find((counter) => counter.id === id) as Counter);
    }

    /**
     * Retrieves a reactive signal of a counter's current value
     * @param id - The ID of the counter
     * @returns A signal containing the counter's current value
     */
    public getCounterValue$(id: string): Signal<number> {
        return this.getCounterValueSignal(id) as Signal<number>;
    }

    /**
     * Creates a new counter with the specified parameters
     * @param name - The name of the counter
     * @param defaultIncrement - The default increment value for operations
     * @param defaultOperation - The default operation type (ADD/SUBTRACT)
     * @param initialValue - The initial value of the counter
     * @returns The newly created counter
     */
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

    /**
     * Updates an existing counter's properties
     * @param id - The ID of the counter to update
     * @param name - The new name for the counter
     * @param defaultIncrement - The new default increment value
     */
    public updateCounter(id: string, name: string, defaultIncrement: number): void {
        const counter = this.getCounter(id);
        if (counter) {
            counter.name = name;
            counter.defaultIncrement = defaultIncrement;

            this.counterList$.set(this.counterList);
            this.saveCounters();
        }
    }

    /**
     * Deletes a counter by its ID
     * @param id - The ID of the counter to delete
     */
    public deleteCounter(id: string): void {
        this.counterList = this.counterList.filter((counter) => counter.id !== id);
        this.counter$.delete(id);

        this.counterList$.set(this.counterList);
        this.saveCounters();
    }

    /**
     * Increments a counter's value by its default increment
     * @param id - The ID of the counter to increment
     */
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

    /**
     * Decrements a counter's value by its default increment
     * @param id - The ID of the counter to decrement
     */
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

    /**
     * Retrieves or creates a signal for a counter's value
     * @param id - The ID of the counter
     * @returns A writable signal containing the counter's value
     */
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

    /**
     * Updates the signal value for a counter
     * @param id - The ID of the counter to update
     */
    private updateSignal(id: string): void {
        const counter = this.getCounter(id);
        if (counter) {
            const value = this.transactionService.compute(counter.transactions);
            const signal = this.getCounterValueSignal(id);
            signal.set(value);
        }
    }

    /**
     * Saves the current state of counters to storage
     */
    private saveCounters(): void {
        this.storageService.saveCounters(this.counterList);
    }
}
