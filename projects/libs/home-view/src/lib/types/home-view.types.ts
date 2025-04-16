import { Signal } from '@angular/core';

export type HomeViewCounters = Array<HomeViewCounter>;

export type HomeViewCounter = {
    id: string;
    name: string;
    value: Signal<number>;
    defaultIncrement: number;
    initialValue: number;
    goal?: number | null;
    color?: string;
};

export enum HomeViewTransactionOperation {
    ADD = 'ADD',
    SUBTRACT = 'SUBTRACT',
}
