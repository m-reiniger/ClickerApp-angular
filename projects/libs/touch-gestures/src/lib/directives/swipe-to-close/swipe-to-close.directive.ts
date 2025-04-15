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
    selector: '[libSwipeToClose]',
    standalone: true,
    hostDirectives: [
        {
            directive: SwipeDirective,
            inputs: ['swipeThreshold'],
            outputs: ['swipe', 'swipeState'],
        },
    ],
})
export class SwipeToCloseDirective {
    @Input() public animationDuration = 300; // ms
    @Input() public swipeThreshold = 175;
    @Input() public scrollContainerId = ''; // @TODO: if not set, document scroll container should be used
    @Input() public swipeDirection: SwipeDirection = SwipeDirection.Up;

    @Output() public closeHandler = new EventEmitter<void>();

    private readonly element: ElementRef = inject(ElementRef);

    private scrollDistanceUntilEnd = 0;

    @HostListener('swipe', ['$event'])
    public onSwipe(swipe: {
        direction: SwipeDirection;
        amount: number;
        swipeThreshold: number;
    }): void {
        if (swipe.direction === this.swipeDirection) {
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

        const isScrolledToEnd = this.isScrolledToEnd(
            document.getElementById(this.scrollContainerId)
        );

        if (isScrolledToEnd && this.scrollDistanceUntilEnd === 0) {
            this.scrollDistanceUntilEnd = state.amount ?? 0;
        }

        if (isScrolledToEnd && state.isSwiping && state.direction === this.swipeDirection) {
            this.moveElement(state.amount ?? 0);
        } else if (!state.isSwiping) {
            if (!state.wasSwipe) {
                this.resetSwipeStyleChanges();
            }
            this.scrollDistanceUntilEnd = 0;
        }
    }

    private handleSwipeUp(
        element: ElementRef<HTMLElement>,
        swipeThreshold: number,
        swipeAmount?: number
    ): void {
        if (!element || !this.isScrolledToEnd(document.getElementById(this.scrollContainerId)))
            return;

        if (swipeAmount && swipeAmount - this.scrollDistanceUntilEnd < swipeThreshold) return;

        this.animateSwipeOut(element, swipeAmount ?? 0);

        setTimeout(() => {
            this.closeHandler.emit();
        }, this.animationDuration);
    }

    private isScrolledToEnd(element: HTMLElement | null): boolean {
        if (!element) return true;

        switch (this.swipeDirection) {
            case SwipeDirection.Up:
                return element.scrollHeight - element.scrollTop <= element.clientHeight;
            case SwipeDirection.Down:
                return element.scrollTop === 0;
            case SwipeDirection.Left:
                return element.scrollLeft + element.clientWidth >= element.scrollWidth;
            case SwipeDirection.Right:
                return element.scrollLeft === 0;
            default:
                return true;
        }
    }

    private moveElement(amount: number): void {
        switch (this.swipeDirection) {
            case SwipeDirection.Up:
                this.element.nativeElement.style.top = `-${(amount || 0) - this.scrollDistanceUntilEnd}px`;
                break;
            case SwipeDirection.Left:
                this.element.nativeElement.style.left = `-${(amount || 0) - this.scrollDistanceUntilEnd}px`;
                break;
            case SwipeDirection.Right:
                this.element.nativeElement.style.right = `-${(amount || 0) - this.scrollDistanceUntilEnd}px`;
                break;
            case SwipeDirection.Down:
                this.element.nativeElement.style.bottom = `-${(amount || 0) - this.scrollDistanceUntilEnd}px`;
                break;
        }
    }

    private resetSwipeStyleChanges(): void {
        switch (this.swipeDirection) {
            case SwipeDirection.Up:
                this.element.nativeElement.style.top = '';
                break;
            case SwipeDirection.Left:
                this.element.nativeElement.style.left = '';
                break;
            case SwipeDirection.Right:
                this.element.nativeElement.style.right = '';
                break;
            case SwipeDirection.Down:
                this.element.nativeElement.style.bottom = '';
                break;
        }
    }

    private animateSwipeOut(element: ElementRef<HTMLElement>, swipeAmount: number): void {
        switch (this.swipeDirection) {
            case SwipeDirection.Up:
                element.nativeElement.style.transform = `translateY(-${swipeAmount}%)`;
                element.nativeElement.style.transition = `transform ${this.animationDuration}ms ease-out`;
                element.nativeElement.style.transform = `translateY(-${swipeAmount}%)`;
                break;
            case SwipeDirection.Left:
                element.nativeElement.style.transform = `translateX(-${swipeAmount}%)`;
                element.nativeElement.style.transition = `transform ${this.animationDuration}ms ease-out`;
                element.nativeElement.style.transform = `translateX(-${swipeAmount}%)`;
                break;
            case SwipeDirection.Right:
                element.nativeElement.style.transform = `translateX(${swipeAmount}%)`;
                element.nativeElement.style.transition = `transform ${this.animationDuration}ms ease-out`;
                element.nativeElement.style.transform = `translateX(${swipeAmount}%)`;
                break;
            case SwipeDirection.Down:
                element.nativeElement.style.transform = `translateY(${swipeAmount}%)`;
                element.nativeElement.style.transition = `transform ${this.animationDuration}ms ease-out`;
                element.nativeElement.style.transform = `translateY(${swipeAmount}%)`;
                break;
        }
    }
}
