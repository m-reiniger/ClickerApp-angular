import { Component, inject, Input, output, Signal, signal, computed, effect } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { DetailViewCounter } from './types/detail-view.types';
import { ConfirmComponent } from './confirm/confirm.component';

/**
 * Component that displays detailed information about a counter and provides controls for manipulation.
 *
 * @Input counterDetail - Signal containing the counter details to display
 * @Input counterValue - Signal containing the current value of the counter
 *
 * @Output incrementCounter - Emits the counter ID when increment button is clicked
 * @Output decrementCounter - Emits the counter ID when decrement button is clicked
 * @Output editCounter - Emits the counter ID when edit button is clicked
 * @Output deleteCounter - Emits the counter ID when delete button is clicked
 * @Output closeOverlay - Emits when the detail view is closed
 */
@Component({
    selector: 'lib-detail-view',
    imports: [MatButtonModule, MatIconModule, DecimalPipe, MatCardModule],
    templateUrl: './detail-view.component.html',
    styleUrl: './detail-view.component.scss',
})
export class DetailViewComponent {
    private readonly dialog = inject(MatDialog);
    private readonly showingCelebration = signal(false);

    @Input() public counterDetail: Signal<DetailViewCounter | undefined> = signal<
        DetailViewCounter | undefined
    >(undefined);
    @Input() public counterValue: Signal<number> = signal(0);

    public incrementCounter = output<string | undefined>();
    public decrementCounter = output<string | undefined>();
    public editCounter = output<string | undefined>();
    public deleteCounter = output<string>();
    public resetCounter = output<{ id: string; keepHistory: boolean }>();
    public showHistory = output<string | undefined>();
    public closeOverlay = output<void>();

    public readonly hasReachedGoal = computed(() => {
        const counterDetail = this.counterDetail();
        return counterDetail && this.checkGoal(counterDetail, this.counterValue());
    });

    public readonly shouldShowCelebration = computed(() => this.showingCelebration());

    constructor() {
        effect(() => {
            if (this.hasReachedGoal() && !this.showingCelebration()) {
                this.showingCelebration.set(true);
                setTimeout(() => {
                    this.showingCelebration.set(false);
                }, 3000);
            }
        });
    }

    public close(): void {
        this.closeOverlay.emit();
    }

    public incrementCounterHandle(event: Event, id: string | undefined): void {
        event.stopPropagation();
        this.incrementCounter.emit(id);
    }

    public decrementCounterHandle(event: Event, id: string | undefined): void {
        event.stopPropagation();
        this.decrementCounter.emit(id);
    }

    public editCounterHandle(event: Event, id: string | undefined): void {
        event.stopPropagation();
        this.editCounter.emit(id);
    }

    public confirmDelete(): void {
        this.dialog.open(ConfirmComponent, {
            data: {
                title: 'Delete Counter',
                message: 'Are you sure you want to delete this counter?',
                closeHandle: this.closeOverlay,
                actionHandle: this.deleteCounter,
                id: this.counterDetail()?.id,
                askToKeepHistory: false,
            },
        });
    }

    public confirmReset(): void {
        this.dialog.open(ConfirmComponent, {
            data: {
                title: 'Reset Counter',
                message: `Are you sure you want to reset this counter to its initial value ${this.counterDetail()?.initialValue}?`,
                closeHandle: undefined,
                actionHandle: this.resetCounter,
                id: this.counterDetail()?.id,
                askToKeepHistory: true,
            },
        });
    }

    public showHistoryHandle(event: Event, id: string | undefined): void {
        event.stopPropagation();
        this.showHistory.emit(id);
    }

    public checkGoal(counter: DetailViewCounter, value: number): boolean {
        return (
            !!(
                counter.goal != undefined &&
                counter.defaultIncrement > 0 &&
                value >= counter.goal
            ) ||
            !!(counter.goal != undefined && counter.defaultIncrement < 0 && value <= counter.goal)
        );
    }

    /**
     * Calculates the progress in degrees (0-360) based on the current value relative to the goal
     * @param initialValue - The starting value
     * @param goal - The target value to reach
     * @param currentValue - The current value
     * @returns The progress in degrees (0-360)
     */
    public getProgress(
        initialValue: number,
        goal: number | null | undefined,
        currentValue: number
    ): string {
        if (goal == null || goal == undefined) {
            return '360deg';
        }

        // If goal equals initial value, we can't calculate progress
        if (goal === initialValue) {
            return '360deg';
        }

        // Calculate the total distance to cover
        const totalDistance = Math.abs(goal - initialValue);

        // Calculate how far we've come from the initial value
        const coveredDistance = Math.abs(currentValue - initialValue);

        // Calculate progress as a percentage (0-1)
        const progress = coveredDistance / totalDistance;

        // Check if we're moving in the right direction
        const isMovingTowardsGoal =
            (goal > initialValue && currentValue > initialValue) ||
            (goal < initialValue && currentValue < initialValue);

        // If we're moving away from the goal, progress is 0
        if (!isMovingTowardsGoal) {
            return '0deg';
        }

        // If we've reached or exceeded the goal, progress is complete
        if (
            (goal > initialValue && currentValue >= goal) ||
            (goal < initialValue && currentValue <= goal)
        ) {
            return '360deg';
        }

        // Convert progress to degrees (0-360)
        return `${progress * 360}deg`;
    }
}
