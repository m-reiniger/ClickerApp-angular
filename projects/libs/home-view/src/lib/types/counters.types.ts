import { Signal } from '@angular/core';

export type UiCounters = Array<UiCounter>;

export type UiCounter = {
    id: string;
    name: string;
    value: Signal<number>;
    defaultIncrement: number;
    initialValue: number;
    goal?: number | null;
};

export enum UiTransactionOperation {
    ADD = 'ADD',
    SUBTRACT = 'SUBTRACT',
}
