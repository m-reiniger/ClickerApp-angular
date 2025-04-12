import { Component, Input, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Transaction } from './types/transaction.types';

@Component({
    selector: 'lib-history',
    standalone: true,
    imports: [CommonModule, MatListModule, MatIconModule],
    templateUrl: './history.component.html',
    styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
    @Input() public transactions: Signal<Transaction[]> = signal([]);
    public sortedTransactions: Signal<Transaction[]> = signal([]);

    public ngOnInit(): void {
        this.sortedTransactions = signal(
            this.transactions()
                .map((transaction, index, array) => {
                    if (index === 0) {
                        return { ...transaction, timeSincePrevious: 'First transaction' };
                    }
                    const previousTimestamp = array[index - 1].timestamp;
                    const timeDiff = this.getTimeDifference(
                        transaction.timestamp,
                        previousTimestamp
                    );
                    return { ...transaction, timeSincePrevious: timeDiff };
                })
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        );
    }

    private getTimeDifference(current: Date, previous: Date): string {
        const diffInSeconds = Math.floor((current.getTime() - previous.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
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
                return 'primary';
            case 'subtract':
                return 'warn';
            case 'reset':
                return 'accent';
            case 'snapshot':
                return 'primary';
            default:
                return '';
        }
    }
}
