import { Component, Input, output, signal, Signal } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UiCounter, UiCounters } from './types/counters.types';

/**
 * Main home screen component that displays a list of counters and their controls.
 *
 * @Input title - The title to display at the top of the screen (default: 'My Counters')
 * @Input counterList$ - A signal containing the list of counters to display
 *
 * @Output incrementCounter - Emits the ID of the counter to increment
 * @Output decrementCounter - Emits the ID of the counter to decrement
 * @Output navigateToDetail - Emits the ID of the counter to view details
 * @Output addCounter - Emits when the add counter button is clicked
 */
@Component({
    selector: 'lib-ui-home',
    imports: [NgFor, NgIf, MatButtonModule, MatIconModule, DecimalPipe],
    templateUrl: './ui-home.component.html',
    styleUrl: './ui-home.component.scss',
})
export class UiHomeComponent {
    @Input() public title = 'My Counters';
    @Input() public counterList$: Signal<UiCounters> = signal<UiCounters>([]);

    public incrementCounter = output<string>();
    public decrementCounter = output<string>();
    public navigateToDetail = output<string>();
    public addCounter = output<void>();

    public incrementCounterHandle(event: Event, id: string): void {
        event.stopPropagation();
        this.incrementCounter.emit(id);
    }

    public decrementCounterHandle(event: Event, id: string): void {
        event.stopPropagation();
        this.decrementCounter.emit(id);
    }

    public addCounterHandle(): void {
        this.addCounter.emit();
    }

    public navigateToDetailHandle(id: string): void {
        this.navigateToDetail.emit(id);
    }

    public checkGoal(counter: UiCounter, value: number): boolean {
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
