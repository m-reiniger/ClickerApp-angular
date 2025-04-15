import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    inject,
    Input,
    Output,
} from '@angular/core';

import { SwipeDirection, SwipeDirective } from '@libs/touch-gestures';

@Directive({
    selector: '[libSwipeupToClose]',
    standalone: true,
    hostDirectives: [
        {
            directive: SwipeDirective,
            inputs: ['swipeThreshold'],
            outputs: ['swipe', 'swipeState'],
        },
    ],
})
export class SwipeupToCloseDirective {
    @Input() public animationDuration = 300; // ms
    @Input() public swipeThreshold = 175;
    @Input() public scrollContainerId = '';

    @Output() public closeHandler = new EventEmitter<void>();

    private readonly element: ElementRef = inject(ElementRef);

    private scrollDistanceUntilBottom = 0;

    @HostListener('swipe', ['$event'])
    public onSwipe(swipe: {
        direction: SwipeDirection;
        amount: number;
        swipeThreshold: number;
    }): void {
        if (swipe.direction === SwipeDirection.Up) {
            this.handleSwipeUp(this.element, swipe.swipeThreshold, swipe.amount);
        }
    }

    @HostListener('swipeState', ['$event'])
    public onSwipeStateChange(state: {
        isSwiping: boolean;
        direction?: SwipeDirection;
        amount?: number;
        wasSwipe?: boolean;
    }): void {
        if (!this.element) return;

        const isScrolledToBottom = this.isScrolledToBottom(
            document.getElementById(this.scrollContainerId)
        );

        if (isScrolledToBottom && this.scrollDistanceUntilBottom === 0) {
            this.scrollDistanceUntilBottom = state.amount ?? 0;
        }

        if (isScrolledToBottom && state.isSwiping && state.direction === SwipeDirection.Up) {
            this.element.nativeElement.style.top = `-${(state.amount || 0) - this.scrollDistanceUntilBottom}px`;
        } else if (!state.isSwiping) {
            if (!state.wasSwipe) {
                this.resetSwipeStyleChanges();
            }
            this.scrollDistanceUntilBottom = 0;
            // setTimeout(() => {
            //     this.resetSwipeStyleChanges();
            // }, this.animationDuration);
        }
    }

    private resetSwipeStyleChanges(): void {
        this.element.nativeElement.style.top = '';
    }

    private handleSwipeUp(
        element: ElementRef<HTMLElement>,
        swipeThreshold: number,
        swipeAmount?: number
    ): void {
        if (!element || !this.isScrolledToBottom(document.getElementById(this.scrollContainerId)))
            return;

        if (swipeAmount && swipeAmount - this.scrollDistanceUntilBottom < swipeThreshold) return;

        element.nativeElement.style.transform = `translateY(-${swipeAmount}%)`;
        element.nativeElement.style.transition = `transform ${this.animationDuration}ms ease-out`;
        element.nativeElement.style.transform = `translateY(-${swipeAmount}%)`;

        setTimeout(() => {
            this.closeHandler.emit();
        }, this.animationDuration);
    }

    private isScrolledToBottom(element: HTMLElement | null): boolean {
        if (!element) return true;

        return element.scrollHeight - element.scrollTop <= element.clientHeight;
    }
}
