import { Component, Input, OnInit, output, Signal, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Transaction, TransactionOperation } from './types/transaction.types';

@Component({
    selector: 'lib-history',
    standalone: true,
    imports: [
        CommonModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        DecimalPipe,
        MatCardModule,
    ],
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
    @Input() public transactions: Transaction[] = [];
    @Input() public counterName = 'Counter Name';

    public closeOverlay = output<void>();

    public sortedTransactions: Signal<Transaction[]> = signal([]);

    public showScrollToTop = signal(false);
    private readonly SCROLL_THRESHOLD = 100;

    public onWindowScroll = (): void => {
        const scrollPosition = document.querySelector('main')?.scrollTop || 0;
        this.showScrollToTop.set(scrollPosition > this.SCROLL_THRESHOLD);
    };

    public scrollToTop(): void {
        document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    }

    public ngOnInit(): void {
        this.sortedTransactions = signal(
            this.transactions.map((transaction, index, array) => {
                if (index === 0) {
                    return { ...transaction, timeSincePrevious: 'Creation' };
                }
                if (index === 1) {
                    return { ...transaction, timeSincePrevious: 'First action' };
                }
                const previousTimestamp = array[index - 1].timestamp;
                const timeDiff = this.getTimeDifference(
                    new Date(transaction.timestamp),
                    new Date(previousTimestamp)
                );
                return { ...transaction, timeSincePrevious: timeDiff };
            })
        );

        document.querySelector('main')?.addEventListener('scroll', this.onWindowScroll);
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

    public getOperationIcon(operation: TransactionOperation, value: number): string {
        if (value >= 0) {
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
        } else {
            switch (operation) {
                case 'add':
                    return 'remove';
                case 'subtract':
                    return 'add';
                case 'reset':
                    return 'restart_alt';
                case 'snapshot':
                    return 'photo_camera';
                default:
                    return 'help';
            }
        }
    }

    public getOperationColor(operation: TransactionOperation, value: number): string {
        if (value >= 0) {
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
        } else {
            switch (operation) {
                case 'add':
                    return 'substract';
                case 'subtract':
                    return 'add';
                case 'reset':
                    return 'reset';
                case 'snapshot':
                    return 'snapshot';
                default:
                    return '';
            }
        }
    }

    public formatTitleText(operation: TransactionOperation, value: number): string {
        if (value >= 0) {
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
        } else {
            switch (operation) {
                case 'add':
                    return `substracted ${Math.abs(value)}`;
                case 'subtract':
                    return `added ${Math.abs(value)}`;
                case 'reset':
                    return `reset to ${value}`;
                case 'snapshot':
                    return `snapshot value ${value}`;
                default:
                    return '';
            }
        }
    }
}
