import {
    Component,
    inject,
    Input,
    OnInit,
    output,
    signal,
    Signal,
    computed,
    effect,
} from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

import { HomeViewCounter, HomeViewCounters } from './types/home-view.types';
import { ViewModeService, ViewMode } from './services/view-mode.service';
import { OrderingService } from './services/ordering.service';

import { LongPressDirective, PressType } from '@libs/touch-gestures';

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
 * @Output reorderCounters - Emits the previous and current index of the reordered counter
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
        DragDropModule,
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
    public addCounter = output<string | undefined>();
    public reorderCounters = output<{ previousIndex: number; currentIndex: number }>();
    public pressedTileId: string | null = null;
    public currentHint = '';
    public showHint = true;
    public isHintAnimating = false;

    private viewModeService: ViewModeService = inject(ViewModeService);
    private orderingService: OrderingService = inject(OrderingService);

    private shownHints: Set<string> = new Set();

    constructor() {
        // Set up an effect to update the order when the counter list changes
        effect(() => {
            this.counterList$();
            this.updateOrder();
        });
    }

    private updateOrder(): void {
        const counters = this.counterList$();
        const order = this.orderingService.getOrder()();

        // Add any new counters to the order
        counters.forEach((counter) => {
            if (!order.includes(counter.id)) {
                this.orderingService.addToOrder(counter.id);
            }
        });

        // Remove any deleted counters from the order
        const validIds = new Set(counters.map((c) => c.id));
        const filteredOrder = order.filter((id) => validIds.has(id));
        if (filteredOrder.length !== order.length) {
            this.orderingService.setOrder(filteredOrder);
        }
    }

    public orderedCounters = computed(() => {
        const counters = this.counterList$();
        const order = this.orderingService.getOrder()();

        // Sort counters according to the order
        return counters.sort((a, b) => {
            const indexA = order.indexOf(a.id);
            const indexB = order.indexOf(b.id);
            return indexA - indexB;
        });
    });

    public ngOnInit(): void {
        this.viewMode = this.viewModeService.getViewMode();
        this.updateHint();
    }

    public updateHint(): void {
        if (this.isHintAnimating) return;

        this.isHintAnimating = true;
        const hintData = hints as HintData;

        // If we've shown all hints, reset the tracking
        if (this.shownHints.size >= hintData.hints.length) {
            this.shownHints.clear();
        }

        // Get available hints (ones we haven't shown yet)
        const availableHints = hintData.hints.filter((hint) => !this.shownHints.has(hint));

        // Select a random hint from available hints
        const randomIndex = Math.floor(Math.random() * availableHints.length);
        const newHint = availableHints[randomIndex];

        this.currentHint = newHint;
        this.shownHints.add(newHint);

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
        if (type === PressType.Click) {
            this.navigateToDetail.emit(id);
        } else if (type === PressType.LongPress) {
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

    public addCounterHandle(preset: string | undefined = undefined): void {
        this.addCounter.emit(preset);
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

    public onDrop(event: CdkDragDrop<HomeViewCounters>): void {
        const previousIndex = event.previousIndex;
        const currentIndex = event.currentIndex;

        // Update the order in the service
        this.orderingService.updateOrder(previousIndex, currentIndex);

        // Emit the reorder event
        this.reorderCounters.emit({
            previousIndex,
            currentIndex,
        });
    }
}
