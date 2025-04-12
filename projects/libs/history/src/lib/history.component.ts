import { Component, Input, OnInit, output, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { Transaction, TransactionOperation } from './types/transaction.types';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'lib-history',
    standalone: true,
    imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule],
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
    @Input() public transactions: Transaction[] = [];
    @Input() public counterName = 'Counter Name';

    public closeOverlay = output<void>();

    public sortedTransactions: Signal<Transaction[]> = signal([]);

    public ngOnInit(): void {
        this.sortedTransactions = signal(
            this.transactions.map((transaction, index, array) => {
                if (index === 0) {
                    return { ...transaction, timeSincePrevious: 'First transaction' };
                }
                const previousTimestamp = array[index - 1].timestamp;
                const timeDiff = this.getTimeDifference(
                    new Date(transaction.timestamp),
                    new Date(previousTimestamp)
                );
                return { ...transaction, timeSincePrevious: timeDiff };
            })
        );
    }

    public close(): void {
        this.closeOverlay.emit();
    }

    private getTimeDifference(current: Date, previous: Date): string {
        const diffInSeconds = Math.floor((current.getTime() - previous.getTime()) / 1000);

        if (diffInSeconds < 60) {
            if (diffInSeconds === 0) {
                return 'less than a second';
            } else {
                return `${diffInSeconds} seconds`;
            }
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        const restMinutes = diffInMinutes - diffInHours * 60;
        if (diffInHours < 24) {
            return `${diffInHours} hours ${restMinutes} minutes`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        const restHours = diffInHours - diffInDays * 24;
        return `${diffInDays} days ${restHours} hours`;
    }

    public getOperationIcon(operation: TransactionOperation): string {
        switch (operation) {
            case 'add':
                return 'add';
            case 'subtract':
                return 'remove';
            case 'reset':
                return 'restart_alt';
            case 'snapshot':
                return 'photo_camera';
            default:
                return 'help';
        }
    }

    public getOperationColor(operation: TransactionOperation): string {
        switch (operation) {
            case 'add':
                return 'add';
            case 'subtract':
                return 'substract';
            case 'reset':
                return 'reset';
            case 'snapshot':
                return 'snapshot';
            default:
                return '';
        }
    }

    public formatTitleText(operation: TransactionOperation, value: number): string {
        switch (operation) {
            case 'add':
                return `added ${value}`;
            case 'subtract':
                return `subtracted ${value}`;
            case 'reset':
                return `reset to ${value}`;
            case 'snapshot':
                return `snapshot value ${value}`;
            default:
                return '';
        }
    }
}
