import { Component, Input, OnInit, output, signal, Signal } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';

import { HomeViewCounter, HomeViewCounters } from './types/home-view.types';
import { ViewModeService, ViewMode } from './services/view-mode.service';
import { LongPressDirective, PressType } from './directives/long-press.directive';
import hints from './hints.json';

interface HintData {
    hints: string[];
}

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
    selector: 'lib-home-view',
    imports: [
        NgFor,
        NgIf,
        MatButtonModule,
        MatIconModule,
        DecimalPipe,
        MatButtonToggleModule,
        FormsModule,
        LongPressDirective,
    ],
    templateUrl: './home-view.component.html',
    styleUrl: './home-view.component.scss',
})
export class HomeViewComponent implements OnInit {
    @Input() public title = 'My Counters';
    @Input() public counterList$: Signal<HomeViewCounters> = signal<HomeViewCounters>([]);

    public viewMode: ViewMode = 'list';
    public incrementCounter = output<string>();
    public decrementCounter = output<string>();
    public navigateToDetail = output<string>();
    public addCounter = output<void>();
    public pressedTileId: string | null = null;
    public currentHint = '';
    public showHint = true;
    public isHintAnimating = false;

    constructor(private viewModeService: ViewModeService) {}

    public ngOnInit(): void {
        this.viewMode = this.viewModeService.getViewMode();
        this.updateHint();
    }

    public updateHint(): void {
        if (this.isHintAnimating) return;

        this.isHintAnimating = true;
        const hintData = hints as HintData;
        const randomIndex = Math.floor(Math.random() * hintData.hints.length);

        // Ensure we don't show the same hint twice in a row
        let newHint = hintData.hints[randomIndex];
        while (newHint === this.currentHint && hintData.hints.length > 1) {
            newHint = hintData.hints[Math.floor(Math.random() * hintData.hints.length)];
        }

        this.currentHint = newHint;

        // Reset animation flag after a short delay
        setTimeout(() => {
            this.isHintAnimating = false;
        }, 300);
    }

    public toggleHint(): void {
        this.showHint = !this.showHint;
    }

    public toggleViewMode(mode: ViewMode): void {
        this.viewMode = mode;
        this.viewModeService.saveViewMode(mode);
        this.updateHint();
    }

    public handlePress(type: PressType, id: string): void {
        if (type === 'click') {
            this.navigateToDetail.emit(id);
        } else if (type === 'longpress') {
            this.incrementCounter.emit(id);
        }
    }

    public handlePressState(isPressed: boolean, id: string): void {
        this.pressedTileId = isPressed ? id : null;
    }

    public isTilePressed(id: string): boolean {
        return this.pressedTileId === id;
    }

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

    public checkGoal(counter: HomeViewCounter, value: number): boolean {
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
